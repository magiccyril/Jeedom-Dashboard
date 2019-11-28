import { getStorageSettings } from './storage';

const JEE_API = 'core/api/jeeApi.php';

function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(100));
}

export function getJeedomVersion(payload) {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      'jsonrpc': '2.0',
      'id': getRandomInt(),
      'method': 'version',
      'params': {
        'apikey': payload.apikey,
      }
    })
  };

  return fetch(payload.url + JEE_API, options)
    .then(response => response.json())
}

export function getJeedomEquipment(equipmentId) {
  return getStorageSettings()
    .then((settings) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          'jsonrpc': '2.0',
          'id': getRandomInt(),
          'method': 'eqLogic::fullById',
          'params': {
            'apikey': settings.apikey,
            'id': equipmentId,
          }
        })};
      const url = settings.url + JEE_API;
      return fetch(url, options)
    })
    .then(response => response.json())
    .then(response => response.result) 
}

export function getJeedomRooms() {
  return getStorageSettings()
    .then((settings) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          'jsonrpc': '2.0',
          'id': getRandomInt(),
          'method': 'object::all',
          'params': {
            'apikey': settings.apikey
          }
        })};
      const url = settings.url + JEE_API;
      return fetch(url, options)
    })
    .then(response => response.json())
    .then(response => response.result)
}

export function execJeedomCmd(id, options = {}) {
  return getStorageSettings()
    .then((settings) => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          'jsonrpc': '2.0',
          'id': getRandomInt(),
          'method': 'cmd::execCmd',
          'params': {
            'apikey': settings.apikey,
            'id': id,
            'options': options,
          }
        })};
      const url = settings.url + JEE_API;
      return fetch(url, requestOptions)
    })
    .then(response => response.json())
    .then(response => response.result)  
}

export function getJeedomCommand(id) {
  return getStorageSettings()
    .then((settings) => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          'jsonrpc': '2.0',
          'id': getRandomInt(),
          'method': 'cmd::byId',
          'params': {
            'apikey': settings.apikey,
            'id': id,
          }
        })};
      const url = settings.url + JEE_API;
      return fetch(url, requestOptions)
    })
    .then(response => response.json())
    .then(response => response.result)  
}

export function getJeedomCommandHistory(payload) {
  return getStorageSettings()
    .then((settings) => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          'jsonrpc': '2.0',
          'id': getRandomInt(),
          'method': 'cmd::getHistory',
          'params': {
            'apikey': settings.apikey,
            'id': payload.cmd,
            'startTime': payload.startTime,
          }
        })};
      const url = settings.url + JEE_API;
      return fetch(url, requestOptions)
    })
    .then(response => response.json())
    .then(response => response.result)  
}