import React, { Component } from 'react';
import { connect } from "react-redux";
import CardCamera from '../../components/CardCamera/CardCamera';
import CardCameraGarage from '../../components/CardCameraGarage/CardCameraGarage';
import CardDoor from '../../components/CardDoor/CardDoor';
import CardLight from '../../components/CardLights/CardLights';
import CardMode from '../../components/CardMode/CardMode';
import { allLightStatusRequested, allLightsOffRequested } from '../../redux/modules/light';
import { doorStatusWithHistoryRequested, doorHistoryShow, doorHistoryHide } from '../../redux/modules/door';
import { modeListRequested, modeChangeRequested } from "../../redux/modules/mode";
import { HOUSE_MODE_ID, LIVING_CAMERA_ID, GARAGE_CAMERA_ID } from '../../constants/equipments';
import { GARAGE_DOOR_CMD, ENTRY_DOOR_CMD } from '../../constants/commands';
import { cameraImageRequested } from "../../redux/modules/camera";

export class CardList extends Component {
  constructor() {
    super();

    this.handleHouseModeRetry = this.handleHouseModeRetry.bind(this);
    this.handleLightStatusRetry = this.handleLightStatusRetry.bind(this);
  }

  componentDidMount() {
    this.props.getAllLightStatus();
    this.props.getDoorStatusHistory({id: GARAGE_DOOR_CMD});
    this.props.getDoorStatusHistory({id: ENTRY_DOOR_CMD});
    this.props.getCameraImage(GARAGE_CAMERA_ID);
    this.props.getCameraImage(LIVING_CAMERA_ID);
    this.props.getMode(HOUSE_MODE_ID);
  }

  handleHouseModeRetry() {
    this.props.getMode(HOUSE_MODE_ID);
  }

  handleLightStatusRetry() {
    this.props.getAllLightStatus();
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
            error={this.props.lights.error}
            loading={this.props.lights.loading}
            lights={this.props.lights.lights}
            onOffClick={this.props.handleLightOffClick}
            onRetry={this.handleLightStatusRetry} />

          <CardCameraGarage
            title="Garage"
            cameraImage={this.props.garageCameraImage}
            door={this.props.garageDoor}
            onHistoryClick={() => { this.props.handleDoorHistoryClick(GARAGE_DOOR_CMD) }}
            onHistoryBackdropClose={() => { this.props.handleHistoryBackdropClose(GARAGE_DOOR_CMD)}} />
          
          <CardDoor
            title="Entrée"
            door={this.props.enrtyDoor}
            onHistoryClick={() => { this.props.handleDoorHistoryClick(ENTRY_DOOR_CMD) }}
            onHistoryBackdropClose={() => { this.props.handleHistoryBackdropClose(ENTRY_DOOR_CMD)}} />

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
  garageDoor: state.door[GARAGE_DOOR_CMD],
  enrtyDoor: state.door[ENTRY_DOOR_CMD],
  garageCameraImage: state.camera[GARAGE_CAMERA_ID],
  livingCameraImage: state.camera[LIVING_CAMERA_ID],
  houseMode: state.mode[HOUSE_MODE_ID],
});

const mapDispatchToProps = {
  getAllLightStatus: allLightStatusRequested,
  getDoorStatusHistory: doorStatusWithHistoryRequested,
  handleDoorHistoryClick: doorHistoryShow,
  handleHistoryBackdropClose: doorHistoryHide,
  handleLightOffClick: allLightsOffRequested,
  getCameraImage: cameraImageRequested,
  getMode: modeListRequested,
  handleChangeMode: modeChangeRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
