import React, { Component } from 'react';
import { connect } from "react-redux";
import CardCamera from '../../components/CardCamera/CardCamera';
import CardLight from '../../components/CardLights/CardLights';
import CardMode from '../../components/CardMode/CardMode';
import { allLightStatusRequested, allLightsOffRequested } from '../../redux/modules/light';
import { modeListRequested, modeChangeRequested } from "../../redux/modules/mode";
import { HOUSE_MODE_ID, LIVING_CAMERA_ID, GARAGE_CAMERA_ID } from '../../constants/equipments';
import { cameraImageRequested } from "../../redux/modules/camera";

export class CardList extends Component {
  constructor() {
    super();

    this.handleHouseModeRetry = this.handleHouseModeRetry.bind(this);
  }

  componentDidMount() {
    this.props.getAllLightStatus();
    this.props.getCameraImage(GARAGE_CAMERA_ID);
    this.props.getCameraImage(LIVING_CAMERA_ID);
    this.props.getMode(HOUSE_MODE_ID);
  }

  handleHouseModeRetry() {
    this.props.getMode(HOUSE_MODE_ID);
  }

  formatModeToProps(mode) {
    return '' + mode.id + '|' + mode.name
  };
  getCurrentMode(modeState) {
    if (!modeState || !modeState.currentMode) {
      return '|...';
    }
  
    return this.formatModeToProps(modeState.currentMode)
  }
  getModes(modeState) {
    if (!modeState || !modeState.modes) {
      return '|...';
    }
  
    return modeState.modes.map(this.formatModeToProps).join('##');
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
            cameraImage={this.props.garageCameraImage}>
            <p className="card-text">Le garage est ouvert ou fermé depuis tant de temps !</p>
            <div className="text-right">
              <button className="btn btn-primary">Actioner</button>
            </div>
          </CardCamera>
          
          <CardCamera
            title="Séjour"
            cameraImage={this.props.livingCameraImage} />

          <CardMode
            title="Maison"
            loading={this.props.houseMode ? this.props.houseMode.loading : false}
            error={this.props.houseMode ? this.props.houseMode.error : false}
            equipment={HOUSE_MODE_ID}
            currentMode={this.getCurrentMode(this.props.houseMode)}
            modes={this.getModes(this.props.houseMode)}
            onModeClick={this.props.handleChangeMode}
            onRetry={this.handleHouseModeRetry} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lights: state.light,
  garageCameraImage: state.camera[GARAGE_CAMERA_ID],
  livingCameraImage: state.camera[LIVING_CAMERA_ID],
  houseMode: state.mode[HOUSE_MODE_ID],
});

const mapDispatchToProps = {
  getAllLightStatus: allLightStatusRequested,
  handleLightOffClick: allLightsOffRequested,
  getCameraImage: cameraImageRequested,
  getMode: modeListRequested,
  handleChangeMode: modeChangeRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
