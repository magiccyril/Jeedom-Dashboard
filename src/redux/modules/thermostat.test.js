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
import { randomNumber, generateFakeStateThermostat, generateFakeThermostat } from '../utils/fixtures';
import { put, call } from 'redux-saga/effects'
import { getJeedomEquipment } from '../utils/jeedom';

describe('Thermostat', () => {
  describe('Actions', () => {
    it('should create an action to request a thermostat', () => {
      const id = 18;
      const expectedAction = {
        type: THERMOSTAT_REQUESTED,
        id,
      };
      expect(thermostatRequested(id)).toEqual(expectedAction)
    });

    it('should create an action to load a thermostat', () => {
      const id = 18;
      const thermostat = generateFakeThermostat(id);

      const expectedAction = {
        type: THERMOSTAT_LOADED,
        payload: {
          id,
          thermostat,
        },
      }

      expect(thermostatLoaded(id, thermostat)).toEqual(expectedAction)
    });

    it('should create an action to errored a thermostat request', () => {
      const id = 18;
      const error = new Error();
      const expectedAction = {
        type: THERMOSTAT_ERRORED,
        payload: {
          id,
          error,
        }
      }
      expect(thermostatErrored(id, error)).toEqual(expectedAction)
    });

    it('should create an action to change the mode of a thermostat', () => {
      const id = 18;
      const mode = 222;

      const expectedAction = {
        type: THERMOSTAT_MODE_CHANGE_REQUESTED,
        payload: {
          id,
          mode,
        },
      }

      expect(thermostatModeChangeRequested(id, mode)).toEqual(expectedAction)
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({})
    })

    it('should handle THERMOSTAT_REQUESTED', () => {
      const thermostatId = 18;
      const thermostat = generateFakeStateThermostat(thermostatId);
      thermostat.loading = true;
      const expectedState = {
        [thermostatId]: thermostat,
      };

      expect(reducer([], thermostatRequested(thermostatId))).toEqual(expectedState);
    })

    it('should keep previous state when handling THERMOSTAT_REQUESTED', () => {
      const thermostatId = 18;
      const initialThermostat = generateFakeThermostat(thermostatId);
      initialThermostat.loading = false;
      initialThermostat.error = false;
      const initialState = {
        [thermostatId]: initialThermostat,
      };
      const expectedThermostat = {
        ...initialThermostat,
        loading: true,
        error: false,
      }
      const expectedState = {
        [thermostatId]: expectedThermostat,
      };

      expect(reducer(initialState, thermostatRequested(thermostatId))).toEqual(expectedState);
    })

    it('should handle THERMOSTAT_LOADED', () => {
      const firstThermostatId = 18;
      const firstThermostat = generateFakeThermostat(firstThermostatId);
      firstThermostat.loading = false;
      firstThermostat.error = false;
      const firstExpectedState = {
        [firstThermostatId]: firstThermostat,
      };

      const secondThermostatId = 7;
      const secondThermostat = generateFakeThermostat(secondThermostatId);
      secondThermostat.loading = false;
      secondThermostat.error = false;
      const secondExpectedState = {
        [firstThermostatId]: firstThermostat,
        [secondThermostatId]: secondThermostat,
      };

      expect(reducer([], thermostatLoaded(firstThermostatId, firstThermostat))).toEqual(firstExpectedState)
      expect(reducer(firstExpectedState, thermostatLoaded(secondThermostatId, secondThermostat))).toEqual(secondExpectedState)
    })

    it('should handle THERMOSTAT_ERRORED', () => {
      const thermostatId = 18;
      const thermostat = generateFakeStateThermostat(thermostatId);
      thermostat.error = true;
      const expectedState = {
        [thermostatId]: thermostat,
      };

      expect(reducer([], thermostatErrored(thermostatId, new Error()))).toEqual(expectedState);
    });

    it('should keep previous state after an error', () => {
      const thermostatId = 18;
      const initialThermostat = generateFakeThermostat(thermostatId);
      initialThermostat.loading = false;
      initialThermostat.error = false;
      const initialState = {
        [thermostatId]: initialThermostat,
      };
      const expectedThermostat = {
        ...initialThermostat,
        loading: false,
        error: true,
      }
      const expectedState = {
        [thermostatId]: expectedThermostat,
      };

      expect(reducer(initialState, thermostatErrored(thermostatId, new Error()))).toEqual(expectedState);
    })
  });

  
  describe('Side effects', () => {
    it('should dispatch thermostatLoaded', () => {
      const thermostatId = 18;
      const expectedThermostat = generateFakeThermostat(thermostatId);

      const expectedFirstModeId = Object.keys(expectedThermostat.modes)[0];
      const expectedSecondModeId = Object.keys(expectedThermostat.modes)[1];

      const equipment = {
        'id': thermostatId,
        'name': expectedThermostat.name,
        'generic_type': null,
        'eqType_name': 'thermostat',
        'isVisible': '1',
        'isEnable': '1',
        'cmds': [
          {
              "id": randomNumber(999),
              "logicalId": "actif",
              "generic_type": "THERMOSTAT_STATE",
              "name": "Actif",
              "type": "info",
              "value": null,
              "isVisible": "0",
              "currentValue": 1
          },
          {
              "id": randomNumber(999),
              "logicalId": "off",
              "generic_type": "THERMOSTAT_SET_MODE",
              "name": "Off",
              "type": "action",
              "value": "",
              "isVisible": "0",
              "currentValue": null
          },
          {
              "id": expectedFirstModeId,
              "logicalId": "modeAction",
              "generic_type": "THERMOSTAT_SET_MODE",
              "name": expectedThermostat.modes[expectedFirstModeId],
              "type": "action",
              "value": null,
              "isVisible": "1",
              "currentValue": null
          },
          {
              "id": randomNumber(999),
              "logicalId": "temperature",
              "generic_type": "THERMOSTAT_TEMPERATURE",
              "name": "Température",
              "type": "info",
              "value": "#"+ randomNumber(9999) +"#",
              "isVisible": "0",
              "currentValue": expectedThermostat.temperature
          },
          {
              "id": randomNumber(999),
              "logicalId": "temperature_outdoor",
              "generic_type": "THERMOSTAT_TEMPERATURE_OUTDOOR",
              "name": "Temperature extérieure",
              "type": "info",
              "value": "#"+ randomNumber(9999) +"#",
              "isVisible": "0",
              "currentValue": randomNumber(15, 2)
          },
          {
              "id": randomNumber(999),
              "logicalId": "thermostat",
              "generic_type": "THERMOSTAT_SET_SETPOINT",
              "name": "Thermostat",
              "type": "action",
              "value": randomNumber(999),
              "isVisible": "0",
              "currentValue": null
          },
          {
              "id": expectedSecondModeId,
              "logicalId": "modeAction",
              "generic_type": "THERMOSTAT_SET_MODE",
              "name": expectedThermostat.modes[expectedSecondModeId],
              "type": "action",
              "value": null,
              "isVisible": "1",
              "currentValue": null
          },
          {
              "id": randomNumber(999),
              "logicalId": "order",
              "generic_type": "THERMOSTAT_SETPOINT",
              "name": "Consigne",
              "type": "info",
              "value": "",
              "isVisible": "1",
              "currentValue": expectedThermostat.setpoint,
          },
          {
              "id": randomNumber(999),
              "logicalId": "mode",
              "generic_type": "THERMOSTAT_MODE",
              "name": "Mode",
              "type": "info",
              "value": "",
              "isVisible": "1",
              "currentValue": expectedThermostat.modes[expectedFirstModeId]
          },
          {
              "id": randomNumber(999),
              "logicalId": "power",
              "generic_type": null,
              "eqType": "thermostat",
              "name": "Puissance",
              "type": "info",
              "value": null,
              "isVisible": "1",
              "currentValue": expectedThermostat.power
          },
        ]
      }

      const generator = thermostatRequestSaga(thermostatRequested(thermostatId));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, thermostatId));

      next = generator.next(equipment);
      expect(next.value).toEqual(put(thermostatLoaded(thermostatId, expectedThermostat)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch thermostatErrored', () => {
      const thermostatId = 18;

      const equipment = {
        'id': thermostatId,
        'generic_type': null,
        'eqType_name': 'thermostat',
        'isVisible': '1',
        'isEnable': '1',
        'cmds': []
      }

      const generator = thermostatRequestSaga(thermostatRequested(thermostatId));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, thermostatId));

      next = generator.next(equipment);
      expect(next.value).toEqual(put(thermostatErrored(new TypeError('Error when parsing thermostat'))));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});