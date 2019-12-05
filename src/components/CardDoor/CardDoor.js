import React from 'react';
import Card from '../Card/Card';
import BackdropDoorHistory from '../BackdropDoorHistory/BackdropDoorHistory';
import { formatDoorDate } from '../utils';

function CardDoor(props) {
  const overlay = props.door && props.door.loading ? 'Chargement...' : '';
  const status = formatDoorDate('La porte', props.door);

  return (
    <Card
      title={props.title}
      overlay={overlay}>
      <p className="card-text">{status}</p>
      <div className="text-right">
        {props.onHistoryClick ? <button className="btn btn-link" onClick={() => props.onHistoryClick(props.door.id)}>Historique</button> : ''}
      </div>

      <BackdropDoorHistory
        title="Historique"
        show={props.door && props.door.showHistory}
        onClose={() => props.onHistoryBackdropClose(props.door.id)}
        history={props.door && props.door.history ? props.door.history : null} />
    </Card>
  );
}

export default CardDoor;
