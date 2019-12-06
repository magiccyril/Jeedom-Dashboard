import React from 'react';
import CardCamera from '../CardCamera/CardCamera';
import BackdropDoorHistory from '../BackdropDoorHistory/BackdropDoorHistory';
import { formatDoorDate } from '../utils';

function CardCameraDoor(props) {
  const status = formatDoorDate('Le garage', props.door);

  const overlay = props.door && props.door.loading ? 'Chargement...' : '';

  return (
    <CardCamera
      title={props.title}
      cameraImage={props.cameraImage}
      overlay={overlay}>
      <p className="card-text">{status}</p>
      <div className="text-right">
        {props.onHistoryClick ? <button className="btn btn-link" onClick={() => props.onHistoryClick(props.door.id)}>Historique</button> : ''}
        <button className="btn btn-primary">Actioner</button>
      </div>

      <BackdropDoorHistory
        title="Historique"
        show={props.door && props.door.showHistory}
        onClose={() => props.onHistoryBackdropClose(props.door.id)}
        history={props.door && props.door.history ? props.door.history : null} />
    </CardCamera>
  );
}

export default CardCameraDoor;