import React from 'react';
import Card from '../Card/Card';

function CardLights(props) {
  const lightsOn = props.lights.lights.filter((light) => (light.value === 1));
  
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

  const overlay = props.loading ? 'Chargement...' : '';

  if (props.lights.error) {
    return (
      <Card title={props.title} error overlay={overlay}>
        <p className="card-text">Oups une erreur est survenue dans la récupération de l'état des lumières !</p>
      </Card>
    )
  }

  return (
    <Card title="Lumières" overlay={overlay}>
      <p className="card-text">{text}</p>
      <div className="text-right">
        <button className="btn btn-primary" onClick={props.onOffClick}>Tout éteindre</button>
      </div>
    </Card>
  );
}

export default CardLights;
