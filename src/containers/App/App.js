import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showSettings, hideSettings, settingsFormSucceeded } from "../../redux/modules/settings";
import { appLaunchRequested, appLaunchSucceeded } from "../../redux/modules/launchScreen";
import { setSummaryIntervalRegistration } from "../../redux/modules/summary";

import LaunchScreen from '../../components/LaunchScreen/LaunchScreen';
import Header from '../../components/Header/Header';
import CardContainer from '../CardContainer/CardContainer';
import RoomList from '../../components/RoomList/RoomList';
import BackdropSettings from '../../components/BackdropSettings/BackdropSettings';
import Snackbar from '../../components/Snackbar/Snackbar';

import {
  CARD_HOUSE_LIGHT_ALL,
  CARD_HOUSE_MODE,
  CARD_LIVING_THERMOSTAT,
  CARD_LIVING_LIGHT_MODE,
  CARD_LIVING_CAMERA,
  CARD_KITCHEN_LIGHT_MODE,
  CARD_ENTRY_DOOR,
  CARD_ENTRY_LIGHT_MODE,
  CARD_GARAGE_CAMERADOOR,
  CARD_EXTERIOR_WEATHER, } from '../../constants/cards';

import './App.scss';

export class App extends Component {
  constructor() {
    super();

    this.state ={
      collapsedHeader: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(e) {
    const threshold = 10.65 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    this.setState({collapsedHeader: window.scrollY > threshold});
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.props.appLaunchRequested();
    this.props.setSummaryIntervalRegistration();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    if (this.props.launchScreen.show) {
      return (
        <div className="App" id="App">
          <LaunchScreen
            showSetup={this.props.launchScreen.showSetup}
            onSuccess={this.props.handleLaunchScreenSetupSuccess} />
        </div>)
    }

    const cards = [
      CARD_HOUSE_LIGHT_ALL,
      CARD_GARAGE_CAMERADOOR,
      CARD_ENTRY_DOOR,
      CARD_LIVING_CAMERA,
      CARD_HOUSE_MODE,
      CARD_LIVING_THERMOSTAT,
      CARD_EXTERIOR_WEATHER,
    ];

    return (
      <div className="App" id="App">
        <Header 
          collapsed={this.state.collapsedHeader}
          onShowSettings={this.props.handleShowSettings}
          summary={this.props.summary} />

        <div className="container">
          <div className="card-columns">
            <CardContainer cards={cards} />
          </div>
        </div>

        <RoomList />
        
        <BackdropSettings
          show={this.props.showSettingsBackdrop}
          onClose={this.props.handleCloseSettings}
          onSuccess={this.props.handleSettingsBackdropFormSuccess} />

        <Snackbar text={this.props.snackbar.text} type={this.props.snackbar.type} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  launchScreen: state.launchScreen,
  showSettingsBackdrop: state.settings.show,
  summary: state.summary,
  snackbar: state.snackbar,
});

const mapDispatchToProps = {
  appLaunchRequested: appLaunchRequested,
  handleShowSettings: showSettings,
  handleCloseSettings: hideSettings,
  handleLaunchScreenSetupSuccess: appLaunchSucceeded,
  handleSettingsBackdropFormSuccess: settingsFormSucceeded,
  setSummaryIntervalRegistration: setSummaryIntervalRegistration,
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
