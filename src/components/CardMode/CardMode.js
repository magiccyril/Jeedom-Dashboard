import React from 'react';
import Card from '../Card/Card';

function CardMode(props) {
  const parsePropMode = (propString) => ({
    id: propString.split('|')[0],
    name: propString.split('|')[1],
  });

  const currentMode = parsePropMode(props.currentMode);

  const modes = props.modes.split('##').map(mode => {
    const {id, name} = parsePropMode(mode);
    const disabled = id === currentMode.id;

    const onClick = (e) => {
      e.preventDefault();
      const payload = {
        equipment: props.equipment,
        cmd: id,
      };
      props.onModeClick(payload);
    }

    return (<button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled}
      key={id}>
      {name}
    </button>)
    });

  const overlay = props.loading ? 'Chargement...' : '';

  if (props.error) {
    return (
      <Card title={props.title} error overlay={overlay}>
        <p className="card-text">Oups une erreur est survenue dans la récupération des modes !</p>
        <div className="text-right">
          <button className="btn btn-primary" onClick={props.onRetry}>Ré-essayer</button>
        </div>
      </Card>
    )
  }

  return (
    <Card title={props.title} overlay={overlay}>
      <p className="card-text">Actuellement en mode <strong>{currentMode.name}</strong>.</p>
      <div className="text-center">
        <div className="btn-group" role="group" aria-label="Modes">
          {modes}
        </div>
      </div>
    </Card>
  );
}

export default CardMode;
