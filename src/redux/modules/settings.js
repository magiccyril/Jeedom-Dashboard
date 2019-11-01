import { takeEvery, put } from 'redux-saga/effects';
import { showSnackbar } from './snackbar';

// Actions
export const SETTINGS_SHOW = 'SETTINGS_SHOW';
export const SETTINGS_HIDE = 'SETTINGS_HIDE';
export const SETTINGS_FORM_SUCCEEDED = 'SETTINGS_FORM_SUCCEEDED';

// Reducer
const initialState = {
  show: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SETTINGS_SHOW:
      return { show: true, checkFailed: false, saveRequested: false, saveFailed: false };

    case SETTINGS_HIDE:
      return { show: false, checkFailed: false, saveRequested: false, saveFailed: false };

    default: return state;
  }
}

// Action Creators
export function showSettings(e) {
  if (e) {
    e.preventDefault();
  }
  return { type: SETTINGS_SHOW };
}
export function hideSettings() {
  return { type: SETTINGS_HIDE };
}
export function settingsFormSucceeded() {
  return { type: SETTINGS_FORM_SUCCEEDED };
}

// Side effects
export function* saga() {
  yield takeEvery(SETTINGS_FORM_SUCCEEDED, settingsFormSucceededSaga);
}

function* settingsFormSucceededSaga() {
  yield put(hideSettings());
  yield put(showSnackbar('Paramètres enregistrés !'));
}