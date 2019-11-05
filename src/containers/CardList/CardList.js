import React, { Component } from 'react';
import { connect } from "react-redux";
import CardCamera from '../../components/CardCamera/CardCamera';
import CardLight from '../../components/CardLights/CardLights';
import CardMode from '../../components/CardMode/CardMode';
import { allLightStatusRequested, allLightsOffRequested } from '../../redux/modules/light';
import { modeListRequested, modeChangeRequested } from "../../redux/modules/mode";
import { HOUSE_MODE_ID } from '../../constants/equipments';
import { cameraImageRequested } from "../../redux/modules/camera";
import { GARAGE_CAMERA_ID } from '../../constants/equipments';

export class CardList extends Component {
  constructor() {
    super();

    this.handleHouseModeRetry = this.handleHouseModeRetry.bind(this);
  }

  componentDidMount() {
    this.props.getAllLightStatus();
    this.props.getCameraImage(GARAGE_CAMERA_ID);
    this.props.getMode(HOUSE_MODE_ID);
  }

  handleHouseModeRetry() {
    this.props.getMode(HOUSE_MODE_ID);
  }

  render() {
    return (
      <div className="container">
        <div className="card-columns">
          <CardLight
            lights={this.props.lights}
            onOffClick={this.props.handleLightOffClick} />

          <CardCamera
            title="Garage"
            cameraImage={this.props.garageCameraImage} />

          <CardMode
            title="Maison"
            loading={this.props.houseModeLoading}
            error={this.props.houseModeErrored}
            equipment={HOUSE_MODE_ID}
            currentMode={this.props.houseCurrentMode}
            modes={this.props.houseModes}
            onModeClick={this.props.handleChangeMode}
            onRetry={this.handleHouseModeRetry} />
        </div>
      </div>
    );
  }
}

const formatModeToProps = (mode) => ('' + mode.id + '|' + mode.name);
const mapStateCurrentModeToProps = (modeState) => {
  if (!modeState || !modeState.currentMode) {
    return '|...';
  }

  return formatModeToProps(modeState.currentMode)
}
const mapStateModeToProps = (modeState) => {
  if (!modeState || !modeState.modes) {
    return '|...';
  }

  return modeState.modes.map(formatModeToProps).join('##');
}

const mapStateToProps = (state) => ({
  lights: state.light,
  garageCameraImage: state.camera[GARAGE_CAMERA_ID],
  houseCurrentMode: mapStateCurrentModeToProps(state.mode[HOUSE_MODE_ID]),
  houseModes: mapStateModeToProps(state.mode[HOUSE_MODE_ID]),
  houseModeLoading: state.mode[HOUSE_MODE_ID] ? state.mode[HOUSE_MODE_ID].loading : false,
  houseModeErrored: state.mode[HOUSE_MODE_ID] ? state.mode[HOUSE_MODE_ID].error : false,
});

const mapDispatchToProps = {
  getAllLightStatus: allLightStatusRequested,
  handleLightOffClick: allLightsOffRequested,
  getCameraImage: cameraImageRequested,
  getMode: modeListRequested,
  handleChangeMode: modeChangeRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
