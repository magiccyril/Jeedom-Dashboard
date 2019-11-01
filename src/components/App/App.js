import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showSettings, hideSettings, settingsFormSucceeded } from "../../redux/modules/settings";
import { appLaunchRequested, appLaunchSucceeded } from "../../redux/modules/launchScreen";

import LaunchScreen from '../LaunchScreen/LaunchScreen';
import Header from '../Header/Header';
import CardList from '../CardList/CardList';
import RoomList from '../RoomList/RoomList';
import SettingsBackdrop from '../SettingsBackdrop/SettingsBackdrop';
import Snackbar from '../Snackbar/Snackbar';

import './App.scss';

export class App extends Component {
  componentDidMount() {
    this.props.appLaunchRequested();
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
        <Header onShowSettings={this.props.handleShowSettings}/>
        <CardList />
        <RoomList />
        
        <SettingsBackdrop
          show={this.props.showSettingsBackdrop}
          onClose={this.props.handleCloseSettings}
          onSuccess={this.props.handleSettingsBackdropFormSuccess} />

        <Snackbar />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  launchScreen: state.launchScreen,
  showSettingsBackdrop: state.settings.show,
});

/*
const mapDispatchToProps = dispatch => {
  return {
    appLaunchRequested: () => { dispatch(appLaunchRequested()) },
    handleShowSettings: (e) => {
      e.preventDefault();
      dispatch(showSettings());
    },
    handleCloseSettings: () => {
      dispatch(hideSettings());
    },
  }
}*/

const mapDispatchToProps = {
  appLaunchRequested: appLaunchRequested,
  handleShowSettings: showSettings,
  handleCloseSettings: hideSettings,
  handleLaunchScreenSetupSuccess: appLaunchSucceeded,
  handleSettingsBackdropFormSuccess: settingsFormSucceeded,
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
