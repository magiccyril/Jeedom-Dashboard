import { takeEvery, takeLatest, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment } from '../utils/jeedom';

const SUMMARY_EQUIPMENT_ID = 185;
const REFRESH_DELAY = 60 * 1000;

// Actions
export const SUMMARY_INTERVAL_REGISTRATION = 'SUMMARY_INTERVAL_REGISTRATION';
export const SUMMARY_REQUESTED = 'SUMMARY_REQUESTED';
export const SUMMARY_LOADED = 'SUMMARY_LOADED';
export const SUMMARY_ERRORED = 'SUMMARY_ERRORED';

// Reducer
const initialState = {
  homeTemperature: '-',
  outsideTemperature: '-',
  outsideRain: '-',
  presence: {
    cyril: false,
    helena: false,
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SUMMARY_LOADED:
      const cmds = action.payload.cmds;

      const homeTemperature = cmds.find(el => (el.name === 'temp-home'));
      const outsideTemperature = cmds.find(el => (el.name === 'temp-outside'));
      const outsideRain = cmds.find(el => (el.name === 'rain'));
      const light = cmds.find(el => (el.name === 'light'));
      const presenceCyril = cmds.find(el => (el.name === 'presence-cyril'));
      const presenceHelena = cmds.find(el => (el.name === 'presence-helena'));
      const mail = cmds.find(el => (el.name === 'mail'));

      return {
        homeTemperature: homeTemperature ? parseFloat(homeTemperature.currentValue).toFixed(1) : '-',
        outsideTemperature: outsideTemperature ? outsideTemperature.currentValue : '-',
        outsideRain: outsideRain ? outsideRain.currentValue : '-',
        light: light.currentValue,
        presence: {
          cyril: presenceCyril.currentValue === 1 ? true : false,
          helena: presenceHelena.currentValue === 1 ? true : false,
        },
        mail: mail.currentValue === 1 ? true : false,
      };

    default: return state;
  }
}

// Action Creators
export function setSummaryIntervalRegistration() {
  return { type: SUMMARY_INTERVAL_REGISTRATION }
}
export function summaryRequested() {
  return { type: SUMMARY_REQUESTED }
}
export function summaryLoaded(payload) {
  return { type: SUMMARY_LOADED, payload }
}
export function summaryErrored(e) {
  return { type: SUMMARY_ERRORED, payload: e };
}

// Side effects
export function* saga() {
  yield takeEvery(SUMMARY_REQUESTED, summaryRequestSaga);
  yield takeLatest(SUMMARY_INTERVAL_REGISTRATION, summaryIntervalRegistrationSaga);
}

function* summaryIntervalRegistrationSaga() {
  while(true) {
    yield put(summaryRequested())
    yield delay(REFRESH_DELAY);
  }
}

function* summaryRequestSaga() {
  try {
    const payload = yield call(getJeedomEquipment, SUMMARY_EQUIPMENT_ID);
    yield put(summaryLoaded(payload));
  } catch (e) {
    yield put(summaryErrored(e));
  }
}