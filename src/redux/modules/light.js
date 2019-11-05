import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';

import { ALL_LIGHT_OFF_CMD } from '../../constants/commands';
import { ALL_LIGHT_STATUS_ID } from '../../constants/equipments';
import { showErrorSnackbar } from './snackbar';
import { summaryRequested } from './summary';

// Actions
export const LIGHT_ALL_STATUS_REQUESTED = 'LIGHT_ALL_STATUS_REQUESTED';
export const LIGHT_ALL_STATUS_LOADED = 'LIGHT_ALL_STATUS_LOADED';
export const LIGHT_ALL_STATUS_ERRORED = 'LIGHT_ALL_STATUS_ERRORED';
export const LIGHT_ALL_OFF_REQUESTED = 'LIGHT_ALL_OFF_REQUESTED';

// Reducer
const initialState = {
  loading: false,
  error: false,
  lights: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LIGHT_ALL_STATUS_REQUESTED:
      return {
        loading: true,
        error: false,
        lights: [],
      };

    case LIGHT_ALL_STATUS_ERRORED:
      return {
        loading: false,
        error: true,
        lights: [],
      };
    
    case LIGHT_ALL_STATUS_LOADED:
      const cmds = action.payload.cmds;

      let lights = [];
      cmds.forEach(cmd => {
        if (cmd.isVisible === '1' && cmd.logicalId !== 'refresh') {
          let label = cmd.name;
          let singularComplement = 'de la';
          if (cmd.display.parameters
            && cmd.display.parameters.label
            && cmd.display.parameters.singularComplement) {
            label = cmd.display.parameters.label;
            singularComplement = cmd.display.parameters.singularComplement;
          }
          
          lights.push({
            id: cmd.id,
            name: cmd.name,
            order: cmd.order,
            value: cmd.currentValue,
            label: label,
            singularComplement: singularComplement,
          });
        }
      });

      return {
        loading: false,
        error: false,
        lights: lights,
      };

    default: return state;
  }
}

// Action Creators
export function allLightStatusRequested() {
  return { type: LIGHT_ALL_STATUS_REQUESTED }
}
export function allLightStatusLoaded(payload) {
  return { type: LIGHT_ALL_STATUS_LOADED, payload: payload }
}
export function allLightStatusErrored(e) {
  return { type: LIGHT_ALL_STATUS_ERRORED, payload: e };
}

export function allLightsOffRequested() {
  return { type: LIGHT_ALL_OFF_REQUESTED }
}

// Side effects
export function* saga() {
  yield takeEvery(LIGHT_ALL_STATUS_REQUESTED, lightStatusRequestSaga);
  yield takeEvery(LIGHT_ALL_OFF_REQUESTED, lightAllOffRequestSaga);
}

function* lightStatusRequestSaga(action) {
  try {
    const payload = yield call(getJeedomEquipment, ALL_LIGHT_STATUS_ID);
    yield put(allLightStatusLoaded(payload));
  } catch (e) {
    yield put(allLightStatusErrored(e));
  }
}

function* lightAllOffRequestSaga() {
  try {
    yield call(execJeedomCmd, ALL_LIGHT_OFF_CMD);
    yield delay(3 * 1000);
    yield put(allLightStatusRequested());
    yield put(summaryRequested());
  } catch (e) {
    yield put(showErrorSnackbar("Erreur lors de l'extinction des lumières !"));
  }
}
