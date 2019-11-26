import reducer, { 
  THERMOSTAT_REQUESTED,
  THERMOSTAT_LOADED,
  THERMOSTAT_ERRORED,
  THERMOSTAT_MODE_CHANGE_REQUESTED,
  THERMOSTAT_MODE_CHANGE_ERRORED,
  THERMOSTAT_MODE_CHANGE_SUCCEEDED,
  CHANGE_MODE_REFRESH_DELAY,
  CHANGE_MODE_ERROR_SNACKBAR,
  thermostatRequested,
  thermostatLoaded,
  thermostatErrored,
  thermostatModeChangeRequested,
  thermostatModeChangeErrored,
  thermostatModeChangeSucceded,
  thermostatRequestSaga,
  thermostatModeChangeRequestSaga,
} from './thermostat';
import { randomNumber, generateThermostat, generateThermostatApiResult } from '../utils/fixtures';
import { put, call, delay } from 'redux-saga/effects'
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';
import { showErrorSnackbar } from './snackbar';

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

      const payload = { id, cmd };

      const expectedAction = {
        type: THERMOSTAT_MODE_CHANGE_REQUESTED,
        payload,
      }

      expect(thermostatModeChangeRequested({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to errored a mode change of a thermostat', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      const cmd = thermostat.modes[0].id;

      const error = new Error();

      const payload = { id, cmd, error };

      const expectedAction = {
        type: THERMOSTAT_MODE_CHANGE_ERRORED,
        payload,
      }

      expect(thermostatModeChangeErrored({...payload, uselessParam: false})).toEqual(expectedAction)
    });

    it('should create an action to succeeded a mode change of a thermostat', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      const cmd = thermostat.modes[0].id;

      const payload = { id, cmd };

      const expectedAction = {
        type: THERMOSTAT_MODE_CHANGE_SUCCEEDED,
        payload,
      }

      expect(thermostatModeChangeSucceded({...payload, uselessParam: false})).toEqual(expectedAction)
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

    it('should handle THERMOSTAT_MODE_CHANGE_REQUESTED', () => {
      const id = randomNumber(99);
      const initialThermostat = generateThermostat(id);
      const cmd = initialThermostat.modes[0].id;

      const initialState = {
        [id]: initialThermostat,
      };

      const expectedState = {
        [id]: { ...initialThermostat, loading: true},
      };

      expect(reducer(initialState, thermostatModeChangeRequested({ id, cmd }))).toEqual(expectedState);
    })

    it('should handle THERMOSTAT_MODE_CHANGE_ERRORED', () => {
      const id = randomNumber(99);
      const initialThermostat = generateThermostat(id);
      initialThermostat.loading = true;
      const cmd = initialThermostat.modes[0].id;
      const error = new Error();

      const initialState = {
        [id]: initialThermostat,
      };

      const expectedState = {
        [id]: { ...initialThermostat, loading: false, error: true},
      };

      expect(reducer(initialState, thermostatModeChangeErrored({ id, cmd, error }))).toEqual(expectedState);
    })

    it('should handle THERMOSTAT_MODE_CHANGE_SUCCEEDED', () => {
      const id = randomNumber(99);
      const initialThermostat = generateThermostat(id);
      initialThermostat.loading = true;
      const cmd = initialThermostat.modes[0].id;

      const initialState = {
        [id]: initialThermostat,
      };

      const expectedState = {
        [id]: { ...initialThermostat, loading: false, error: false},
      };

      expect(reducer(initialState, thermostatModeChangeSucceded({ id, cmd }))).toEqual(expectedState);
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

      const generator = thermostatRequestSaga(thermostatRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(thermostatErrored({ id, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch thermostatModeChangeSucceded', () => {
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      delete thermostat.loading;
      delete thermostat.error;
      const cmd = thermostat.modes[0].id;

      const generator = thermostatModeChangeRequestSaga(thermostatModeChangeRequested({ id, cmd }));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, cmd));

      next = generator.next();
      expect(next.value).toEqual(delay(CHANGE_MODE_REFRESH_DELAY));

      next = generator.next();
      expect(next.value).toEqual(put(thermostatRequested(id)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch thermostatModeChangeErrored', () => {
      const error = new TypeError();
       
      const id = randomNumber(99);
      const thermostat = generateThermostat(id);
      delete thermostat.loading;
      delete thermostat.error;
      const cmd = thermostat.modes[0].id;

      const generator = thermostatModeChangeRequestSaga(thermostatModeChangeRequested({ id, cmd }));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, cmd));

      next = generator.throw(error);
      expect(next.value).toEqual(put(thermostatModeChangeErrored({id, cmd, error})));

      next = generator.next();
      expect(next.value).toEqual(put(showErrorSnackbar(CHANGE_MODE_ERROR_SNACKBAR)));

      next = generator.next();
      expect(next.value).toEqual(put(thermostatRequested(id)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});