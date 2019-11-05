import React from 'react';
import './Header.scss';
import Summary from '../Summary/Summary';

function Header(props) {
  return (
    <header className="app-header">
      <div className="container">
        <a href="#Settings" className="settings-show text-hide" onClick={props.onShowSettings}>Paramètres</a>

        <h1>Salut,</h1>
        <h3>Tout va bien à la maison</h3>
        <Summary summary={props.summary} />
      </div>
    </header>
  );
}

export default Header;
