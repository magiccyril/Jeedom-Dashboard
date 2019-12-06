import { takeEvery, call, put, putResolve, delay } from 'redux-saga/effects';
import { getJeedomCommand, getJeedomCommandHistory, execJeedomCmd } from '../utils/jeedom';
import { DateTime } from 'luxon';
import { showErrorSnackbar } from './snackbar';

export const DOOR_HISTORY_DEFAULT_DAYS_NUMBER = 7;
export const REFRESH_DELAY = 1000 * 1;
export const SNACKBAR_ERROR = "Erreur lors l'ouverture / fermeture de la porte";

// Actions
export const DOOR_STATUS_WITH_HISTORY_REQUESTED = 'DOOR_STATUS_WITH_HISTORY_REQUESTED';
export const DOOR_STATUS_REQUESTED = 'DOOR_STATUS_REQUESTED';
export const DOOR_STATUS_LOADED = 'DOOR_STATUS_LOADED';
export const DOOR_STATUS_ERRORED = 'DOOR_STATUS_ERRORED';
export const DOOR_HISTORY_REQUESTED = 'DOOR_HISTORY_REQUESTED';
export const DOOR_HISTORY_LOADED = 'DOOR_HISTORY_LOADED';
export const DOOR_HISTORY_ERRORED = 'DOOR_HISTORY_ERRORED';
export const DOOR_HISTORY_SHOW = 'DOOR_HISTORY_SHOW';
export const DOOR_HISTORY_HIDE = 'DOOR_HISTORY_HIDE';
export const DOOR_TRIGGER_REQUESTED = 'DOOR_TRIGGER_REQUESTED';
export const DOOR_TRIGGER_ERRORED = 'DOOR_TRIGGER_ERRORED';
export const DOOR_TRIGGER_SUCCEEDED = 'DOOR_TRIGGER_SUCCEEDED';

// Reducer
const initialState = {
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DOOR_STATUS_REQUESTED:
    case DOOR_TRIGGER_REQUESTED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: true,
        }
      };
    
    case DOOR_STATUS_ERRORED:
    case DOOR_TRIGGER_ERRORED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: true,
        }
      }

    case DOOR_TRIGGER_SUCCEEDED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: false,
        }
      }

    case DOOR_STATUS_LOADED:
      const statusPayload = action.payload;

      let label = statusPayload.name;
      let singularComplement = 'de la';
      if (statusPayload.display.parameters
        && statusPayload.display.parameters.label
        && statusPayload.display.parameters.singularComplement) {
        label = statusPayload.display.parameters.label;
        singularComplement = statusPayload.display.parameters.singularComplement;
      }

      return {
        ...state,
        [statusPayload.id]: {
          id: statusPayload.id,
          name: statusPayload.name,
          order: statusPayload.order,
          open: statusPayload.currentValue === 0 ? false : true,
          label: label,
          singularComplement: singularComplement,
          loading: false,
          error: false,
        }
      };

      case DOOR_HISTORY_REQUESTED:
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            loading: true,
            error: false,
          }
        };
      
      case DOOR_HISTORY_ERRORED:
          return {
            ...state,
            [action.payload.id]: {
              ...state[action.payload.id],
              loading: false,
              error: true,
            }
          };

      case DOOR_HISTORY_LOADED:
        const history = action.payload.history.map(event => ({
          datetime: DateTime.fromFormat(event.datetime, 'yyyy-MM-dd TT'),
          open: event.value === '0' ? false : true,
        })).sort((a, b) => b.datetime.diff(a.datetime));

        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            history: history,
          }
        }
      
      case DOOR_HISTORY_SHOW:
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            showHistory: true,
          }
        };

      case DOOR_HISTORY_HIDE:
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            showHistory: false,
          }
        };

    default: return state;
  }
}

