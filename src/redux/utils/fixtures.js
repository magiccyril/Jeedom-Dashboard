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