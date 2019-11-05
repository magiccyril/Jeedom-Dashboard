import { takeLatest, put, delay } from 'redux-saga/effects';

const SHOW_SNACKBAR_DELAY = 10 * 1000;
const DEFAULT_TYPE = 'success';

// Actions
const SNACKBAR_SHOW = 'SNACKBAR_SHOW';
const SNACKBAR_HIDE = 'SNACKBAR_HIDE';

// Reducer
const initialState = {
  text: '',
  type: 'success',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SNACKBAR_SHOW:
      return { text: action.payload.text, type: action.payload.type }

    case SNACKBAR_HIDE:
      return { text: '' }

    default: return state;
  }
}

// Action Creators
export function showSnackbar(text) {
  return { type: SNACKBAR_SHOW, payload: {
    text: text,
    type:  DEFAULT_TYPE,
  }};
}
export function showSuccessSnackbar(text) {
  return { type: SNACKBAR_SHOW, payload: {
    text: text,
    type: 'success',
  }};
}
export function showWarningSnackbar(text) {
  return { type: SNACKBAR_SHOW, payload: {
    text: text,
    type: 'warning',
  }};
}
export function showErrorSnackbar(text) {
  return { type: SNACKBAR_SHOW, payload: {
    text: text,
    type: 'danger',
  }};
}
export function hideSnackbar() {
  return { type: SNACKBAR_HIDE };
}

// Side effects
export function* saga() {
  yield takeLatest(SNACKBAR_SHOW, snackbarSaga);
}

function* snackbarSaga() {
  yield delay(SHOW_SNACKBAR_DELAY);
  yield put(hideSnackbar())
}