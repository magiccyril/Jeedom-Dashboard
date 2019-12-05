import {
  CARD_LIVING_THERMOSTAT,
  CARD_LIVING_LIGHT_MODE,
  CARD_LIVING_CAMERA,
  CARD_KITCHEN_WEAHTER,
  CARD_KITCHEN_LIGHT_MODE,
  CARD_BEDROOM_MAIN_THERMOSTAT,
  CARD_BEDROOM_AGATHE_THERMOSTAT,
  CARD_ENTRY_DOOR,
  CARD_ENTRY_LIGHT_MODE,
  CARD_OFFICE_WEATHER,
  CARD_BATHROOM_WEATHER,
  CARD_GARAGE_CAMERADOOR,
  CARD_EXTERIOR_WEATHER, } from './cards';

const LIVING = {
  name: 'Séjour',
  cards: [
    CARD_LIVING_THERMOSTAT,
    CARD_LIVING_LIGHT_MODE,
    CARD_LIVING_CAMERA,
  ]
}

const KITCHEN = {
  name: 'Cuisine',
  cards: [
    CARD_KITCHEN_WEAHTER,
    CARD_KITCHEN_LIGHT_MODE,
  ]
}

const BEDROOM_MAIN = {
  name: 'Chambre',
  cards: [
    CARD_BEDROOM_MAIN_THERMOSTAT,
  ]
}

const BEDROOM_AGATHE = {
  name: 'Chambre Agathe',
  cards: [
    CARD_BEDROOM_AGATHE_THERMOSTAT,
  ]
}

const ENTRY = {
  name: 'Entrée',
  cards: [
    CARD_ENTRY_DOOR,
    CARD_ENTRY_LIGHT_MODE,
  ]
}

const OFFICE = {
  name: 'Bureau',
  cards: [
    CARD_OFFICE_WEATHER,
  ]
}

const BATHROOM = {
  name: 'Salle de bain',
  cards: [
    CARD_BATHROOM_WEATHER,
  ]
}

const GARAGE = {
  name: 'Garage',
  cards: [
    CARD_GARAGE_CAMERADOOR,
  ]
}

export const ROOMS = [
  LIVING,
  KITCHEN,
  BEDROOM_MAIN,
  BEDROOM_AGATHE,
  ENTRY,
  GARAGE,
  BATHROOM,
  OFFICE,
]