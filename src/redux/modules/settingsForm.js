import { takeLatest, call, put } from 'redux-saga/effects';
import { getJeedomVersion } from '../utils/jeedom';
import { setStorageSettings } from '../utils/storage';

// Actions
export const SETTINGS_FORM_SAVE_REQUESTED = 'SETTINGS_FORM_SAVE_REQUESTED';
export const SETTINGS_FORM_CHECK_FAILED = 'SETTINGS_FORM_CHECK_FAILED';
export const SETTINGS_FORM_SAVE_SUCCEEDED = 'SETTINGS_FORM_SAVE_SUCCEEDED';
export const SETTINGS_FORM_SAVE_FAILED = 'SETTINGS_FORM_SAVE_FAILED';

// Reducer
const initialState = {
  checkFailed: false,
  saveRequested: false,
  saveFailed: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SETTINGS_FORM_SAVE_REQUESTED:
      return { checkFailed: false, saveRequested: true, saveFailed: false };

    case SETTINGS_FORM_CHECK_FAILED:
      return { checkFailed: true, saveRequested: false, saveFailed: false }

    case SETTINGS_FORM_SAVE_FAILED:
      return { checkFailed: false, saveRequested: false, saveFailed: true }

    case SETTINGS_FORM_SAVE_SUCCEEDED:
      return { checkFailed: false, saveRequested: false, saveFailed: false }

    default: return state;
  }
}

// Action Creators
export function saveSettingsForm(payload) {
  return { type: SETTINGS_FORM_SAVE_REQUESTED, payload}
}
export function checkSettingsFormFailed() {
  return { type: SETTINGS_FORM_CHECK_FAILED }
}
export function saveSettingsFormSucceeded(payload) {
  return { type: SETTINGS_FORM_SAVE_SUCCEEDED, payload }
}
export function saveSettingsFormFailed() {
  return { type: SETTINGS_FORM_SAVE_FAILED }
}


// Side effects
export function* saga() {
  yield takeLatest(SETTINGS_FORM_SAVE_REQUESTED, settingsFormSaveSaga);
}

function* settingsFormSaveSaga(action) {
  try {
    const response = yield call(getJeedomVersion, action.payload);

    if (response.error) {
      throw new Error(response.error.message);
    }
  } catch (e) {
    yield put(checkSettingsFormFailed(e))
    return;
  }

  try {
    yield call(setStorageSettings, action.payload);
    yield put(saveSettingsFormSucceeded(action.payload));

    if (action.payload.onSuccess) {
      yield put(action.payload.onSuccess());
    }
  } catch (e) {
    yield put(saveSettingsFormFailed(e))
  }
}