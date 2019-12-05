import React from 'react';
import './Header.scss';
import Summary from '../Summary/Summary';

function Header(props) {
  const collapsedClassName = props.collapsed ? ' app-header-collapsed' : '';

  return (
    <header className={"app-header" + collapsedClassName}>
      <div className="container">
        <a href="#Settings" className="settings-show text-hide" onClick={props.onShowSettings}>Paramètres</a>

        <h1>Salut,</h1>
        <Summary summary={props.summary} />
      </div>
    </header>
  );
}

export default Header;
