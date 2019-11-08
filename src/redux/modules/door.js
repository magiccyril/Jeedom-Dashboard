import { takeEvery, call, put, putResolve } from 'redux-saga/effects';
import { getJeedomCommand, getJeedomCommandHistory } from '../utils/jeedom';
import { DateTime } from 'luxon';

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

// Reducer
const initialState = {
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DOOR_STATUS_REQUESTED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: true,
        }
      };
    
    case DOOR_STATUS_ERRORED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: true,
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
  return { type: DOOR_STATUS_WITH_HISTORY_REQUESTED, payload: payload }
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
  return { type: DOOR_HISTORY_REQUESTED, payload: payload }
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

// Side effects
export function* saga() {
  yield takeEvery(DOOR_STATUS_WITH_HISTORY_REQUESTED, doorStatusWithHistoryRequestSaga);
  yield takeEvery(DOOR_STATUS_REQUESTED, doorStatusRequestSaga);
  yield takeEvery(DOOR_HISTORY_REQUESTED, doorHistoryRequestSaga);
}

function* doorStatusWithHistoryRequestSaga(action) {
  //yield fork(doorStatusRequestSaga, action);
  //yield fork(doorHistoryRequestSaga, action);
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
    const history = yield call(getJeedomCommandHistory, action.payload.id);
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
