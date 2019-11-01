import { takeEvery, call, put } from 'redux-saga/effects';
import { getJeedomRooms } from '../utils/jeedom';

// Actions
export const ROOM_REQUESTED = 'ROOM_REQUESTED';
export const ROOM_LOADED = 'ROOM_LOADED';
export const ROOM_ERRORED = 'ROOM_ERRORED';

// Reducer
const initialState = {
  loading: false,
  error: false,
  list: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ROOM_REQUESTED:
      return {
        loading: true,
        error: false,
        list: [],
      };
    case ROOM_LOADED:
      return {
        loading: false,
        error: false,
        list: action.payload.map(room => {
          return {id: room.id, name: room.name}
        }),
      };
    case ROOM_ERRORED:
      return {
        loading: false,
        error: true,
        list: [],
    };

    default: return state;
  }
}

// Action Creators
export function getRooms() {
  return { type: ROOM_REQUESTED };
}
export function roomsLoaded(payload) {
  return { type: ROOM_LOADED, payload }
}
export function roomsErrored(e) {
  return { type: ROOM_ERRORED, payload: e };
}

// Side effects
export function* saga() {
  yield takeEvery(ROOM_REQUESTED, roomRequestSaga);
}

function* roomRequestSaga() {
  try {
    const payload = yield call(getJeedomRooms);
    yield put(roomsLoaded(payload));
  } catch (e) {
    yield put(roomsErrored(e));
  }
}