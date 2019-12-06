import React, { useState } from 'react';
import CardCamera from '../CardCamera/CardCamera';
import Backdrop from '../Backdrop/Backdrop';
import BackdropDoorHistory from '../BackdropDoorHistory/BackdropDoorHistory';
import { formatDoorDate } from '../utils';

function CardCameraDoor(props) {
  const status = formatDoorDate('Le garage', props.door);

  const overlay = props.door && props.door.loading ? 'Chargement...' : '';

  const [hasConfirmation, setShowConfirmation] = useState(false);
  const hideConfirmation = () => setShowConfirmation(false);
  const showConfirmation = () => setShowConfirmation(true);
  const triggerDoor = () => {
    props.onDoorTriggerClick({id: props.door.id, cmd: props.triggerCmd});
    hideConfirmation();
  }
  let confirmationBackdrop = null;
  if (hasConfirmation === true) {
    confirmationBackdrop = (
      <Backdrop title="Êtes vous sure ?" onClose={hideConfirmation}>
        <div className="text-center">
          <button type="button" className="btn btn-light" onClick={hideConfirmation}>Annuler</button>
          <button type="button" className="btn btn-primary" onClick={triggerDoor}>Actionner</button>
        </div>
      </Backdrop>
    )
  }

  let historyButton = '';
  if (props.onHistoryClick) {
    historyButton = <button className="btn btn-link" onClick={() => props.onHistoryClick(props.door.id)}>Historique</button>
  }

  return (
    <CardCamera
      title={props.title}
      cameraImage={props.cameraImage}
      overlay={overlay}>
      <p className="card-text">{status}</p>
      <div className="text-right">
        {historyButton}
        <button className="btn btn-primary" onClick={showConfirmation}>Actioner</button>
      </div>

      <BackdropDoorHistory
        title="Historique"
        show={props.door && props.door.showHistory}
        onClose={() => props.onHistoryBackdropClose(props.door.id)}
        history={props.door && props.door.history ? props.door.history : null} />

      {confirmationBackdrop}
    </CardCamera>
  );
}

export default CardCameraDoor;
