import { takeEvery, call, put } from 'redux-saga/effects';
import { getJeedomEquipment } from '../utils/jeedom';
import { getStorageSettings } from '../utils/storage';

// Actions
export const CAMERA_IMAGE_REQUESTED = 'CAMERA_IMAGE_REQUESTED';
export const CAMERA_IMAGE_LOADED = 'CAMERA_IMAGE_LOADED';
export const CAMERA_IMAGE_ERRORED = 'CAMERA_IMAGE_ERRORED';

// Reducer
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CAMERA_IMAGE_LOADED:
      const cameraId = action.payload.cameraId;
      const imageUrl = action.payload.imageUrl;

      if (!cameraId || !imageUrl) {
        return { ...state };
      }

      return {
        ...state,
        [cameraId]: imageUrl,
      };

    default: return state;
  }
}

// Action Creators
export function cameraImageRequested(cameraId) {
  return { type: CAMERA_IMAGE_REQUESTED, cameraId: cameraId}
}
export function cameraImageLoaded(cameraId, imageUrl) {
  return { type: CAMERA_IMAGE_LOADED, payload: { cameraId, imageUrl } }
}
export function cameraImageErrored(e) {
  return { type: CAMERA_IMAGE_ERRORED, error: e };
}

// Side effects
export function* saga() {
  yield takeEvery(CAMERA_IMAGE_REQUESTED, cameraImageRequestSaga);
}

export function* cameraImageRequestSaga(action) {
  try {
    const cameraId = action.cameraId;

    const settings = yield call(getStorageSettings);
    const equipment = yield call(getJeedomEquipment, cameraId);

    const cameraUrl = equipment.cmds.find(el => (
      el.generic_type === 'CAMERA_URL'
    ));
    
    if (cameraUrl === undefined) {
      throw new TypeError('Camera not detected');
    }

    yield put(cameraImageLoaded(cameraId, settings.url + cameraUrl.currentValue));
  } catch (e) {
    yield put(cameraImageErrored(e));
  }
}
