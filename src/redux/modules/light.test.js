import reducer, { 
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
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const payload = {
        id,
        off_cmd_id,
      };

      const expectedAction = {
        type: LIGHT_ALL_STATUS_REQUESTED,
        payload,
      };

      expect(allLightStatusRequested(payload)).toEqual(expectedAction)
    });

    it('should create an action to errored an all lights status request', () => {
      const id = randomNumber(99);
      const error = new Error();

      const payload = { id, error };

      const expectedAction = {
        type: LIGHT_ALL_STATUS_ERRORED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(allLightStatusErrored(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to load status of all lights', () => {
      const id = randomNumber(99);
      const lights = generateLights();
      const equipment = generateLightsApiResult(id, lights);

      const payload = { id, equipment };

      const expectedAction = {
        type: LIGHT_ALL_STATUS_LOADED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(allLightStatusLoaded(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to request all lights off', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const payload = {
        id,
        off_cmd_id,
      };

      const expectedAction = {
        type: LIGHT_ALL_OFF_REQUESTED,
        payload,
      };

      expect(allLightsOffRequested(payload)).toEqual(expectedAction)
    });
  });

  // Reducer
  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        loading: false,
        error: false,
        id: undefined,
        off_cmd_id: undefined,
        lights: [],
      })
    })

    it('should handle LIGHT_ALL_STATUS_REQUESTED', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const payload = {
        id,
        off_cmd_id,
      };

      const expectedState = {
        loading: true,
        error: false,
        id,
        off_cmd_id,
        lights: [],
      };

      expect(reducer([], allLightStatusRequested(payload))).toEqual(expectedState);
    })

    it('should handle LIGHT_ALL_STATUS_ERRORED', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const error = new Error();
      const payload = {
        id,
        error,
      };

      const initialState = reducer([], allLightStatusRequested({ id, off_cmd_id }));

      const expectedState = {
        loading: false,
        error: true,
        id,
        off_cmd_id,
        lights: [],
      };

      expect(reducer(initialState, allLightStatusErrored(payload))).toEqual(expectedState);
    })

    it('should handle LIGHT_ALL_STATUS_LOADED', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);

      const lights = generateLights();
      const equipment = generateLightsApiResult(id, lights);

      const payload = { id, equipment };

      const initialState = reducer([], allLightStatusRequested({ id, off_cmd_id }));

      const expectedState = {
        loading: false,
        error: false,
        id,
        off_cmd_id,
        lights,
      };

      expect(reducer(initialState, allLightStatusLoaded(payload))).toEqual(expectedState);
    })
  });

  // Side effects
  describe('Side effects', () => {
    it('should dispatch allLightStatusLoaded', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);

      const lights = generateLights();
      const equipment = generateLightsApiResult(id, lights);

      const generator = lightStatusRequestSaga(allLightStatusRequested({ id, off_cmd_id }));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      const loadedPayload = { id, equipment };
      next = generator.next(equipment);
      expect(next.value).toEqual(put(allLightStatusLoaded(loadedPayload)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch allLightStatusErrored', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const error = new TypeError();

      const generator = lightStatusRequestSaga(allLightStatusRequested({ id, off_cmd_id }));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(allLightStatusErrored({ id, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch allLightStatusLoaded when turning off all lights', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);

      const payload = {
        id,
        off_cmd_id,
      };

      const generator = lightAllOffRequestSaga(allLightsOffRequested(payload));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, off_cmd_id));

      next = generator.next();
      expect(next.value).toEqual(delay(REFRESH_DELAY));

      next = generator.next();
      expect(next.value).toEqual(put(allLightStatusRequested(payload)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch showErrorSnackbar when turning off all lights errored', () => {
      const id = randomNumber(99);
      const off_cmd_id = randomNumber(99);
      const error = new TypeError();

      const payload = {
        id,
        off_cmd_id,
      };

      const generator = lightAllOffRequestSaga(allLightsOffRequested(payload));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, off_cmd_id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(showErrorSnackbar(LIGHT_ALL_OFF_ERROR_SNACKBAR)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});