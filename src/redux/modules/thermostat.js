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
  let id;
  switch (action.type) {
    case THERMOSTAT_REQUESTED:
      if (!action.id) {
        return { ...state };
      }

      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          id: action.id,
          loading: true,
          error: false,
        },
      };

    case THERMOSTAT_LOADED:
      id = action.payload.id;

      if (!id || !action.payload.thermostat) {
        return { ...state };
      }

      let loadedThermostat = action.payload.thermostat;
      loadedThermostat.loading = false;
      loadedThermostat.error = false;
      return {
        ...state,
        [id]: loadedThermostat,
      };

    case THERMOSTAT_ERRORED:
      id = action.payload.id;

      if (!id) {
        return { ...state };
      }

      return {
        ...state,
        [id]: {
          ...state[id],
          id: id,
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
export function thermostatLoaded(payload) {
  return {
    type: THERMOSTAT_LOADED,
    payload: { 
      id: payload.id,
      thermostat: payload.thermostat
    }
  }
}
export function thermostatErrored(payload) {
  return {
    type: THERMOSTAT_ERRORED,
    payload: {
      id: payload.id,
      error: payload.error,
    }
  };
}
export function thermostatModeChangeRequested(payload) {
  return {
    type: THERMOSTAT_MODE_CHANGE_REQUESTED,
    payload: {
      id: payload.id,
      cmd: payload.cmd,
    }
  };
}

// Side effects
export function* saga() {
  yield takeEvery(THERMOSTAT_REQUESTED, thermostatRequestSaga);
}

export function* thermostatRequestSaga(action) {
  const thermostatId = action.id;

  try {
    const equipment = yield call(getJeedomEquipment, thermostatId);

    // Name
    const thermostatName = equipment.name;
    // Modes
    const availableModes = equipment.cmds.filter(el => (
      el.generic_type === 'THERMOSTAT_SET_MODE' && el.isVisible === '1'
    ));
    let thermostatModes = [];
    availableModes.forEach(mode => {
      thermostatModes.push({
        id: mode.id,
        name: mode.name,
        order: mode.order,
      })
    });
    // Current mode
    const currentMode = equipment.cmds.find(el => (
      el.logicalId === 'mode'
    ));
    const thermostatCurrentMode = thermostatModes.find(mode => mode.name === currentMode.currentValue);
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

    const payload = {
      id: thermostatId,
      thermostat: thermostat,
    }
    yield put(thermostatLoaded(payload));
  } catch (e) {
    yield put(thermostatErrored({
      id: thermostatId,
      error: e,
    }));
  }
}
