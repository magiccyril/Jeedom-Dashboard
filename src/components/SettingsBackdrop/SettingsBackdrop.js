import React from 'react';

import Backdrop from '../Backdrop/Backdrop';
import SettingsForm from '../../containers/SettingsForm/SettingsForm';

function SettingsBackdrop(props) {
  return (
    props.show ?
      <Backdrop title="Paramètres" onClose={props.onClose}>
        <SettingsForm onSuccess={props.onSuccess} />
      </Backdrop>
    : ''
  );
}

export default SettingsBackdrop;
