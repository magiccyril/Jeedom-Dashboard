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
    this.props.getRooms();
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

    return (
      <div className="App" id="App">
        <Header 
          collapsed={this.state.collapsedHeader}
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
