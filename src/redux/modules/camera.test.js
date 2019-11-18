import reducer, { 
  CAMERA_IMAGE_REQUESTED,
  CAMERA_IMAGE_LOADED,
  CAMERA_IMAGE_ERRORED,
  cameraImageRequested,
  cameraImageLoaded,
  cameraImageErrored,
  cameraImageRequestSaga,
} from './camera';
import { put, call } from 'redux-saga/effects'
import { getJeedomEquipment } from '../utils/jeedom';
import { getStorageSettings } from '../utils/storage';

describe('Camera', () => {
  describe('Actions', () => {
    it('should create an action to request a camera', () => {
      const cameraId = 18;
      const expectedAction = {
        type: CAMERA_IMAGE_REQUESTED,
        cameraId,
      };
      expect(cameraImageRequested(cameraId)).toEqual(expectedAction)
    });

    it('should create an action to load a camera image', () => {
      const cameraId = 18;
      const imageUrl = 'http://via.placeholder.com/640x480';

      const expectedAction = {
        type: CAMERA_IMAGE_LOADED,
        payload: {
          cameraId,
          imageUrl,
        },
      }

      expect(cameraImageLoaded(cameraId, imageUrl)).toEqual(expectedAction)
    });

    it('should create an action to errored a camera request', () => {
      const error = new Error();
      const expectedAction = {
        type: CAMERA_IMAGE_ERRORED,
        error,
      }
      expect(cameraImageErrored(error)).toEqual(expectedAction)
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({})
    })

    it('should handle CAMERA_IMAGE_LOADED', () => {
      const firstCameraId = 18;
      const firstImageUrl = 'http://firstImage.url';
      const firstExpectedState = {
        [firstCameraId]: firstImageUrl,
      };

      const secondCameraId = 7;
      const secondImageUrl = 'http://secondImage.url';
      const secondExpectedState = {
        [firstCameraId]: firstImageUrl,
        [secondCameraId]: secondImageUrl,
      };

      expect(reducer([], cameraImageLoaded(firstCameraId, firstImageUrl))).toEqual(firstExpectedState)
      expect(reducer(firstExpectedState, cameraImageLoaded(secondCameraId, secondImageUrl))).toEqual(secondExpectedState)
    })
  });

  describe('Side effects', () => {
    it('should dispatch cameraImageLoaded', () => {
      const cameraId = 18;
      const apikey = "FAKEAPIKEY";
      const url = "https://jeedom.url/";
      const settings = { url, apikey };
      const cameraUrl = "plugins/camera/core/php/snapshot.php?id="+cameraId+"&apikey="+apikey;
      const equipment = {
        "id": cameraId,
        "name": "Fake camera",
        "cmds": [
          {
            "id": "111",
            "generic_type": "CAMERA_URL",
            "currentValue": cameraUrl,
          },
          {
            "id": "222",
            "generic_type": "CAMERA_RECORD_STATE",
            "currentValue": 0
          },
          {
            "id": "333",
            "generic_type": "CAMERA_RECORD",
            "currentValue": null
          },
        ]
      };
      const imageUrl = url + cameraUrl;

      const generator = cameraImageRequestSaga(cameraImageRequested(cameraId));

      let next = generator.next();
      expect(next.value).toEqual(call(getStorageSettings));
      
      next = generator.next(settings);
      expect(next.value).toEqual(call(getJeedomEquipment, cameraId));

      next = generator.next(equipment);
      expect(next.value).toEqual(put(cameraImageLoaded(cameraId, imageUrl)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });

    it('should dispatch cameraImageErrored when no camera url detected', () => {
      const cameraId = 18;
      const apikey = "FAKEAPIKEY";
      const url = "https://jeedom.url/";
      const settings = { url, apikey };
      const equipment = {
        "id": cameraId,
        "name": "Fake camera",
        "cmds": [
          {
            "id": "222",
            "generic_type": "CAMERA_RECORD_STATE",
            "currentValue": 0
          },
          {
            "id": "333",
            "generic_type": "CAMERA_RECORD",
            "currentValue": null
          },
        ]
      };
      const error = new TypeError('Camera not detected');

      const generator = cameraImageRequestSaga(cameraImageRequested(cameraId));

      let next = generator.next();
      expect(next.value).toEqual(call(getStorageSettings));

      next = generator.next(settings);
      expect(next.value).toEqual(call(getJeedomEquipment, cameraId));

      next = generator.next(equipment);
      expect(next.value).toEqual(put(cameraImageErrored(error)));

      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});