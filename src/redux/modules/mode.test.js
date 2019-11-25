import reducer, { 
  MODE_LIST_REQUESTED,
  MODE_LIST_LOADED,
  MODE_LIST_ERRORED,
  MODE_CHANGE_REQUESTED,
  MODE_CHANGE_SUCCEEDED,
  MODE_CHANGE_ERRORED,
  modeListRequested,
  modeListLoaded,
  modeListErrored,
  modeChangeRequested,
  modeChangeSucceeded,
  modeChangeErrored,
  modeListRequestSaga,
  modeChangeRequestSaga,
  REFRESH_DELAY,
  SNACKBAR_ERROR,
} from './mode';
import { randomNumber, generateModeApiResult, generateMode } from '../utils/fixtures';
import { put, call, delay } from 'redux-saga/effects'
import { getJeedomEquipment, execJeedomCmd } from '../utils/jeedom';
import { showErrorSnackbar } from './snackbar';

describe('Mode', () => {
  // Actions
  describe('Actions', () => {
    it('should create an action to request a mode list', () => {
      const id = randomNumber(99);
      const expectedAction = { type: MODE_LIST_REQUESTED, id };

      expect(modeListRequested(id)).toEqual(expectedAction)
    });

    it('should create an action to load a mode list', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const equipment = generateModeApiResult(mode);

      const payload = { id, equipment };

      const expectedAction = {
        type: MODE_LIST_LOADED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(modeListLoaded(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to errored a mode list request', () => {
      const id = randomNumber(99);
      const error = new Error();

      const payload = { id, error };

      const expectedAction = {
        type: MODE_LIST_ERRORED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(modeListErrored(payloadWithMoreParams)).toEqual(expectedAction)
    });

    it('should create an action to request a mode change', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);

      const payload = {
        id,
        cmd: mode.modes[0].id,
      };

      const expectedAction = {
        type: MODE_CHANGE_REQUESTED,
        payload,
      }

      expect(modeChangeRequested(payload)).toEqual(expectedAction)
    });

    it('should create an action to succeed a mode change', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const cmd = mode.modes[0].id;

      const payload = { id, cmd };

      const expectedAction = {
        type: MODE_CHANGE_SUCCEEDED,
        payload,
      }

      expect(modeChangeSucceeded(payload)).toEqual(expectedAction)
    });

    it('should create an action to errored a mode change', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const cmd = mode.modes[0].id;
      const error = new Error();

      const payload = {
        id,
        cmd,
        error
      };

      const expectedAction = {
        type: MODE_CHANGE_ERRORED,
        payload: payload,
      }

      const payloadWithMoreParams = { ...payload, useless: true };

      expect(modeChangeErrored(payloadWithMoreParams)).toEqual(expectedAction)
    });
  });

  // Reducer
  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({})
    })

    it('should handle MODE_LIST_REQUESTED', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      mode.loading = true;
      mode.error = false;
      delete mode.modes;

      const expectedState = {
        [id]: mode,
      };

      expect(reducer([], modeListRequested(id))).toEqual(expectedState);
    })

    it('should keep previous state when handling MODE_LIST_REQUESTED', () => {
      const id = randomNumber(99);

      const initialMode = generateMode(id);
      initialMode.loading = false;
      initialMode.error = false;
      const initialState = {
        [id]: initialMode,
      };

      const expectedState = {
        [id]: {
          ...initialMode,
          loading: true,
          error: false,
        },
      };

      expect(reducer(initialState, modeListRequested(id))).toEqual(expectedState);
    })

    it('should handle MODE_LIST_ERRORED', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      mode.loading = false;
      mode.error = true;
      delete mode.modes;

      const expectedState = {
        [id]: mode,
      };

      expect(reducer([], modeListErrored({ id, error: new Error() }))).toEqual(expectedState);
    })

    it('should keep previous state when handling MODE_LIST_ERRORED', () => {
      const id = randomNumber(99);

      const initialMode = generateMode(id);
      initialMode.loading = false;
      initialMode.error = false;
      const initialState = {
        [id]: initialMode,
      };

      const expectedState = {
        [id]: {
          ...initialMode,
          loading: false,
          error: true,
        },
      };

      expect(reducer(initialState, modeListErrored({ id, error: new Error() }))).toEqual(expectedState);
    })

    it('should handle MODE_LIST_LOADED', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const equipment = generateModeApiResult(mode);
      
      const expectedState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
        },
      };

      const payload = { id, equipment };

      expect(reducer([], modeListLoaded(payload))).toEqual(expectedState);
    })

    it('should keep previous state when handling MODE_LIST_LOADED', () => {
      const initialId = randomNumber(99);
      const initialMode = generateMode(initialId);
      const initialState = {
        [initialId]: {
          ...initialMode,
          currentMode: initialMode.modes[0],
        },
      };

      const id = randomNumber(99);
      const mode = generateMode(id);
      const equipment = generateModeApiResult(mode);

      const expectedState = {
        ...initialState,
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
        },
      };

      const payload = { id, equipment };

      expect(reducer(initialState, modeListLoaded(payload))).toEqual(expectedState);
    })

    it('should handle MODE_CHANGE_REQUESTED and keep mode values', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);

      const initialState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
        },
      };

      const expectedState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
          loading: true,
          error: false,
        },
      };

      const payload = {
        id,
        cmd: mode.modes[0].id,
      };
      expect(reducer(initialState, modeChangeRequested(payload))).toEqual(expectedState);
    });

    it('should handle MODE_CHANGE_ERRORED and keep mode values', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const cmd = mode.modes[0].id;

      const initialState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
        },
      };

      const expectedState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
          loading: false,
          error: false,
        },
      };

      const payload = {
        id,
        cmd,
        error: new Error(),
      };
      expect(reducer(initialState, modeChangeErrored(payload))).toEqual(expectedState);
    })

    it('should handle MODE_CHANGE_SUCCEEDED and keep mode values', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);

      const initialState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
        },
      };

      const expectedState = {
        [id]: {
          ...mode,
          currentMode: mode.modes[0],
          loading: false,
          error: false,
        },
      };

      const payload = {
        id,
        cmd: mode.modes[0].id,
      };
      expect(reducer(initialState, modeChangeSucceeded(payload))).toEqual(expectedState);
    })
  });

  // Side effects
  describe('Side effects', () => {
    it('should dispatch modeListLoaded', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const equipmentApiResult = generateModeApiResult(mode);

      const generator = modeListRequestSaga(modeListRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      const loadedPayload = { id, equipment: equipmentApiResult };
      next = generator.next(equipmentApiResult);
      expect(next.value).toEqual(put(modeListLoaded(loadedPayload)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch modeListErrored', () => {
      const id = randomNumber(99);
      const error = new TypeError();

      const generator = modeListRequestSaga(modeListRequested(id));
      
      let next = generator.next();
      expect(next.value).toEqual(call(getJeedomEquipment, id));

      next = generator.throw(error);
      expect(next.value).toEqual(put(modeListErrored({ id, error })));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch modeChangeSucceeded then modeListRequested', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      
      const payload = {
        id,
        cmd: mode.modes[0].id,
      }
      const generator = modeChangeRequestSaga(modeChangeRequested(payload));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, payload.cmd));

      next = generator.next();
      expect(next.value).toEqual(delay(REFRESH_DELAY));

      next = generator.next();
      expect(next.value).toEqual(put(modeChangeSucceeded(payload)));

      next = generator.next();
      expect(next.value).toEqual(put(modeListRequested(id)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch modeChangeErrored then showErrorSnackbar then modeListRequested', () => {
      const id = randomNumber(99);
      const mode = generateMode(id);
      const error = new TypeError();
      
      const payload = {
        id,
        cmd: mode.modes[0].id,
      }
      const generator = modeChangeRequestSaga(modeChangeRequested(payload));
      
      let next = generator.next();
      expect(next.value).toEqual(call(execJeedomCmd, payload.cmd));

      next = generator.throw(error);
      expect(next.value).toEqual(put(modeChangeErrored({ ...payload, error })));
      
      next = generator.next();
      expect(next.value).toEqual(put(showErrorSnackbar(SNACKBAR_ERROR)));

      next = generator.next();
      expect(next.value).toEqual(put(modeListRequested(id)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

  });
});