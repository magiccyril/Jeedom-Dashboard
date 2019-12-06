import { DateTime } from 'luxon';

export const randomNumber = (max, precision = 1) => ( Number.parseFloat(Math.random() * Math.floor(max)).toPrecision(precision) );

// Thermostat
export const generateThermostat = (id) => {
  const modes = [
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
  ]
    .map((name, i) => ({
      id: randomNumber(9999),
      name: name,
      order: i + 1,
    }));

  return {
    id: id,
    name: 'Thermostat ' + id,
    modes: modes,
    currentMode: modes[0],
    power: randomNumber(100),
    temperature: randomNumber(30, 2),
    setpoint: randomNumber(30, 2),
    loading: false,
    error: false,
  }
};
const generateThermostatApiCmd = (mode) => ({
  id: mode.id ? mode.id : randomNumber(9999),
  logicalId: mode.logicalId ? mode.logicalId : mode.name,
  generic_type: mode.generic_type,
  name: mode.name,
  type: mode.type ? mode.type : 'action',
  value: mode.value ? mode.value : null,
  isVisible: mode.isVisible ? mode.isVisible : '1',
  currentValue: mode.currentValue ? mode.currentValue : null,
  order: mode.order ? mode.order : randomNumber(99),
})
export const generateThermostatApiResult = (thermostat) => {
  let cmds = thermostat.modes
    .map((mode) => ({
      ...mode,
      logicalId: 'modeAction',
      generic_type: 'THERMOSTAT_SET_MODE',
      isVisible: '1'
    }))
    .map(generateThermostatApiCmd);
  
  cmds.push({
    logicalId: 'off',
    generic_type: 'THERMOSTAT_SET_MODE',
    name: 'Off',
    value: '',
    isVisible: '0',
  });

  cmds.push({
    logicalId: 'actif',
    generic_type: 'THERMOSTAT_STATE',
    name: 'Off',
    type: 'info',
    isVisible: '0',
    currentValue: 0,
  });

  cmds.push({
    logicalId: 'temperature',
    generic_type: 'THERMOSTAT_TEMPERATURE',
    name: 'Température',
    type: 'info',
    value: '#'+ randomNumber(9999) +'#',
    isVisible: '0',
    currentValue: thermostat.temperature,
  })

  cmds.push({
    logicalId: 'temperature',
    generic_type: 'THERMOSTAT_TEMPERATURE_OUTDOOR',
    name: 'Température extérieure',
    type: 'info',
    value: '#'+ randomNumber(9999) +'#',
    isVisible: '0',
    currentValue: randomNumber(15, 2),
  })

  cmds.push({
    logicalId: 'thermostat',
    generic_type: 'THERMOSTAT_SET_SETPOINT',
    name: 'Thermostat',
    value: randomNumber(999),
    isVisible: '0',
  })

  cmds.push({
    logicalId: 'order',
    generic_type: 'THERMOSTAT_SETPOINT',
    name: 'Consigne',
    type: 'info',
    value: '',
    currentValue: thermostat.setpoint,
  })

  cmds.push({
    logicalId: 'mode',
    generic_type: 'THERMOSTAT_MODE',
    name: 'Mode',
    type: 'info',
    value: '',
    currentValue: thermostat.modes[0].name,
  })

  cmds.push({
    logicalId: 'power',
    generic_type: null,
    name: 'Puissance',
    type: 'info',
    currentValue: thermostat.power
  });

  return {
    id: thermostat.id,
    name: thermostat.name,
    generic_type: null,
    eqType_name: 'thermostat',
    isVisible: '1',
    isEnable: '1',
    cmds
  }
}

