import { takeEvery, call, put } from 'redux-saga/effects';
import { getJeedomEquipment } from '../utils/jeedom';

// Actions
export const THERMOSTAT_REQUESTED = 'THERMOSTAT_REQUESTED';
export const THERMOSTAT_LOADED = 'THERMOSTAT_LOADED';
export const THERMOSTAT_ERRORED = 'THERMOSTAT_ERRORED';
export const THERMOSTAT_MODE_CHANGE_REQUESTED = 'THERMOSTAT_MODE_CHANGE_REQUESTED';

// Reducer
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case THERMOSTAT_REQUESTED:
      if (!action.id) {
        return { ...state };
      }

      return {
        ...state,
        [action.id]: {
          id: action.id,
          loading: true,
          error: false,
        },
      };

    case THERMOSTAT_LOADED:
      if (!action.payload.id || !action.payload.thermostat) {
        return { ...state };
      }

      let loadedThermostat = action.payload.thermostat;
      loadedThermostat.loading = false;
      loadedThermostat.error = false;
      return {
        ...state,
        [action.payload.id]: loadedThermostat,
      };

    case THERMOSTAT_ERRORED:
      if (!action.payload.id) {
        return { ...state };
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          id: action.payload.id,
          loading: false,
          error: true,
        },
      };

    default: return state;
  }
}

// Action Creators
export function thermostatRequested(id) {
  return { type: THERMOSTAT_REQUESTED, id}
}
export function thermostatLoaded(id, thermostat) {
  return { type: THERMOSTAT_LOADED, payload: { id, thermostat } }
}
export function thermostatErrored(id, error) {
  return { type: THERMOSTAT_ERRORED, payload: { id, error } };
}
export function thermostatModeChangeRequested(id, mode) {
  return { type: THERMOSTAT_MODE_CHANGE_REQUESTED, payload: { id, mode } };
}

// Side effects
export function* saga() {
  yield takeEvery(THERMOSTAT_REQUESTED, thermostatRequestSaga);
}

export function* thermostatRequestSaga(action) {
  try {
    const thermostatId = action.id;

    const equipment = yield call(getJeedomEquipment, thermostatId);

    // Name
    const thermostatName = equipment.name;
    // Modes
    const availableModes = equipment.cmds.filter(el => (
      el.generic_type === 'THERMOSTAT_SET_MODE' && el.isVisible === '1'
    ));
    let thermostatModes = {};
    availableModes.forEach(mode => thermostatModes[mode.id] = mode.name);
    // Current mode
    const currentMode = equipment.cmds.find(el => (
      el.logicalId === 'mode'
    ));
    const thermostatCurrentMode = Object.keys(thermostatModes).find(key => thermostatModes[key] === currentMode.currentValue);
    // Power
    const thermostatPower = equipment.cmds.find(el => (
      el.logicalId === 'power'
    ));
    // Temeprature
    const thermostatTemperature = equipment.cmds.find(el => (
      el.logicalId === 'temperature'
    ));
    // SetPoint
    const thermostatSetPoint = equipment.cmds.find(el => (
      el.logicalId === 'order'
    ));

    if (!thermostatName || !thermostatPower || !thermostatTemperature || !thermostatSetPoint) {
      throw new TypeError('Error when parsing thermostat');
    }

    const thermostat = {
      id: thermostatId,
      name: thermostatName,
      modes: thermostatModes,
      currentMode: thermostatCurrentMode,
      power: thermostatPower.currentValue,
      temperature: thermostatTemperature.currentValue,
      setpoint: thermostatSetPoint.currentValue,
    }
    yield put(thermostatLoaded(thermostatId, thermostat));
  } catch (e) {
    yield put(thermostatErrored(e));
  }
}
