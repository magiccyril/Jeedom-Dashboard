import { createStore, applyMiddleware, compose, combineReducers  } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { spawn } from 'redux-saga/effects';

import launchScreen, { saga as launchScreenSaga } from './modules/launchScreen';
import snackbar, { saga as snackBarSaga } from './modules/snackbar';
import summary, { saga as summarySaga } from './modules/summary';
import room, { saga as roomSaga } from './modules/room';
import camera, { saga as cameraSaga } from './modules/camera';
import settings, { saga as settingsSaga }  from './modules/settings';
import settingsForm, { saga as settingsFormSaga } from './modules/settingsForm';

const sagaMiddleware = createSagaMiddleware();

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  launchScreen,
  settings,
  settingsForm,
  snackbar,
  summary,
  room,
  camera,
});

function* rootSaga() {
  yield spawn(launchScreenSaga);
  yield spawn(settingsFormSaga);
  yield spawn(settingsSaga);
  yield spawn(snackBarSaga);
  yield spawn(summarySaga);
  yield spawn(cameraSaga);
  yield spawn(roomSaga);
}

const store = createStore(
  rootReducer,
  storeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(rootSaga);

export default store;