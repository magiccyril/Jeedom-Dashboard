import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';
import { showErrorSnackbar } from './snackbar';

const REFRESH_DELAY = 1000;

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
        ...state, [action.id]: {
          ...state[action.id],
          loading: true,
        }
      }
    
    case MODE_LIST_ERRORED:
      return {
        ...state, [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: true,
        }
      }

    case MODE_LIST_LOADED:
      const cmds = action.payload.cmds;
      const currentModeValue = cmds.find(el => (el.logicalId === 'currentMode')).currentValue;

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

      const currentMode = modes.find(mode => (mode.name === currentModeValue));

      return {
        ...state, [action.payload.id]: {
          currentMode: currentMode,
          modes: modes,
          loading: false,
          error: false,
        }
      };
    
    case MODE_CHANGE_REQUESTED:
      return {
        ...state, [action.payload.equipment]: {
          ...state[action.payload.equipment],
          loading: true,
        }
      }
    
    case MODE_CHANGE_SUCCEEDED:
      return {
        ...state, [action.payload.equipment]: {
          ...state[action.payload.equipment],
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
  return { type: MODE_LIST_LOADED, payload: payload }
}
export function modeListErrored(payload) {
  return { type: MODE_LIST_ERRORED, payload: payload }
}
export function modeChangeRequested(payload) {
  return { type: MODE_CHANGE_REQUESTED, payload: payload }
}
export function modeChangeSucceeded(payload) {
  return { type: MODE_CHANGE_SUCCEEDED, payload: payload }
}
export function modeChangeErrored(e) {
  return { type: MODE_CHANGE_ERRORED, payload: e }
}

// Side effects
export function* saga() {
  yield takeEvery(MODE_LIST_REQUESTED, modeListRequestSaga);
  yield takeEvery(MODE_CHANGE_REQUESTED, modeChangeRequestSaga);
}

function* modeListRequestSaga(action) {
  try {
    const payload = yield call(getJeedomEquipment, action.id);
    yield put(modeListLoaded(payload));
  } catch (e) {
    yield put(modeListErrored({
      id: action.id,
      error: e,
    }));
  }
}

function* modeChangeRequestSaga(action) {
  try {
    yield call(execJeedomCmd, action.payload.cmd);
    yield delay(REFRESH_DELAY);
    yield put(modeChangeSucceeded({
      equipment: action.payload.equipment,
      cmd: action.payload.cmd,
    }));
  } catch (e) {
    yield put(modeChangeErrored(e));
    yield put(showErrorSnackbar('Erreur lors du changement de mode !'));
  } finally {
    yield put(modeListRequested(action.payload.equipment));
  }
}
