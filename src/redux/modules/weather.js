import { takeEvery, call, put, select } from 'redux-saga/effects';
import { getJeedomEquipment, getJeedomCommandHistory } from '../utils/jeedom';
import { DateTime } from 'luxon';

const GENERIC_TYPE = {
  'temperature': 'TEMPERATURE',
  'humidity': 'HUMIDITY',
  'co2': 'CO2',
  'brightness': 'BRIGHTNESS',
  'noise': 'NOISE',
  'presure': 'PRESSURE',
  'rainCurrent': 'RAIN_CURRENT',
  'rainTotal': 'RAIN_TOTAL',
  'windSpeed': 'WIND_SPEED',
  'windDirection': 'WIND_DIRECTION',
}

// Actions
export const WEATHER_REQUESTED = 'WEATHER_REQUESTED';
export const WEATHER_LOADED = 'WEATHER_LOADED';
export const WEATHER_ERRORED = 'WEATHER_ERRORED';
export const WEATHER_HISTORY_REQUESTED = 'WEATHER_HISTORY_REQUESTED';
export const WEATHER_HISTORY_LOADED = 'WEATHER_HISTORY_LOADED';
export const WEATHER_HISTORY_ERRORED = 'WEATHER_HISTORY_ERRORED';
export const WEATHER_HISTORY_SHOWN = 'WEATHER_HISTORY_SHOWN';
export const WEATHER_HISTORY_HIDED = 'WEATHER_HISTORY_HIDED';

// Reducer
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  let id, weatherId, weatherItem, weatherState;
  switch (action.type) {
    case WEATHER_REQUESTED:
      if (!action.id) {
        return { ...state };
      }

      return {
        ...state,
        [action.id]: {
          weather: {},
          ...state[action.id],
          id: action.id,
          loading: true,
          error: false,
        },
      };

    case WEATHER_LOADED:
      id = action.payload.id;

      if (!id || !action.payload.weather) {
        return { ...state };
      }

      let loadedWeather = action.payload.weather;
      loadedWeather.loading = false;
      loadedWeather.error = false;
      return {
        ...state,
        [id]: loadedWeather,
      };

    case WEATHER_ERRORED:
      id = action.payload.id;

      if (!id) {
        return { ...state };
      }

      return {
        ...state,
        [id]: {
          weather: {},
          ...state[id],
          id: id,
          loading: false,
          error: true,
        },
      };
    
    case WEATHER_HISTORY_REQUESTED:
      weatherId = action.payload.id;
      weatherItem = action.payload.item;

      weatherState = { ...state[weatherId] };
      weatherState.weather[weatherItem].history = {
        loading: true,
        error: false,
        show: weatherState.weather[weatherItem].history ? weatherState.weather[weatherItem].history.show : false,
        data: weatherState.weather[weatherItem].history ? weatherState.weather[weatherItem].history.data : [],
      }

      return {
        ...state,
        [weatherId]: weatherState,
      };
    
    case WEATHER_HISTORY_ERRORED:
      weatherId = action.payload.id;
      weatherItem = action.payload.item;

      weatherState = { ...state[weatherId] };
      weatherState.weather[weatherItem].history = {
        ...weatherState.weather[weatherItem].history,
        loading: false,
        error: true,
      }

      return {
        ...state,
        [weatherId]: weatherState,
      };
    
    case WEATHER_HISTORY_LOADED:
      let historyData = [];

      action.payload.history.forEach(item => {
        historyData.push({
          datetime: DateTime.fromFormat(item.datetime, 'yyyy-LL-dd HH:mm:ss'),
          value: item.value,
        })
      });

      weatherId = action.payload.id;
      weatherItem = action.payload.item;

      weatherState = { ...state[weatherId] };
      weatherState.weather[weatherItem].history = {
        ...weatherState.weather[weatherItem].history,
        loading: false,
        error: false,
        data: historyData,
      }

      return {
        ...state,
        [weatherId]: weatherState,
      };
    
    case WEATHER_HISTORY_SHOWN:
      weatherId = action.payload.id;
      weatherItem = action.payload.item;

      weatherState = { ...state[weatherId] };
      weatherState.weather[weatherItem].history = {
        ...weatherState.weather[weatherItem].history,
        show: true,
      }

      return {
        ...state,
        [weatherId]: weatherState,
      };
    
    case WEATHER_HISTORY_HIDED:
      weatherId = action.payload.id;
      weatherItem = action.payload.item;

      weatherState = { ...state[weatherId] };
      weatherState.weather[weatherItem].history = {
        ...weatherState.weather[weatherItem].history,
        show: false,
      }

      return {
        ...state,
        [weatherId]: weatherState,
      };

    default: return state;
  }
}

