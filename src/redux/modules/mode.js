import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';
import { showErrorSnackbar } from './snackbar';

export const REFRESH_DELAY = 1000;

export const SNACKBAR_ERROR = 'Erreur lors du changement de mode !';

// Actions
export const MODE_LIST_REQUESTED = 'MODE_LIST_REQUESTED';
export const MODE_LIST_LOADED = 'MODE_LIST_LOADED';
export const MODE_LIST_ERRORED = 'MODE_LIST_ERRORED';
export const MODE_CHANGE_REQUESTED = 'MODE_CHANGE_REQUESTED';
export const MODE_CHANGE_SUCCEEDED = 'MODE_CHANGE_SUCCEEDED';
export const MODE_CHANGE_ERRORED = 'MODE_CHANGE_ERRORED';

// Reducer
const initialState = {
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case MODE_LIST_REQUESTED:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          id: action.id,
          loading: true,
          error: false,
        }
      }
    
    case MODE_LIST_ERRORED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          id: action.payload.id,
          loading: false,
          error: true,
        }
      }

    case MODE_LIST_LOADED:
      const equipment = action.payload.equipment;
      const cmds = equipment.cmds;

      let modes = [];
      cmds.forEach(cmd => {
        if (cmd.isVisible === '1' && cmd.logicalId !== 'currentMode') {
          modes.push({
            id: cmd.id,
            name: cmd.name,
            order: cmd.order,
          });
        }
      });

      const currentModeValue = cmds.find(el => (el.logicalId === 'currentMode')).currentValue;
      const currentMode = modes.find(mode => (mode.name === currentModeValue));

      return {
        ...state,
        [action.payload.id]: {
          id: action.payload.id,
          currentMode: currentMode,
          modes: modes,
          loading: false,
          error: false,
        }
      };
    
    case MODE_CHANGE_REQUESTED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: true,
        }
      }
    
    case MODE_CHANGE_ERRORED:
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            loading: false,
          }
        }
    
    case MODE_CHANGE_SUCCEEDED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: false,
        }
      }

    default: return state;
  }
}

// Action Creators
export function modeListRequested(id) {
  return { type: MODE_LIST_REQUESTED, id: id }
}
export function modeListLoaded(payload) {
  return {
    type: MODE_LIST_LOADED,
    payload: {
      id: payload.id,
      equipment: payload.equipment,
    }
  }
}
export function modeListErrored(payload) {
  return {
    type: MODE_LIST_ERRORED,
    payload: {
      id: payload.id,
      error: payload.error,
    }
  }
}
export function modeChangeRequested(payload) {
  return { type: MODE_CHANGE_REQUESTED,
    payload: {
      id: payload.id,
      cmd: payload.cmd,
    }
  }
}
export function modeChangeSucceeded(payload) {
  return { type: MODE_CHANGE_SUCCEEDED,
    payload: {
      id: payload.id,
      cmd: payload.cmd,
    }
  }
}
export function modeChangeErrored(payload) {
  return { type: MODE_CHANGE_ERRORED,
    payload: {
      id: payload.id,
      cmd: payload.cmd,
      error: payload.error,
    }
  }
}

// Side effects
export function* saga() {
  yield takeEvery(MODE_LIST_REQUESTED, modeListRequestSaga);
  yield takeEvery(MODE_CHANGE_REQUESTED, modeChangeRequestSaga);
}

export function* modeListRequestSaga(action) {
  try {
    const equipment = yield call(getJeedomEquipment, action.id);
    yield put(modeListLoaded({
      id: action.id,
      equipment
    }));
  } catch (e) {
    yield put(modeListErrored({
      id: action.id,
      error: e,
    }));
  }
}

export function* modeChangeRequestSaga(action) {
  try {
    yield call(execJeedomCmd, action.payload.cmd);
    yield delay(REFRESH_DELAY);
    yield put(modeChangeSucceeded({
      id: action.payload.id,
      cmd: action.payload.cmd,
    }));
  } catch (e) {
    yield put(modeChangeErrored({
      id: action.payload.id,
      cmd: action.payload.cmd,
      error: e,
    }));
    yield put(showErrorSnackbar(SNACKBAR_ERROR));
  } finally {
    yield put(modeListRequested(action.payload.id));
  }
}
