import { takeEvery, takeLatest, call, put } from 'redux-saga/effects';
import { getJeedomVersion } from '../utils/jeedom';
import { getStorageSettings } from '../utils/storage';
import { SETTINGS_FORM_SAVE_SUCCEEDED } from './settingsForm';

// Actions
export const APP_LAUNCH_REQUESTED = 'APP_LAUNCH_REQUESTED';
export const APP_LAUNCH_SUCCEEDED = 'APP_LAUNCH_SUCCEEDED';
export const APP_LAUNCH_FAILED = 'APP_LAUNCH_FAILED';

// Reducer
const initialState = {
  show: true,
  showSetup: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case APP_LAUNCH_FAILED:
      return { show: true, showSetup: true }
      
    case APP_LAUNCH_SUCCEEDED:
      return { show: false, showSetup: false };

    default: return state;
  }
}

// Action Creators
export function appLaunchRequested() {
  return { type: APP_LAUNCH_REQUESTED };
}
export function appLaunchSucceeded() {
  return { type: APP_LAUNCH_SUCCEEDED };
}
export function appLaunchFailed() {
  return { type: APP_LAUNCH_FAILED };
}

// Side effects
export function* saga() {
  yield takeLatest(APP_LAUNCH_REQUESTED, appLaunchSaga);
  yield takeEvery(SETTINGS_FORM_SAVE_SUCCEEDED, settingsFormSaveSucceededSaga);
}

function* appLaunchSaga() {
  try {
    const settings = yield call(getStorageSettings);

    if (!settings.url || !settings.apikey) {
      throw new Error('Settings undefined');
    }

    const response = yield call(getJeedomVersion, settings);
    if (response.error) {
      throw new Error(response.error.message);
    }

    yield put(appLaunchSucceeded());
  } catch (e) {
    yield put(appLaunchFailed(e))
    return;
  }
}

function* settingsFormSaveSucceededSaga() {
  yield put(appLaunchSucceeded());
}