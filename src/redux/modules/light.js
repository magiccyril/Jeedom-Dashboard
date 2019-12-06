import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';

import { showErrorSnackbar } from './snackbar';
import { MODE_CHANGE_SUCCEEDED } from './mode';

export const JEEDOM_EQUIPMENT_ID = 190;
export const JEEDOM_OFF_COMMAND_ID = 1094;

export const REFRESH_DELAY = 3 * 1000;
export const LIGHT_ALL_OFF_ERROR_SNACKBAR = "Erreur lors de l'extinction des lumières !";

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
      const equipment = action.payload.equipment;
      const cmds = equipment.cmds;

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
export function allLightStatusErrored({ error }) {
  return { type: LIGHT_ALL_STATUS_ERRORED, payload: { error }};
}
export function allLightStatusLoaded({ equipment }) {
  return { type: LIGHT_ALL_STATUS_LOADED, payload: { equipment } }
}

export function allLightsOffRequested() {
  return { type: LIGHT_ALL_OFF_REQUESTED }
}

// Side effects
export function* saga() {
  yield takeEvery(LIGHT_ALL_STATUS_REQUESTED, lightStatusRequestSaga);
  yield takeEvery(LIGHT_ALL_OFF_REQUESTED, lightAllOffRequestSaga);
  yield takeEvery(MODE_CHANGE_SUCCEEDED, lightStatusRequestSaga)
}

export function* lightStatusRequestSaga() {
  try {
    const equipment = yield call(getJeedomEquipment, JEEDOM_EQUIPMENT_ID);
    yield put(allLightStatusLoaded({ equipment }));
  } catch (error) {
    yield put(allLightStatusErrored({ error }));
  }
}

export function* lightAllOffRequestSaga() {
  try {
    yield call(execJeedomCmd, JEEDOM_OFF_COMMAND_ID);
    yield delay(REFRESH_DELAY);
    yield put(allLightStatusRequested());
  } catch (e) {
    yield put(showErrorSnackbar(LIGHT_ALL_OFF_ERROR_SNACKBAR));
  }
}
