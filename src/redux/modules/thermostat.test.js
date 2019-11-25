import reducer, { 
  THERMOSTAT_REQUESTED,
  THERMOSTAT_LOADED,
  THERMOSTAT_ERRORED,
  THERMOSTAT_MODE_CHANGE_REQUESTED,
  thermostatRequested,
  thermostatLoaded,
  thermostatErrored,
  thermostatModeChangeRequested,
  thermostatRequestSaga,
} from './thermostat';
import { randomNumber, generateThermostat, generateThermostatApiResult } from '../utils/fixtures';
import { put, call } from 'redux-saga/effects'
import { getJeedomEquipment } from '../utils/jeedom';

describe('Thermostat', () => {
  describe('Actions', () => {
    it('should create an action to request a thermostat', () => {
      const id = randomNumber(99);
      
      const expectedAction = {
        type: THERMOSTAT_REQUESTED,
        id,
      };
      expect(thermostatRequested(id)).toEqual(expectedAction)
    });

    it('should create an action to load a thermostat', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);

      const payload = {
        id,
        thermostat,
      };

      const expectedAction = {
        type: THERMOSTAT_LOADED,
        payload,
      }

      expect(thermostatLoaded({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to errored a thermostat request', () => {
      const id = randomNumber(99);
      const error = new Error();
      
      const payload = {
        id,
        error,
      };

      const expectedAction = {
        type: THERMOSTAT_ERRORED,
        payload
      }
      expect(thermostatErrored({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to change the mode of a thermostat', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      const cmd = thermostat.modes[0].id;

      const payload = {
        id,
        cmd,
      };

      const expectedAction = {
        type: THERMOSTAT_MODE_CHANGE_REQUESTED,
        payload,
      }

      expect(thermostatModeChangeRequested({...payload, uselessParam: false})).toEqual(expectedAction)
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({})
    })

    it('should handle THERMOSTAT_REQUESTED', () => {
      const id = randomNumber(99);

      const thermostat = generateThermostat(id);
      thermostat.loading = true;
      delete thermostat.currentMode;
      delete thermostat.modes;
      delete thermostat.name;
      delete thermostat.power;
      delete thermostat.setpoint;
      delete thermostat.temperature;

      const expectedState = {
        [id]: thermostat,
      };

      expect(reducer([], thermostatRequested(id))).toEqual(expectedState);
    })

    it('should keep previous state when handling THERMOSTAT_REQUESTED', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);

      const initialState = {
        [id]: thermostat,
      };

      const expectedState = {
        [id]: {
          ...thermostat,
          loading: true,
          error: false,
        }
      };

      expect(reducer(initialState, thermostatRequested(id))).toEqual(expectedState);
    })

    it('should handle THERMOSTAT_ERRORED', () => {
      const error = new Error();

      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      thermostat.error = true;
      delete thermostat.currentMode;
      delete thermostat.modes;
      delete thermostat.name;
      delete thermostat.power;
      delete thermostat.setpoint;
      delete thermostat.temperature;

      const expectedState = {
        [id]: thermostat,
      };

      expect(reducer([], thermostatErrored({ id, error }))).toEqual(expectedState);
    });

    it('should keep previous state after an error', () => {
      const error = new Error();

      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      
      const initialState = {
        [id]: thermostat,
      };

      const expectedState = {
        [id]: {
          ...thermostat,
          error: true,
        }
      };

      expect(reducer(initialState, thermostatErrored({ id, error }))).toEqual(expectedState);
    })

    it('should handle THERMOSTAT_LOADED and keep previous state when handling another', () => {
      const initialThermostatId = randomNumber(99);
      const initialThermostat = generateThermostat(initialThermostatId);

      const initialState = {
        [initialThermostatId]: initialThermostat,
      };

      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      const expectedState = {
        ...initialState,
        [id]: thermostat,
      };

      expect(reducer([], thermostatLoaded({ id: initialThermostatId, thermostat: initialThermostat }))).toEqual(initialState);
      expect(reducer(initialState, thermostatLoaded({ id, thermostat }))).toEqual(expectedState);
    })
  });

  // Side effects.
  describe('Side effects', () => {
    it('should dispatch thermostatLoaded', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      delete thermostat.loading;
      delete thermostat.error;
      const equipmentApiResult = generateThermostatApiResult(thermostat);

      const generator = thermostatRequestSaga(thermostatRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.next(equipmentApiResult);
      expect(next.value).toEqual(put(thermostatLoaded({ id, thermostat })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
    
    it('should dispatch thermostatErrored', () => {
      const error = new TypeError();

      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      delete thermostat.loading;
      delete thermostat.error;
      const equipmentApiResult = generateThermostatApiResult(thermostat);

      const generator = thermostatRequestSaga(thermostatRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(thermostatErrored({ id, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});