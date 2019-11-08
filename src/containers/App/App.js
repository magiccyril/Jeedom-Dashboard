import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showSettings, hideSettings, settingsFormSucceeded } from "../../redux/modules/settings";
import { appLaunchRequested, appLaunchSucceeded } from "../../redux/modules/launchScreen";
import { setSummaryIntervalRegistration } from "../../redux/modules/summary";
import { roomsRequested } from "../../redux/modules/room";

import LaunchScreen from '../../components/LaunchScreen/LaunchScreen';
import Header from '../../components/Header/Header';
import CardList from '../CardList/CardList';
import RoomList from '../../components/RoomList/RoomList';
import BackdropSettings from '../../components/BackdropSettings/BackdropSettings';
import Snackbar from '../../components/Snackbar/Snackbar';

import './App.scss';

export class App extends Component {
  componentDidMount() {
    this.props.appLaunchRequested();
    this.props.setSummaryIntervalRegistration();
    this.props.getRooms();
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

    return (
      <div className="App" id="App">
        <Header 
          onShowSettings={this.props.handleShowSettings}
          summary={this.props.summary} />

        <CardList />

        <RoomList
          rooms={this.props.rooms.list}
          loading={this.props.rooms.loading}
          error={this.props.rooms.error} />
        
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
  rooms: state.room,
  snackbar: state.snackbar,
});

const mapDispatchToProps = {
  appLaunchRequested: appLaunchRequested,
  handleShowSettings: showSettings,
  handleCloseSettings: hideSettings,
  handleLaunchScreenSetupSuccess: appLaunchSucceeded,
  handleSettingsBackdropFormSuccess: settingsFormSucceeded,
  setSummaryIntervalRegistration: setSummaryIntervalRegistration,
  getRooms: roomsRequested,
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
