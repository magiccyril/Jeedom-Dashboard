export const CARD_TYPES = {
  thermostat: 'THERMOSTAT',
  mode: 'MODE',
  camera: 'CAMERA',
  weather: 'WEATHER',
  door: 'DOOR',
  cameraDoor: 'CAMERADOOR',
  lights: 'LIGHTS',
}

// House
export const CARD_HOUSE_MODE = {
  type: CARD_TYPES.mode,
  title: 'Maison',
  settings: {
    equipment_id: 80,
  }
};
export const CARD_HOUSE_LIGHT_ALL = {
  type: CARD_TYPES.lights,
  title: 'Lumières',
  settings: {
    equipment_id: 190,
    command_id: 1094,
  }
};

// Living
export const CARD_LIVING_THERMOSTAT = {
  type: CARD_TYPES.thermostat,
  title: 'Environnement',
  settings: {
    weather_equipment_id: 94,
    thermostat_equipment_id: 48 
  }
};
export const CARD_LIVING_LIGHT_MODE = {
  type: CARD_TYPES.mode,
  title: 'Lumière',
  settings: {
    equipment_id: 97,
  }
};
export const CARD_LIVING_CAMERA = {
  type: CARD_TYPES.camera,
  title: 'Séjour',
  settings: {
    equipment_id: 52,
  }
};

// Kitchen
export const CARD_KITCHEN_WEAHTER = {
  type: CARD_TYPES.weather,
  title: 'Environnement',
  settings: {
    equipment_id: 126,
  }
};
export const CARD_KITCHEN_LIGHT_MODE = {
  type: CARD_TYPES.mode,
  title: 'Lumière',
  settings: {
    equipment_id: 108,
  }
};

// Bedroom Helena & Cyril
export const CARD_BEDROOM_MAIN_THERMOSTAT = {
  type: CARD_TYPES.thermostat,
  title: 'Environnement',
  settings: {
    weather_equipment_id: 102,
    thermostat_equipment_id: 49 
  }
}

// Agathe's bedroom
export const CARD_BEDROOM_AGATHE_THERMOSTAT = {
  type: CARD_TYPES.thermostat,
  title: 'Environnement',
  settings: {
    weather_equipment_id: 103,
    thermostat_equipment_id: 53 
  }
}

// Entry
export const CARD_ENTRY_DOOR = {
  type: CARD_TYPES.door,
  title: 'Porte',
  settings: {
    command_id: 2147,
  }
};
export const CARD_ENTRY_LIGHT_MODE = {
  type: CARD_TYPES.mode,
  title: 'Lumière',
  settings: {
    equipment_id: 109,
  }
}

// Office
export const CARD_OFFICE_WEATHER = {
  type: CARD_TYPES.weather,
  title: 'Environnement',
  settings: {
    equipment_id: 120,
  }
};

// Bathroom
export const CARD_BATHROOM_WEATHER = {
  type: CARD_TYPES.weather,
  title: 'Environnement',
  settings: {
    equipment_id: 104,
  }
}

// Garage
export const CARD_GARAGE_CAMERADOOR = {
  type: CARD_TYPES.cameraDoor,
  title: 'Garage',
  settings: {
    equipment_id: 56,
    door_status_command: 2144,
    door_trigger_command: 880,
  }
}

// Exterior
export const CARD_EXTERIOR_WEATHER = {
  type: CARD_TYPES.weather,
  title: 'Extérieur',
  settings: {
    equipment_id: 95,
  }
}