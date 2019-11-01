import React from 'react';
import Card from '../Card/Card';
import CardCamera from '../CardCamera/CardCamera';

function CardList() {
  return (
    <div className="container">
      <div className="row card-list">
        <Card title="Carte 1" />
        <CardCamera title="Garage" cameraId="56" />
        <Card title="Carte 2" />
      </div>
    </div>
  );
}

export default CardList;
