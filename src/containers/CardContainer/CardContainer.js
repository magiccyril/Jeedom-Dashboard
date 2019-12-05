import React, { Component } from 'react';
import { connect } from 'react-redux';

import CardCamera from '../../components/CardCamera/CardCamera';
import CardCameraGarage from '../../components/CardCameraGarage/CardCameraGarage';
import CardDoor from '../../components/CardDoor/CardDoor';
import CardLight from '../../components/CardLights/CardLights';
import CardMode from '../../components/CardMode/CardMode';
import CardThermostat from '../../components/CardThermostat/CardThermostat';
import CardWeather from '../../components/CardWeather/CardWeather';
import { cameraImageRequested } from '../../redux/modules/camera';
import { doorStatusWithHistoryRequested, doorHistoryShow, doorHistoryHide } from '../../redux/modules/door';
import { allLightStatusRequested, allLightsOffRequested } from '../../redux/modules/light';
import { modeListRequested, modeChangeRequested } from '../../redux/modules/mode';
import { thermostatRequested, thermostatModeChangeRequested } from '../../redux/modules/thermostat';
import { weatherRequested, weatherHistoryShow, weatherHistoryHide } from '../../redux/modules/weather';

import { CARD_TYPES } from '../../constants/cards';

export class CardContainer extends Component {
  componentDidMount() {
    this.props.cards.forEach((card) => {
      this.prepareCard(card);
    })
  }

  prepareCard(card) {
    switch (card.type) {
      case CARD_TYPES.camera:
        this.props.getCameraImage(card.settings.equipment_id);
        break;
      
      case CARD_TYPES.cameraDoor:
        this.props.getCameraImage(card.settings.equipment_id);
        this.props.getDoorStatusHistory({id: card.settings.door_status_command});
        break;
      
      case CARD_TYPES.door:
        this.props.getDoorStatusHistory({id: card.settings.command_id});
        break;
      
      case CARD_TYPES.lights:
        this.props.getAllLightStatus({
          id: card.settings.equipment_id,
          off_cmd_id: card.settings.command_id,
        });
        break;
      
      case CARD_TYPES.mode:
        this.props.getMode(card.settings.equipment_id);
        break;

      case CARD_TYPES.thermostat:
        this.props.getThermostat(card.settings.thermostat_equipment_id);
        this.props.getWeather(card.settings.weather_equipment_id);
        break;

      case CARD_TYPES.weather:
        this.props.getWeather(card.settings.equipment_id);
        break;

      default:
        break;
    }
  }

  createCard(card, index) {
    switch (card.type) {
      case CARD_TYPES.camera:
        return <CardCamera
        title={card.title}
        cameraImage={this.props.camera[card.settings.equipment_id]}
        key={index} />;

      case CARD_TYPES.cameraDoor:
        return <CardCameraGarage
          title={card.title}
          cameraImage={this.props.camera[card.settings.equipment_id]}
          door={this.props.door[card.settings.door_status_command]}
          onHistoryClick={this.props.handleDoorHistoryClick}
          onHistoryBackdropClose={this.props.handleDoorHistoryBackdropClose}
          key={index} />;

      case CARD_TYPES.door:
        return <CardDoor
          title={card.title}
          door={this.props.door[card.settings.command_id]}
          onHistoryClick={this.props.handleDoorHistoryClick}
          onHistoryBackdropClose={this.props.handleDoorHistoryBackdropClose}
          key={index} />;
      
      case CARD_TYPES.lights:
        return <CardLight
          title={card.title}
          lights={this.props.lights}
          onOffClick={this.props.handleAllLightOffClick}
          key={index} />

      case CARD_TYPES.mode:
        return <CardMode
          title={card.title}
          mode={this.props.mode[card.settings.equipment_id]}
          onModeClick={this.props.handleChangeMode}
          key={index} />;

      case CARD_TYPES.thermostat:
        return <CardThermostat
          title={card.title}
          thermostat={this.props.thermostat[card.settings.thermostat_equipment_id]}
          weather={this.props.weather[card.settings.weather_equipment_id]}
          onModeChange={this.props.handleThermostatModeChange}
          onHistoryClick={this.props.handleWeatherHistoryShow}
          onHistoryClose={this.props.handleWeatherHistoryClose}
          key={index} />;

      case CARD_TYPES.weather:
        return <CardWeather
          title={card.title}
          weather={this.props.weather[card.settings.equipment_id]}
          onHistoryClick={this.props.handleWeatherHistoryShow}
          onHistoryClose={this.props.handleWeatherHistoryClose}
          key={index} />;

      default:
        return;
    }
  }
  

  render() {
    let cards = [];

    this.props.cards.forEach((card, i) => {
      cards.push(this.createCard(card, i));
    })

    return <div>{cards}</div>;
  }
}


const mapStateToProps = (state) => ({
  lights: state.light,
  door: state.door,
  camera: state.camera,
  mode: state.mode,
  thermostat: state.thermostat,
  weather: state.weather,
});

const mapDispatchToProps = {
  // Camera
  getCameraImage: cameraImageRequested,
  // Door
  getDoorStatusHistory: doorStatusWithHistoryRequested,
  handleDoorHistoryClick: doorHistoryShow,
  handleDoorHistoryBackdropClose: doorHistoryHide,
  // Lights
  getAllLightStatus: allLightStatusRequested,
  handleAllLightOffClick: allLightsOffRequested,
  // Mode
  getMode: modeListRequested,
  handleChangeMode: modeChangeRequested,
  // Thermostat
  getThermostat: thermostatRequested,
  handleThermostatModeChange: thermostatModeChangeRequested,
  // Weather
  getWeather: weatherRequested,
  handleWeatherHistoryShow: weatherHistoryShow,
  handleWeatherHistoryClose: weatherHistoryHide,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardContainer);
