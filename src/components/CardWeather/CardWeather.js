import React from 'react';
import Card from '../Card/Card';

function CardWeather(props) {
  return (
    <Card title={props.title}>
      <div className="row align-items-center">
        <div className="col-5 order-12 text-center">
          <h2>{props.temperature}°</h2>
          <small>Historique</small>
        </div>
        <ul className="col-7 order-1 list-unstyled">
          <li>Humidité : 23%</li>
          <li>CO2: 443ppm</li>
          <li>Bruit: 38dB</li>
        </ul>
      </div>
      {props.children}
    </Card>
  );
}

export default CardWeather;
