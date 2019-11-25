export const randomNumber = (max, precision = 1) => ( Number.parseFloat(Math.random() * Math.floor(max)).toPrecision(precision) );

export const generateFakeStateThermostat = (id) => ({
  id: id,
  loading: false,
  error: false,
});
export const generateFakeThermostat = (id) => {
  const firstMode = randomNumber(999);
  const secondMode = randomNumber(999);
  return ({
    id: id,
    name: 'Fake thermostat',
    modes: {
      [firstMode]: 'First mode',
      [secondMode]: 'Another mode',
    },
    currentMode: firstMode,
    power: randomNumber(100),
    temperature: randomNumber(30, 2),
    setpoint: randomNumber(30, 2),
  })
};

export const generateMode = (id) => {
  const modes = [
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
    'Mode ' + randomNumber(99),
  ]
    .map((name, i) => ({
      id: randomNumber(9999),
      name: name,
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
    'id': mode.id,
    'logicalId': mode.logicalId ? mode.logicalId : mode.name,
    'generic_type': mode.generic_type,
    'eqType': 'mode',
    'name': mode.name,
    'order': mode.order,
    'type': 'action',
    'subType': 'other',
    'eqLogic_id': mode.id,
    'isHistorized': '0',
    'value': '',
    'isVisible': mode.isVisible,
    'currentValue': mode.currentValue ? mode.currentValue : null,
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
    "cmds": cmds,
  }
};