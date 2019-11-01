import { takeLatest, put, delay } from 'redux-saga/effects';

// Actions
const SNACKBAR_SHOW = 'SNACKBAR_SHOW';
const SNACKBAR_HIDE = 'SNACKBAR_HIDE';

// Reducer
const initialState = {
  text: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SNACKBAR_SHOW:
      return { text: action.text }

    case SNACKBAR_HIDE:
      return { text: '' }

    default: return state;
  }
}

// Action Creators
export function showSnackbar(text) {
  return { type: SNACKBAR_SHOW, text: text };
}
export function hideSnackbar() {
  return { type: SNACKBAR_HIDE };
}

// Side effects
export function* saga() {
  yield takeLatest(SNACKBAR_SHOW, snackbarSaga);
}

function* snackbarSaga() {
  yield delay(10 * 1000);
  yield put(hideSnackbar())
}