// Action Creators
export function doorStatusWithHistoryRequested(payload) {
  return {
    type: DOOR_STATUS_WITH_HISTORY_REQUESTED,
    payload: {
      id: payload.id,
      days: payload.days ? payload.days : DOOR_HISTORY_DEFAULT_DAYS_NUMBER,
    }
  }
}
export function doorStatusRequested(payload) {
  return { type: DOOR_STATUS_REQUESTED, payload: payload }
}
export function doorStatusLoaded(payload) {
  return { type: DOOR_STATUS_LOADED, payload: payload }
}
export function doorStatusErrored(payload) {
  return { type: DOOR_STATUS_ERRORED, payload: payload }
}
export function doorHistoryRequested(payload) {
  return {
    type: DOOR_HISTORY_REQUESTED,
    payload: {
      id: payload.id,
      days: payload.days ? payload.days : DOOR_HISTORY_DEFAULT_DAYS_NUMBER,
    }
  }
}
export function doorHistoryLoaded(payload) {
  return { type: DOOR_HISTORY_LOADED, payload: payload }
}
export function doorHistoryErrored(payload) {
  return { type: DOOR_HISTORY_ERRORED, payload: payload }
}
export function doorHistoryShow(id) {
  return { type: DOOR_HISTORY_SHOW, payload: { id: id } }
}
export function doorHistoryHide(id) {
  return { type: DOOR_HISTORY_HIDE, payload: { id: id } }
}
export function doorTriggerRequested({id, cmd}) {
  return { type: DOOR_TRIGGER_REQUESTED, payload: {id, cmd}}
}
export function doorTriggerErrored({id, cmd, error}) {
  return { type: DOOR_TRIGGER_ERRORED, payload: {id, cmd, error}}
}
export function doorTriggerSucceeded({id, cmd}) {
  return { type: DOOR_TRIGGER_SUCCEEDED, payload: {id, cmd}}
}

// Side effects
export function* saga() {
  yield takeEvery(DOOR_STATUS_WITH_HISTORY_REQUESTED, doorStatusWithHistoryRequestSaga);
  yield takeEvery(DOOR_STATUS_REQUESTED, doorStatusRequestSaga);
  yield takeEvery(DOOR_HISTORY_REQUESTED, doorHistoryRequestSaga);
  yield takeEvery(DOOR_TRIGGER_REQUESTED, doorTriggerRequestSaga);
}

function* doorStatusWithHistoryRequestSaga(action) {
  yield putResolve(doorStatusRequested(action.payload));
  yield putResolve(doorHistoryRequested(action.payload));
}

function* doorStatusRequestSaga(action) {
  try {
    const command = yield call(getJeedomCommand, action.payload.id);
    yield put(doorStatusLoaded(command));
  } catch (e) {
    yield put(doorStatusErrored({
      id: action.payload.id,
      error: e,
    }));
  }
}

function* doorHistoryRequestSaga(action) {
  try {
    const cmd = action.payload.id;
    const startTime = DateTime.local().minus({days: action.payload.days}).toFormat('yyyy-LL-dd HH:mm:ss');

    const history = yield call(getJeedomCommandHistory, { cmd, startTime });
    const historyPayload = {
      id: action.payload.id,
      history: history,
    }
    yield put(doorHistoryLoaded(historyPayload));
  } catch (e) {
    yield put(doorHistoryErrored({
      id: action.payload.id,
      error: e,
    }));
  }
}

export function* doorTriggerRequestSaga(action) {
  try {
    console.log(action);
    yield call(execJeedomCmd, action.payload.cmd);
    yield delay(REFRESH_DELAY);
    yield put(doorTriggerSucceeded({
      id: action.payload.id,
      cmd: action.payload.cmd,
    }));
  } catch (e) {
    yield put(doorTriggerErrored({
      id: action.payload.id,
      cmd: action.payload.cmd,
      error: e,
    }));
    yield put(showErrorSnackbar(SNACKBAR_ERROR));
  } finally {
    yield put(doorStatusRequested({id: action.payload.id}));
  }
}