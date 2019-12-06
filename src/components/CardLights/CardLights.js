import React from 'react';
import Card from '../Card/Card';

function CardLights(props) {
  const lightsOn = props.lights.lights.filter((light) => (light.value === 1));
  
  let button = null;
  const offPayload = {
    id: props.lights.id,
    off_cmd_id: props.lights.off_cmd_id
  }

  let text = 'Le statut des lumières est indéterminé !';

  if (lightsOn.length === 0) {
    text = 'Toutes les lumières sont éteintes.';
  }
  if (lightsOn.length === 1) {
    text = 'La lumière ' + lightsOn[0].singularComplement + ' ' + lightsOn[0].label + ' est allumée.';
  }
  if (lightsOn.length > 1) {
    text = 'Les lumières ' + lightsOn.reduce((labels, item) => labels + item.label + ', ', '') + ' sont allumées.';
  }
  if (lightsOn.length > 0) {
    button = (
      <div className="text-right">
        <button className="btn btn-primary" onClick={() => props.onOffClick(offPayload)}>Tout éteindre</button>
      </div>
    );
  }

  const overlay = props.loading ? 'Chargement...' : '';

  if (props.lights.error) {
    return (
      <Card title={props.title} error overlay={overlay}>
        <p className="card-text">Oups une erreur est survenue dans la récupération de l'état des lumières !</p>
      </Card>
    )
  }

  return (
    <Card title={props.title} overlay={overlay}>
      <p className="card-text">{text}</p>
      {button}
    </Card>
  );
}

export default CardLights;
