import React, { Component } from 'react';
import { connect } from "react-redux";
import CardCamera from '../../components/CardCamera/CardCamera';
import CardCameraGarage from '../../components/CardCameraGarage/CardCameraGarage';
import CardDoor from '../../components/CardDoor/CardDoor';
import CardLight from '../../components/CardLights/CardLights';
import CardMode from '../../components/CardMode/CardMode';
import CardThermostat from '../../components/CardThermostat/CardThermostat';
import CardWeather from '../../components/CardWeather/CardWeather';
import { allLightStatusRequested, allLightsOffRequested } from '../../redux/modules/light';
import { doorStatusWithHistoryRequested, doorHistoryShow, doorHistoryHide } from '../../redux/modules/door';
import { modeListRequested, modeChangeRequested } from '../../redux/modules/mode';
import { weatherRequested, weatherHistoryShow, weatherHistoryHide } from '../../redux/modules/weather';
import {
  HOUSE_MODE_ID,
  LIVING_CAMERA_ID,
  GARAGE_CAMERA_ID,
  LIVING_THERMOSTAT_ID,
  LIVING_WEATHER_ID,
  OUTDOOR_WEATHER_ID,
} from '../../constants/equipments';
import { GARAGE_DOOR_CMD, ENTRY_DOOR_CMD } from '../../constants/commands';
import { cameraImageRequested } from '../../redux/modules/camera';
import { thermostatRequested, thermostatModeChangeRequested } from '../../redux/modules/thermostat';

export class CardList extends Component {
  constructor() {
    super();

    this.state = {
      weather: {
        history: null,
      }
    };

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
    this.props.getThermostat(LIVING_THERMOSTAT_ID);
    this.props.getWeather(LIVING_WEATHER_ID);
    this.props.getWeather(OUTDOOR_WEATHER_ID);
  }

  handleHouseModeRetry() {
    this.props.getMode(HOUSE_MODE_ID);
  }

  handleLightStatusRetry() {
    this.props.getAllLightStatus();
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
            onHistoryBackdropClose={() => { this.props.handleDoorHistoryBackdropClose(GARAGE_DOOR_CMD)}} />
          
          <CardDoor
            title="Entrée"
            door={this.props.enrtyDoor}
            onHistoryClick={() => { this.props.handleDoorHistoryClick(ENTRY_DOOR_CMD) }}
            onHistoryBackdropClose={() => { this.props.handleDoorHistoryBackdropClose(ENTRY_DOOR_CMD)}} />

          <CardCamera
            title="Séjour"
            cameraImage={this.props.livingCameraImage} />

          <CardMode
            title="Maison"
            mode={this.props.houseMode}
            onModeClick={this.props.handleChangeMode}
            onRetry={this.handleHouseModeRetry} />

          <CardThermostat
            title="Environnement"
            thermostat={this.props.livingThermostat}
            weather={this.props.livingWeather}
            onModeChange={this.props.handleThermostatModeChange}
            onHistoryClick={this.props.handleWeatherHistoryShow}
            onHistoryClose={this.props.handleWeatherHistoryClose} />

          <CardWeather
            title="Extérieur"
            weather={this.props.outdoorWeather}
            onHistoryClick={this.props.handleWeatherHistoryShow}
            onHistoryClose={this.props.handleWeatherHistoryClose} />
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
  livingThermostat: state.thermostat[LIVING_THERMOSTAT_ID],
  livingWeather: state.weather[LIVING_WEATHER_ID],
  outdoorWeather: state.weather[OUTDOOR_WEATHER_ID],
});

const mapDispatchToProps = {
  getAllLightStatus: allLightStatusRequested,
  getDoorStatusHistory: doorStatusWithHistoryRequested,
  handleDoorHistoryClick: doorHistoryShow,
  handleDoorHistoryBackdropClose: doorHistoryHide,
  handleLightOffClick: allLightsOffRequested,
  getCameraImage: cameraImageRequested,
  getMode: modeListRequested,
  handleChangeMode: modeChangeRequested,
  getThermostat: thermostatRequested,
  handleThermostatModeChange: thermostatModeChangeRequested,
  getWeather: weatherRequested,
  handleWeatherHistoryShow: weatherHistoryShow,
  handleWeatherHistoryClose: weatherHistoryHide,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
