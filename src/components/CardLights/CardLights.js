import React from 'react';
import Card from '../Card/Card';

function CardLights(props) {
  let lightsOn = [];
  let singularTextComplement = 'de la ';

  if (props.lights.livingroom === 1) {
    singularTextComplement = 'du ';
    lightsOn.push('séjour');
  }
  if (props.lights.kitchen === 1) {
    lightsOn.push('cuisine');
  }
  if (props.lights.entry === 1) {
    singularTextComplement = "de l'"
    lightsOn.push('entrée');
  }
  if (props.lights.bedroom === 1) {
    lightsOn.push('chambre');
  }

  let text = 'Toutes les lumières sont eteintes';

  if (props.lights.livingroom === -1
    || props.lights.kitchen === -1
    || props.lights.entry === -1
    || props.lights.bedroom === -1) {
      text = 'Le statut des lumières est indéterminé !';
    }
  if (lightsOn.length === 1) {
    text = 'La lumière ' + singularTextComplement + lightsOn[0] + ' est allumée';
  }
  if (lightsOn.length > 1) {
    text = 'Les lumières : ' + lightsOn.join(', ') + ' sont allumées';
  }
  
  return (
    <Card title="Lumières">
      <p className="card-text">{text}</p>
      <div className="text-right">
        <button className="btn btn-primary" onClick={props.onOffClick}>Tout éteindre</button>
      </div>
    </Card>
  );
}

export default CardLights;
