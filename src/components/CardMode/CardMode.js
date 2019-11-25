import React from 'react';
import Card from '../Card/Card';

function CardMode(props) {
  if (!props.mode) {
    return '';
  }

  const modes = props.mode.modes;
  const currentModeName = props.mode.currentMode ? props.mode.currentMode.name : 'Indéterminé';

  const onModeClickFactory = (equipmentId, cmdId) => (
    (e) => {
      e.preventDefault();
      const payload = {
        id: equipmentId,
        cmd: cmdId,
      };
      props.onModeClick(payload);
    }
  );

  let buttons = '';
  if (modes) {
    buttons = modes.map(mode => {
      const disabled = mode.id === props.mode.currentMode.id;

      return (<button
        type="button"
        className="btn btn-primary"
        onClick={onModeClickFactory(props.mode.id, mode.id)}
        disabled={disabled}
        key={mode.id}>
        {mode.name}
      </button>)
    });
  }

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
      <p className="card-text">Actuellement en mode <strong>{currentModeName}</strong>.</p>
      <div className="text-center">
        <div className="btn-group" role="group" aria-label="Modes">
          {buttons}
        </div>
      </div>
    </Card>
  );
}

export default CardMode;
