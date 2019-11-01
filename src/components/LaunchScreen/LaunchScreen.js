import React from 'react';
import SettingsForm from '../SettingsForm/SettingsForm';

import loaderSvg from './loader.svg';
import './LaunchScreen.scss';

function LaunchScreen(props) {
  const loader = !props.showSetup ?
      <img className="loader" src={loaderSvg} width="50" alt="" />
      : '';
    
  const settingsForm = props.showSetup ?
    <SettingsForm onSuccess="props.onSuccess" />
    : '';

  return (
    <div className="launchScreen position-fixed">
      <div className="container fixed-bottom">
        <h1>Bienvenue,</h1>
        { loader }
        { settingsForm }
      </div>
    </div>
  )
};

export default LaunchScreen;
