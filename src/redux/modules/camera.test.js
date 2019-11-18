import reducer, { 
  CAMERA_IMAGE_REQUESTED,
  CAMERA_IMAGE_LOADED,
  CAMERA_IMAGE_ERRORED,
  cameraImageRequested,
  cameraImageLoaded,
  cameraImageErrored
} from './camera';


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
      const firstImageUrl = 'http://via.placeholder.com/640x480';
      const firstAction = {
        type: CAMERA_IMAGE_LOADED,
        payload: {
          cameraId: firstCameraId,
          imageUrl: firstImageUrl,
        },
      };
      const firstExpectedState = {
        [firstCameraId]: firstImageUrl,
      };

      const secondCameraId = 7;
      const secondImageUrl = 'http://via.placeholder.com/480x640';
      const secondAction = {
        type: CAMERA_IMAGE_LOADED,
        payload: {
          cameraId: secondCameraId,
          imageUrl: secondImageUrl,
        },
      };
      const secondExpectedState = {
        [firstCameraId]: firstImageUrl,
        [secondCameraId]: secondImageUrl,
      };

      expect(reducer([], firstAction)).toEqual(firstExpectedState)
      expect(reducer(firstExpectedState, secondAction)).toEqual(secondExpectedState)
    })
  });
});