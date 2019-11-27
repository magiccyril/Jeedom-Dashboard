import React, { Component } from 'react';
import CardWeather from '../CardWeather/CardWeather';
import Card from '../Card/Card';
import './CardThermostat.scss';

export class CardThermostat extends Component {
  constructor() {
    super();

    this.state = {
      showPower: true,
      showButtons: false,
      modeIndex: 0,
    };
    
    this.handleChangeCancel = this.handleChangeCancel.bind(this);
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  defaultModeIndex() {
    let modeIndex = 0;
    if (this.props.thermostat && this.props.thermostat.modes) {
      modeIndex = this.props.thermostat.modes.indexOf(this.props.thermostat.currentMode);
    }

    return modeIndex;
  }

  handleChangeMode(e) {
    const mode = this.props.thermostat.modes[this.state.modeIndex];
    this.props.onModeChange({
      id: this.props.thermostat.id,
      cmd: mode.id,
    });
  }

  handleChangeCancel(e) {
    this.setState({
      modeIndex: this.defaultModeIndex(),
      showPower: true,
      showButtons: false,
    })
  }

  handleOnChange(e) {
    e.preventDefault();

    const step = e.target.value;
    this.setState({modeIndex: step});

    if (this.props.thermostat.modes[step].id === this.props.thermostat.currentMode.id) {
      this.setState({
        showPower: true,
        showButtons: false,
      });
    }
    else {
      this.setState({
        showPower: false,
        showButtons: true,
      });
    }
  }

  render() {
    if (!this.props.thermostat) {
      return '';
    }

    if (this.props.thermostat.loading || this.props.thermostat.modes === undefined) {
      return <CardWeather
          title={this.props.title}
          weather={this.props.weather}>
          <div>
            <hr />
            <p>Chargement...</p>
          </div>
        </CardWeather>
    }

    if (this.props.thermostat.error) {
      return <Card title={this.props.title}>Erreur à gérer</Card>
    }

    const thermostatId = this.props.thermostat.id;

    const modes = this.props.thermostat.modes;

    const modeIndex = this.defaultModeIndex();

    let datalistOptions = [];
    const optionSize = Math.floor(12 / modes.length);
    modes.forEach((mode, i) => {
      let className = 'col-' + optionSize;
      className += modeIndex === i ? ' text-primary' : '';
      datalistOptions.push(<option className={className} value={mode.id} label={mode.name} key={mode.id} />);
    })
      
    const power = this.props.thermostat.power > 0 ?
      <small>Chauffe actuellement à {this.props.thermostat.power} %</small> : 
      <small>Ne chauffe pas actuellement</small>

    const changeButtons = <div>
      <button className="btn btn-sm btn-primary" onClick={this.handleChangeMode}>Valider</button>
      <button className="btn btn-sm" onClick={this.handleChangeCancel}>Annuler</button>
    </div>;

    return (
      <CardWeather
        title={this.props.title}
        weather={this.props.weather}>
        <div>
          <hr />
          <div className="form-group text-center thermostat-form-group">
          <label htmlFor={'thermostat-'+ thermostatId}>Thermostat</label>
          <datalist id={'thermostat-marks-'+ thermostatId} className="row text-center">
            {datalistOptions}
          </datalist>
          <input
            type="range"
            className="custom-range"
            id={'thermostat-'+ thermostatId}
            min="0"
            max={modes.length - 1}
            step="1"
            defaultValue={modeIndex}
            list={'thermostat-marks-'+ thermostatId}
            onChange={this.handleOnChange} />
        
            <div className="form-text">
              {this.state.showPower ? power : ''}
              {this.state.showButtons ? changeButtons : ''}
            </div>
          </div>
        </div>
      </CardWeather>
    );
  }
}

export default CardThermostat;
