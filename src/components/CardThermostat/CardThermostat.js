import React from 'react';
import Card from '../Card/Card';

function CardThermostat(props) {
  if (!props.thermostat) {
    return '';
  }

  const overlay = props.thermostat.loading ? 'Chargement...' : '';

  const thermostatId = props.thermostat.id;

  let thermostat = '';
  if (props.thermostat.modes) {
    const modesCount = Object.entries(props.thermostat.modes).length;

    let datalistOptions = [];
    const optionSize = Math.floor(12 / modesCount);
    props.thermostat.modes.forEach((mode) => {
      datalistOptions.push(<option className={'col-' + optionSize} value={mode.id} label={mode.name} key={mode.id} />);
    })

    const currentModeIndex = Object.getOwnPropertyNames(props.thermostat.modes).indexOf(props.thermostat.currentMode);
    
    const thermostatPower = props.thermostat.power > 0 ? <small>({props.thermostat.power} %)</small> : ''

    const handleOnChange = (e) => {
      e.preventDefault();
      const step = e.target.value;
      const modeId = Object.keys(props.thermostat.modes)[step];
      
      props.onModeChange({
        id: thermostatId,
        mode: modeId,
      });
    }
    
    thermostat = <div>
      <hr />
      <div className="form-group text-center">
        <label htmlFor={'thermostat-'+ thermostatId}>Thermostat {thermostatPower}</label>
        <datalist id={'thermostat-marks-'+ thermostatId} className="row text-center">
          {datalistOptions}
        </datalist>
        <input
          type="range"
          className="custom-range"
          id={'thermostat-'+ thermostatId}
          min="0"
          max={modesCount - 1}
          step="1"
          defaultValue={currentModeIndex}
          list={'thermostat-marks-'+ thermostatId}
          onChange={handleOnChange} />
      </div>
    </div>
  }

  return (
    <Card title={props.title} overlay={overlay}>
      <div className="row align-items-center">
        <div className="col-5 order-12 text-center">
          <h2>{props.thermostat.temperature}°</h2>
          <small>Historique</small>
        </div>
        <ul className="col-7 order-1 list-unstyled">
          <li>Humidité : 23%</li>
          <li>CO2: 443ppm</li>
          <li>Bruit: 38dB</li>
        </ul>
      </div>
      {thermostat}
    </Card>
  );
}

export default CardThermostat;
