import { createStore, applyMiddleware, compose, combineReducers  } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { spawn } from 'redux-saga/effects';

import launchScreen, { saga as launchScreenSaga } from './modules/launchScreen';
import settingsForm, { saga as settingsFormSaga } from './modules/settingsForm';
import settings, { saga as settingsSaga }  from './modules/settings';
import snackbar, { saga as snackBarSaga } from './modules/snackbar';
import summary, { saga as summarySaga } from './modules/summary';
import room, { saga as roomSaga } from './modules/room';
import camera, { saga as cameraSaga } from './modules/camera';
import light, { saga as lightSaga } from './modules/light';
import door, { saga as doorSaga } from './modules/door';
import mode, { saga as modeSaga } from './modules/mode';
import thermostat, { saga as thermostatSaga } from './modules/thermostat';

const sagaMiddleware = createSagaMiddleware();

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  launchScreen,
  settingsForm,
  settings,
  snackbar,
  summary,
  room,
  camera,
  light,
  door,
  mode,
  thermostat,
});

function* rootSaga() {
  yield spawn(launchScreenSaga);
  yield spawn(settingsFormSaga);
  yield spawn(settingsSaga);
  yield spawn(snackBarSaga);
  yield spawn(summarySaga);
  yield spawn(roomSaga);
  yield spawn(cameraSaga);
  yield spawn(lightSaga);
  yield spawn(doorSaga);
  yield spawn(modeSaga);
  yield spawn(thermostatSaga);
}

const store = createStore(
  rootReducer,
  storeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(rootSaga);

export default store;