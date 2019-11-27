import { takeEvery, call, put } from 'redux-saga/effects';
import { getJeedomEquipment } from '../utils/jeedom';

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

// Reducer
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  let id;
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

// Side effects
export function* saga() {
  yield takeEvery(WEATHER_REQUESTED, weatherRequestSaga);
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
