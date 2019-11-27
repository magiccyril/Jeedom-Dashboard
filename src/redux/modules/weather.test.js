import reducer, { 
  WEATHER_REQUESTED,
  WEATHER_LOADED,
  WEATHER_ERRORED,
  WEATHER_HISTORY_REQUESTED,
  WEATHER_HISTORY_LOADED,
  WEATHER_HISTORY_ERRORED,
  weatherRequested,
  weatherLoaded,
  weatherErrored,
  weatherHistoryRequested,
  weatherHistoryLoaded,
  weatherHistoryErrored,
  weatherRequestSaga,
  weatherHistoryRequestSaga,
  getWeatherItemCommandId,
} from './weather';
import {
  randomNumber,
  generateWeather,
  generateWeatherHistory,
  generateWeatherApiResult,
  generateWeatherHistoryApiResult,
} from '../utils/fixtures';
import { put, call, select } from 'redux-saga/effects'
import { getJeedomEquipment, getJeedomCommandHistory } from '../utils/jeedom';
import { cloneDeep } from 'lodash';

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

    it('should create an action to request a weather item history', () => {
      const id = randomNumber(99);
      const item = 'humidity';

      const payload = {
        id,
        item,
      }
      
      const expectedAction = {
        type: WEATHER_HISTORY_REQUESTED,
        payload
      };
      expect(weatherHistoryRequested({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to load a weather item history', () => {
      const id = randomNumber(99);
      const item = 'humidity';
      const history = generateWeatherHistory();

      const payload = {
        id,
        item,
        history,
      };

      const expectedAction = {
        type: WEATHER_HISTORY_LOADED,
        payload,
      }

      expect(weatherHistoryLoaded({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to errored a weather item history request', () => {
      const id = randomNumber(99);
      const item = 'humidity';
      const error = new Error();
      
      const payload = {
        id,
        item,
        error,
      };

      const expectedAction = {
        type: WEATHER_HISTORY_ERRORED,
        payload
      }
      expect(weatherHistoryErrored({...payload, uselessParam: false})).toEqual(expectedAction)
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

    it('should handle WEATHER_HISTORY_REQUESTED', () => {
      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      const item = 'humidity';
      delete weather.weather[item].history;

      const initialState = {
        [id]: weather,
      };

      const payload = {
        id,
        item,
      }

      let expectedState = cloneDeep(initialState);
      expectedState[id].weather[item].history = {
        ...expectedState[id].weather[item].history,
        data: [],
        loading: true,
        error: false,
        show: false,
      }

      expect(reducer(initialState, weatherHistoryRequested(payload))).toEqual(expectedState);
    })

    it('should keep previous values when handling WEATHER_HISTORY_REQUESTED', () => {
      const id = randomNumber(99);
      let weather = generateWeather(id, true);
      const item = 'humidity';
      const history = generateWeatherHistory();
      weather.weather[item].history.data = history;

      const initialState = {
        [id]: weather,
      };

      const payload = {
        id,
        item,
      }

      let expectedState = cloneDeep(initialState);
      expectedState[id].weather[item].history = {
        ...expectedState[id].weather[item].history,
        loading: true,
        error: false,
        show: false,
      }

      expect(reducer(initialState, weatherHistoryRequested(payload))).toEqual(expectedState);
    })

    it('should handle WEATHER_HISTORY_ERRORED', () => {
      const id = randomNumber(99);
      const weather = generateWeather(id, true);
      const item = 'humidity';
      const error = new Error();

      const initialState = {
        [id]: weather,
      };

      const payload = {
        id,
        item,
        error,
      };

      let expectedState = cloneDeep(initialState);
      expectedState[id].weather[item].history = {
        ...expectedState[id].weather[item].history,
        loading: false,
        error: true,
      }

      expect(reducer(initialState, weatherHistoryErrored(payload))).toEqual(expectedState);
    })

    it('should handle WEATHER_HISTORY_LOADED', () => {
      const id = randomNumber(99);
      let weather = generateWeather(id, true);
      const item = 'humidity';
      const history = generateWeatherHistory();
      weather.weather[item].history.data = history;

      const historyApiResult = generateWeatherHistoryApiResult(weather.weather[item].id, history);

      const initialState = {
        [id]: weather,
      };

      const payload = {
        id,
        item,
        history: historyApiResult,
      };

      let expectedState = cloneDeep(initialState);
      expectedState[id].weather[item].history = {
        ...expectedState[id].weather[item].history,
        loading: false,
        error: false,
        data: history,
      }

      expect(reducer(initialState, weatherHistoryLoaded(payload))).toEqual(expectedState);
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

    it('should dispatch weatherHistoryLoaded', () => {
      const id = randomNumber(99);
      let weather = generateWeather(id, true);
      const item = 'humidity';
      const history = generateWeatherHistory();
      weather.weather[item].history.data = history;
      const cmd = weather.weather[item].id;

      const historyApiResult = generateWeatherHistoryApiResult(cmd, history);

      const generator = weatherHistoryRequestSaga(weatherHistoryRequested({ id, item }));
      
      let next = generator.next();
      expect(next.value).toEqual(select(getWeatherItemCommandId, {id, item}));

      next = generator.next(cmd);
      expect(next.value).toEqual(call(getJeedomCommandHistory, cmd));

      next = generator.next(historyApiResult);
      expect(next.value).toEqual(put(weatherHistoryLoaded({ id, item, history: historyApiResult })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch weatherErrored', () => {
      const error = new TypeError();

      const id = randomNumber(99);
      let weather = generateWeather(id, true);
      const item = 'humidity';
      const history = generateWeatherHistory();
      weather.weather[item].history.data = history;
      const cmd = weather.weather[item].id;

      const generator = weatherHistoryRequestSaga(weatherHistoryRequested({ id, item }));
      
      let next = generator.next();
      expect(next.value).toEqual(select(getWeatherItemCommandId, {id, item}));

      next = generator.next(cmd);
      expect(next.value).toEqual(call(getJeedomCommandHistory, cmd));

      next = generator.throw(error);
      expect(next.value).toEqual(put(weatherHistoryErrored({ id, item, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});