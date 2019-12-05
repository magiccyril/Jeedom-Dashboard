import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';

import { showErrorSnackbar } from './snackbar';
import { summaryRequested } from './summary';

export const REFRESH_DELAY = 3 * 1000;

// Actions
export const LIGHT_ALL_STATUS_REQUESTED = 'LIGHT_ALL_STATUS_REQUESTED';
export const LIGHT_ALL_STATUS_LOADED = 'LIGHT_ALL_STATUS_LOADED';
export const LIGHT_ALL_STATUS_ERRORED = 'LIGHT_ALL_STATUS_ERRORED';
export const LIGHT_ALL_OFF_REQUESTED = 'LIGHT_ALL_OFF_REQUESTED';

// Reducer
const initialState = {
  loading: false,
  error: false,
  id: undefined,
  off_cmd_id: undefined,
  lights: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LIGHT_ALL_STATUS_REQUESTED:
      return {
        loading: true,
        error: false,
        id: action.payload.id,
        off_cmd_id: action.payload.off_cmd_id,
        lights: [],
      };

    case LIGHT_ALL_STATUS_ERRORED:
      return {
        ...state,
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
        ...state,
        id: equipment.id,
        loading: false,
        error: false,
        lights: lights,
      };

    default: return state;
  }
}

// Action Creators
export function allLightStatusRequested({id, off_cmd_id}) {
  return { type: LIGHT_ALL_STATUS_REQUESTED, payload: { id, off_cmd_id }}
}
export function allLightStatusErrored({ id, error }) {
  return { type: LIGHT_ALL_STATUS_ERRORED, payload: { id, error }};
}
export function allLightStatusLoaded({ id, equipment }) {
  return { type: LIGHT_ALL_STATUS_LOADED, payload: { id, equipment } }
}

export function allLightsOffRequested({ id, off_cmd_id }) {
  return { type: LIGHT_ALL_OFF_REQUESTED, payload: { id, off_cmd_id } }
}

// Side effects
export function* saga() {
  yield takeEvery(LIGHT_ALL_STATUS_REQUESTED, lightStatusRequestSaga);
  yield takeEvery(LIGHT_ALL_OFF_REQUESTED, lightAllOffRequestSaga);
}

export function* lightStatusRequestSaga(action) {
  try {
    const id = action.payload.id;
    const equipment = yield call(getJeedomEquipment, id);
    yield put(allLightStatusLoaded({ id, equipment }));
  } catch (error) {
    yield put(allLightStatusErrored({ id: action.payload.id, error }));
  }
}

export function* lightAllOffRequestSaga(action) {
  try {
    yield call(execJeedomCmd, action.payload.off_cmd_id);
    yield delay(REFRESH_DELAY);
    yield put(allLightStatusRequested({
      id: action.payload.id,
      off_cmd_id: action.payload.off_cmd_id,
    }));
    yield put(summaryRequested());
  } catch (e) {
    yield put(showErrorSnackbar("Erreur lors de l'extinction des lumières !"));
  }
}
