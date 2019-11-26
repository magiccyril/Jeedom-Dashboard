import { takeEvery, takeLatest, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment } from '../utils/jeedom';

import { SUMMARY_ID } from '../../constants/equipments';

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

      return {
        homeTemperature: homeTemperature ? parseFloat(homeTemperature.currentValue).toFixed(1) : '-',
        outsideTemperature: outsideTemperature ? outsideTemperature.currentValue : '-',
        outsideRain: outsideRain ? outsideRain.currentValue : '-',
        light: light.currentValue,
        presence: {
          cyril: presenceCyril.currentValue,
          helena: presenceHelena.currentValue,
        }
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
    yield delay(60 * 1000);
  }
}

function* summaryRequestSaga() {
  try {
    const payload = yield call(getJeedomEquipment, SUMMARY_ID);
    yield put(summaryLoaded(payload));
  } catch (e) {
    yield put(summaryErrored(e));
  }
}