import reducer, { 
  JEEDOM_EQUIPMENT_ID,
  JEEDOM_OFF_COMMAND_ID,
  LIGHT_ALL_STATUS_REQUESTED,
  LIGHT_ALL_STATUS_LOADED,
  LIGHT_ALL_STATUS_ERRORED,
  LIGHT_ALL_OFF_REQUESTED,
  REFRESH_DELAY,
  allLightStatusRequested,
  allLightStatusErrored,
  allLightStatusLoaded,
  allLightsOffRequested,
  lightStatusRequestSaga,
  lightAllOffRequestSaga,
  LIGHT_ALL_OFF_ERROR_SNACKBAR,
} from './light';
import { randomNumber, generateLights, generateLightsApiResult } from '../utils/fixtures';
import { put, call, delay } from 'redux-saga/effects'
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';
import { showErrorSnackbar } from './snackbar';

describe('Light', () => {
  // Actions
  describe('Actions', () => {
    it('should create an action to request status of all lights', () => {
      const expectedAction = {
        type: LIGHT_ALL_STATUS_REQUESTED,
      };

      expect(allLightStatusRequested()).toEqual(expectedAction)
    });

    it('should create an action to errored an all lights status request', () => {
      const error = new Error();

      const payload = { error };

      const expectedAction = {
        type: LIGHT_ALL_STATUS_ERRORED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(allLightStatusErrored(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to load status of all lights', () => {
      const lights = generateLights();
      const equipment = generateLightsApiResult(JEEDOM_EQUIPMENT_ID, lights);

      const payload = { equipment };

      const expectedAction = {
        type: LIGHT_ALL_STATUS_LOADED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(allLightStatusLoaded(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to request all lights off', () => {
      const expectedAction = {
        type: LIGHT_ALL_OFF_REQUESTED,
      };

      expect(allLightsOffRequested()).toEqual(expectedAction)
    });
  });

  // Reducer
  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        loading: false,
        error: false,
        lights: [],
      })
    })

    it('should handle LIGHT_ALL_STATUS_REQUESTED', () => {
      const expectedState = {
        loading: true,
        error: false,
        lights: [],
      };

      expect(reducer([], allLightStatusRequested())).toEqual(expectedState);
    })

    it('should handle LIGHT_ALL_STATUS_ERRORED', () => {
      const error = new Error();
      const payload = {
        error,
      };

      const initialState = reducer([], allLightStatusRequested());

      const expectedState = {
        loading: false,
        error: true,
        lights: [],
      };

      expect(reducer(initialState, allLightStatusErrored(payload))).toEqual(expectedState);
    })

    it('should handle LIGHT_ALL_STATUS_LOADED', () => {
      const lights = generateLights();
      const equipment = generateLightsApiResult(JEEDOM_EQUIPMENT_ID, lights);

      const payload = { equipment };

      const initialState = reducer([], allLightStatusRequested());

      const expectedState = {
        loading: false,
        error: false,
        lights,
      };

      expect(reducer(initialState, allLightStatusLoaded(payload))).toEqual(expectedState);
    })
  });

  // Side effects
  describe('Side effects', () => {
    it('should dispatch allLightStatusLoaded', () => {
      const lights = generateLights();
      const equipment = generateLightsApiResult(JEEDOM_EQUIPMENT_ID, lights);

      const generator = lightStatusRequestSaga(allLightStatusRequested());
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, JEEDOM_EQUIPMENT_ID));

      next = generator.next(equipment);
      expect(next.value).toEqual(put(allLightStatusLoaded({ equipment })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch allLightStatusErrored', () => {
      const error = new TypeError();

      const generator = lightStatusRequestSaga(allLightStatusRequested());
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, JEEDOM_EQUIPMENT_ID));

      next = generator.throw(error);
      expect(next.value).toEqual(put(allLightStatusErrored({ error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch allLightStatusLoaded when turning off all lights', () => {
      const generator = lightAllOffRequestSaga(allLightsOffRequested());
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, JEEDOM_OFF_COMMAND_ID));

      next = generator.next();
      expect(next.value).toEqual(delay(REFRESH_DELAY));

      next = generator.next();
      expect(next.value).toEqual(put(allLightStatusRequested()));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch showErrorSnackbar when turning off all lights errored', () => {
      const error = new TypeError();

      const generator = lightAllOffRequestSaga(allLightsOffRequested());
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, JEEDOM_OFF_COMMAND_ID));

      next = generator.throw(error);
      expect(next.value).toEqual(put(showErrorSnackbar(LIGHT_ALL_OFF_ERROR_SNACKBAR)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});