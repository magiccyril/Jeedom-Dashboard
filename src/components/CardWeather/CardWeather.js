import React from 'react';
import Card from '../Card/Card';
import './CardWeather.scss';

const WEATHER_ITEMS_NAME = {
  'humidity': 'Humidité',
  'co2': 'CO2',
  'brightness': 'Luminosité',
  'noise': 'Bruit',
  'presure': 'Pression',
  'rainCurrent': 'Pluie (h)',
  'rainTotal': 'Pluie (j)',
  'windSpeed': 'Vent',
}

const formatWeatherItem = (name, item) => {
  if (!item) {
    return ''
  }

  return <li key={item.id}>{name} : {item.value}{item.unit}</li>
}

function CardWeather(props) {
  if (!props.weather || props.weather.loading) {
    return (
      <Card title={props.title}>
        Chargement...
        {props.children}
      </Card>
    )
  }

  const weatherItems = props.weather.weather;
  
  let temperature = '';
  if (weatherItems.temperature) {
    temperature = (
      <div className="col-5 order-12 text-center weather-item-temperature">
        <h2>{weatherItems.temperature.value}{weatherItems.temperature.unit}</h2>
        <button className="btn btn-light btn-sm">Historique</button>
      </div>
    )
  }

  let items = [];
  Object.keys(WEATHER_ITEMS_NAME).forEach((item) => {
    items.push(formatWeatherItem(WEATHER_ITEMS_NAME[item], weatherItems[item]))
  })

  if (items.length > 0) {
    items = <ul className="col-7 order-1 list-unstyled">{items}</ul>
  }

  return (
    <Card title={props.title}>
      <div className="row align-items-center">
        {temperature}
        {items}
      </div>
      {props.children}
    </Card>
  );
}

export default CardWeather;