// Mode
export const generateMode = (id) => {
  const modes = [
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
  ]
    .map((name, i) => ({
      id: randomNumber(9999),
      name,
      order: i,
    }))
  
  return {
    id: id,
    loading: false,
    error: false,
    modes,
  }
}
const generateModeApiCmd = (mode) => ({
    id: mode.id,
    logicalId: mode.logicalId ? mode.logicalId : mode.name,
    generic_type: mode.generic_type,
    eqType: 'mode',
    name: mode.name,
    order: mode.order,
    type: 'action',
    subType: 'other',
    eqLogic_id: mode.id,
    isHistorized: '0',
    value: '',
    isVisible: mode.isVisible,
    currentValue: mode.currentValue ? mode.currentValue : null,
})
export const generateModeApiResult = (modeState) => {
  let cmds = modeState.modes
    .map((mode) => ({
      ...mode,
      name: mode.name,
      generic_type: 'MODE_SET_STATE',
      isVisible: '1'
    }))
    .map(generateModeApiCmd);
  
  cmds.push(generateModeApiCmd({
    id: randomNumber(9999),
    logicalId: 'notVisibleMode',
    generic_type: 'MODE_SET_STATE',
    name: 'notVisibleMode',
    order: randomNumber(99),
    isVisible: '0',
  }))

  cmds.push(generateModeApiCmd({
    id: randomNumber(9999),
    logicalId: 'currentMode',
    generic_type: 'MODE_STATE',
    name: 'Mode',
    currentValue: modeState.modes[0].name,
    order: randomNumber(99),
    isVisible: '1',
  }))

  return {
    "id": modeState.id,
    "name": "Fake mode",
    "logicalId": "",
    "generic_type": null,
    "object_id": "1",
    "eqType_name": "mode",
    "eqReal_id": null,
    "isVisible": "1",
    "isEnable": "1",    
    "order": "1",
    "comment": "",
    "tags": null,
    cmds,
  }
};

// Weather
export const generateWeather = (id, withRainAndWind = false) => {
  let weather = {
    temperature: {
      id: randomNumber(9999),
      value: randomNumber(25, 2),
      unit: '°C',
      isHistorized: true,
    },
    humidity: {
      id: randomNumber(9999),
      value: randomNumber(80, 2),
      unit: '%',
      isHistorized: true,
    },
    co2: {
      id: randomNumber(9999),
      value: randomNumber(600),
      unit: 'ppm',
      isHistorized: true,
    },
    brightness: {
      id: randomNumber(9999),
      value: randomNumber(600),
      unit: 'lm',
      isHistorized: true,
    },
    noise: {
      id: randomNumber(9999),
      value: randomNumber(60),
      unit: 'dB',
      isHistorized: true,
    },
    presure: {
      id: randomNumber(9999),
      value: 1000 + randomNumber(50, 2),
      unit: 'Pa',
      isHistorized: true,
    },
  };

  if (withRainAndWind) {
    weather = {
      ...weather,
      rainCurrent: {
        id: randomNumber(9999),
        value: randomNumber(2, 3),
        unit: 'mm/h',
        isHistorized: false,
      },
      rainTotal: {
        id: randomNumber(9999),
        value: randomNumber(9, 2),
        unit: 'mm',
        isHistorized: true,
      },
      windSpeed: {
        id: randomNumber(9999),
        value: randomNumber(50),
        unit: 'km/h',
        isHistorized: true,
      },
      windDirection: {
        id: randomNumber(9999),
        value: randomNumber(360),
        unit: '°',
        isHistorized: true,
      },
    }
  }

  Object.keys(weather).forEach((item) => (
    weather[item].history = {
      loading: false,
      error: false,
      show: false,
      data: [],
    }
  ))

  return {
    id: id,
    loading: false,
    error: false,
    weather,
  }
}
const generateWeatherApiCmd = (item) => ({
    id: item.id,
    generic_type: item.generic_type,
    name: item.name ? item.name : 'Item ' + item.id,
    order: item.order,
    eqLogic_id: item.weatherId,
    isHistorized: item.isHistorized ? '1' : '0',
    unite: item.unit ? item.unit : '',
    value: item.value ? item.value : '#'+ randomNumber(9999) +'#',
    isVisible: item.isVisible,
    currentValue: item.value,
})
const mapWeatherKeyToGenericType = (key) => {
  switch (key) {
    case 'temperature': return 'TEMPERATURE';
    case 'humidity': return 'HUMIDITY';
    case 'co2': return 'CO2';
    case 'brightness': return 'BRIGHTNESS';
    case 'noise': return 'NOISE';
    case 'presure': return 'PRESSURE';
    case 'rainCurrent': return 'RAIN_CURRENT';
    case 'rainTotal': return 'RAIN_TOTAL';
    case 'windSpeed': return 'WIND_SPEED';
    case 'windDirection': return 'WIND_DIRECTION';
    default: return key;
  }
}
export const generateWeatherApiResult = (weatherState) => {
  let cmds = [];
  Object.keys(weatherState.weather).forEach((key, i) => {
    cmds.push(generateWeatherApiCmd({
      ...weatherState.weather[key],
      generic_type: mapWeatherKeyToGenericType(key),
      weatherId: weatherState.id,
      order: i,
      isVisible: '1',
    }));
  })
  
  cmds.push(generateWeatherApiCmd({
    id: randomNumber(9999),
    generic_type: null,
    name: 'Rafraichir',
    order: randomNumber(99),
    eqLogic_id: weatherState.id,
    isHistorized: '0',
    value: null,
    isVisible: '1',
    currentValue: null,
  }));

  cmds.push(generateWeatherApiCmd({
    id: randomNumber(9999),
    generic_type: 'UNSUPPORTED_TYPE',
    name: 'Rafale',
    order: randomNumber(99),
    eqLogic_id: weatherState.id,
    isHistorized: '1',
    isVisible: '1',
    currentValue: randomNumber(50),
  }));

  return {
    "id": weatherState.id,
    "name": "Fake weather",
    "generic_type": null,
    "isEnable": "1",
    cmds,
  }
};
export const generateWeatherHistory = () => {
  const now = DateTime.local();
  let results = [];
  for (let i = 0; i < 1000; i++) {
    results.push({
      value: randomNumber(50, 2),
      datetime: now.minus({hours: i}).set({millisecond: 0})
    })
  }

  return results;
}
export const generateWeatherHistoryApiResult = (cmdId, historyState) => (historyState.map(item => ({
  ...item,
  datetime: item.datetime.toFormat('yyyy-LL-dd HH:mm:ss'),
  cmd_id: cmdId,
})))