// Action Creators
export function weatherRequested(id) {
  return { type: WEATHER_REQUESTED, id}
}
export function weatherLoaded(payload) {
  return {
    type: WEATHER_LOADED,
    payload: { 
      id: payload.id,
      weather: payload.weather
    }
  }
}
export function weatherErrored(payload) {
  return {
    type: WEATHER_ERRORED,
    payload: {
      id: payload.id,
      error: payload.error,
    }
  };
}
export function weatherHistoryRequested(payload) {
  return {
    type: WEATHER_HISTORY_REQUESTED,
    payload: {
      id: payload.id,
      item: payload.item,
    }
  }
}
export function weatherHistoryLoaded(payload) {
  return {
    type: WEATHER_HISTORY_LOADED,
    payload: { 
      id: payload.id,
      item: payload.item,
      history: payload.history
    }
  }
}
export function weatherHistoryErrored(payload) {
  return {
    type: WEATHER_HISTORY_ERRORED,
    payload: {
      id: payload.id,
      item: payload.item,
      error: payload.error,
    }
  };
}
export function weatherHistoryShow(payload) {
  return {
    type: WEATHER_HISTORY_SHOWN,
    payload: {
      id: payload.id,
      item: payload.item,
    }
  };
}
export function weatherHistoryHide(payload) {
  return {
    type: WEATHER_HISTORY_HIDED,
    payload: {
      id: payload.id,
      item: payload.item,
    }
  };
}

// Side effects
export function* saga() {
  yield takeEvery(WEATHER_REQUESTED, weatherRequestSaga);
  yield takeEvery(WEATHER_HISTORY_REQUESTED, weatherHistoryRequestSaga);
  yield takeEvery(WEATHER_HISTORY_SHOWN, weatherHistoryShowSaga);
}

export function* weatherRequestSaga(action) {
  try {
    const equipment = yield call(getJeedomEquipment, action.id);

    let weatherItems = {};
    Object.keys(GENERIC_TYPE).forEach((key) => {
      let item = equipment.cmds.find(el => (
        el.generic_type === GENERIC_TYPE[key] && el.isVisible === '1'
      ));

      if (item) {
        weatherItems[key] = {
          id: item.id,
          value: item.currentValue,
          unit: item.unite,
          isHistorized: item.isHistorized === 'true',
          history: {
            loading: false,
            error: false,
            show: false,
            data: [],
          }
        }
      }
    });
    
    const weather = {
      id: action.id,
      weather: weatherItems,
    }

    const payload = {
      id: action.id,
      weather,
    }
    yield put(weatherLoaded(payload));
  } catch (error) {
    yield put(weatherErrored({
      id: action.id,
      error,
    }));
  }
}

export const getWeatherItemCommandId = (state, { id, item }) => state.weather[id].weather[item].id;

export function* weatherHistoryRequestSaga(action) {
  try {
    const id = action.payload.id;
    const item = action.payload.item;

    const cmd = yield select(getWeatherItemCommandId, { id, item });
    const history = yield call(getJeedomCommandHistory, cmd);

    const payload = {
      id,
      item,
      history,
    }
    yield put(weatherHistoryLoaded(payload));
  } catch (error) {
    yield put(weatherHistoryErrored({
      id: action.payload.id,
      item: action.payload.item,
      error,
    }));
  }
}

export function* weatherHistoryShowSaga(action) {
  yield put(weatherHistoryRequested({
    id: action.payload.id,
    item: action.payload.item,
  }));
}
