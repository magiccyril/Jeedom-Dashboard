import reducer, { 
  WEATHER_REQUESTED,
  WEATHER_LOADED,
  WEATHER_ERRORED,
  weatherRequested,
  weatherLoaded,
  weatherErrored,
  weatherRequestSaga,
} from './weather';
import { randomNumber, generateWeather, generateWeatherApiResult } from '../utils/fixtures';
import { put, call } from 'redux-saga/effects'
import { getJeedomEquipment } from '../utils/jeedom';

describe('Weather', () => {
  describe('Actions', () => {
    it('should create an action to request a weather', () => {
      const id = randomNumber(99);
      
      const expectedAction = {
        type: WEATHER_REQUESTED,
        id,
      };
      expect(weatherRequested(id)).toEqual(expectedAction)
    });

    it('should create an action to load a weather', () => {
      const id = randomNumber(99);
      const weather = generateWeather(id, true);

      const payload = {
        id,
        weather,
      };

      const expectedAction = {
        type: WEATHER_LOADED,
        payload,
      }

      expect(weatherLoaded({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to errored a weather request', () => {
      const id = randomNumber(99);
      const error = new Error();
      
      const payload = {
        id,
        error,
      };

      const expectedAction = {
        type: WEATHER_ERRORED,
        payload
      }
      expect(weatherErrored({...payload, uselessParam: false})).toEqual(expectedAction)
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({})
    })

    it('should handle WEATHER_REQUESTED', () => {
      const id = randomNumber(99);

      const weather = generateWeather(id, true);
      weather.loading = true;
      weather.error = false;
      weather.weather = {};

      const expectedState = {
        [id]: weather,
      };

      expect(reducer([], weatherRequested(id))).toEqual(expectedState);
    })

    it('should keep previous state when handling WEATHER_REQUESTED', () => {
      const id = randomNumber(99);
      const weather = generateWeather(id, true);

      const initialState = {
        [id]: weather,
      };

      const expectedState = {
        [id]: {
          ...weather,
          loading: true,
          error: false,
        }
      };

      expect(reducer(initialState, weatherRequested(id))).toEqual(expectedState);
    })

    it('should handle WEATHER_ERRORED', () => {
      const error = new Error();

      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      weather.loading = false,
      weather.error = true;
      weather.weather = {};
      
      const expectedState = {
        [id]: weather,
      };

      expect(reducer([], weatherErrored({ id, error }))).toEqual(expectedState);
    });

    it('should keep previous state after an error', () => {
      const error = new Error();

      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      
      const initialState = {
        [id]: weather,
      };

      const expectedState = {
        [id]: {
          ...weather,
          loading: false,
          error: true,
        }
      };

      expect(reducer(initialState, weatherErrored({ id, error }))).toEqual(expectedState);
    })

    it('should handle WEATHER_LOADED and keep previous state when handling another', () => {
      const initialWeatherId = randomNumber(99);
      const initialWeather = generateWeather(initialWeatherId);

      const initialState = {
        [initialWeatherId]: initialWeather,
      };

      const id = randomNumber(99);
      const weather = generateWeather(id);
      const expectedState = {
        ...initialState,
        [id]: weather,
      };

      expect(reducer([], weatherLoaded({ id: initialWeatherId, weather: initialWeather }))).toEqual(initialState);
      expect(reducer(initialState, weatherLoaded({ id, weather }))).toEqual(expectedState);
    })
  });

  // Side effects.
  describe('Side effects', () => {
    it('should dispatch weatherLoaded', () => {
      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      delete weather.loading;
      delete weather.error;
      const equipmentApiResult = generateWeatherApiResult(weather);

      const generator = weatherRequestSaga(weatherRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.next(equipmentApiResult);
      expect(next.value).toEqual(put(weatherLoaded({ id, weather })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch weatherErrored', () => {
      const error = new TypeError();

      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      delete weather.loading;
      delete weather.error;

      const generator = weatherRequestSaga(weatherRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(weatherErrored({ id, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});