// Lights
const generateLight = (i) => ({
  id: randomNumber(9999),
  name: 'A random light ' + i,
  order: i,
  value: randomNumber(1).toString(),
  label: 'Random label ' + i,
  singularComplement: 'du'
})
export const generateLights = () => {
  let lights = [];
  for (let i = 0; i < randomNumber(10); i++) {
    lights.push(generateLight(i));
  }
  return lights;
}
export const generateLightsApiResult = (id, lights) => {
  let cmds = [];
  lights.forEach(light => {
    cmds.push({
      id: light.id,
      logicalId: '',
      generic_type: 'LIGHT_STATE',
      name: light.name,
      order: light.order,
      type: 'info',
      display: {
        parameters: {
          label: light.label,
          singularComplement: light.singularComplement,
        }
      },
      value: '#'+ randomNumber(9999) +'#',
      isVisible: '1',
      currentValue: light.value,
    });
  });

  cmds.push({
    id: randomNumber(9999),
    logicalId: '',
    generic_type: 'LIGHT_STATE',
    name: 'Light invisible',
    order: '11',
    type: 'info',
    display: {
      parameters: {
        label: 'Label of invisible light',
        singularComplement: 'of',
      }
    },
    value: '#'+ randomNumber(9999) +'#',
    isVisible: randomNumber(1).toString(),
    currentValue: randomNumber(1).toString(),
  })

  cmds.push({
    id: randomNumber(9999),
    logicalId: 'refresh',
    generic_type: '',
    name: 'Rafraichir',
    order: '12',
    type: 'action',
    value: '',
    isVisible: '0',
    currentValue: null,
  })
  
  return {
    id,
    name: 'Fake lights',
    generic_type: null,
    isEnable: '1',
    cmds,
  }
}