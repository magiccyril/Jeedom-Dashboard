import React from 'react';
import CardContainer from '../../containers/CardContainer/CardContainer';

import {
  CARD_HOUSE_LIGHT_ALL,
  CARD_HOUSE_MODE,
  CARD_LIVING_THERMOSTAT,
  CARD_LIVING_LIGHT_MODE,
  CARD_LIVING_CAMERA,
  CARD_ENTRY_DOOR,
  CARD_GARAGE_CAMERADOOR,
  CARD_EXTERIOR_WEATHER,
  CARD_BEDROOM_MAIN_THERMOSTAT,
  CARD_BEDROOM_AGATHE_THERMOSTAT } from '../../constants/cards';

function Home(props) {
  let cards = [];
  
  const presence = Object.keys(props.summary.presence).reduce((total, person) => (
    total + (props.summary.presence[person] === true ? 1 : 0)
  ), 0)

  if (presence > 0) {
    const home_card_living_thermostat = { ...CARD_LIVING_THERMOSTAT, title: 'Séjour'};
    const home_card_bedroom_agathe_thermostat = { ...CARD_BEDROOM_AGATHE_THERMOSTAT, title: 'Chambre Agathe'};
    const home_card_bedroom_main_thermostat = { ...CARD_BEDROOM_MAIN_THERMOSTAT, title: 'Chambre'};

    cards.push(CARD_LIVING_LIGHT_MODE);
    cards.push(home_card_living_thermostat);
    cards.push(home_card_bedroom_agathe_thermostat);
    cards.push(home_card_bedroom_main_thermostat);
    cards.push(CARD_EXTERIOR_WEATHER);
  }
  else {
    cards.push(CARD_LIVING_CAMERA);
    cards.push(CARD_GARAGE_CAMERADOOR);
    cards.push(CARD_HOUSE_LIGHT_ALL);
    cards.push(CARD_HOUSE_MODE);
    cards.push(CARD_ENTRY_DOOR);
    cards.push(CARD_EXTERIOR_WEATHER);
  }

  return (
    <div className="container">
      <div className="card-columns">
        <CardContainer cards={cards} collapse='3' />
      </div>
    </div>
  )
}

export default Home;
