import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveSettingsForm } from '../../redux/modules/settingsForm';
import { getStorageSettings } from '../../redux/utils/storage';

export class SettingsForm extends Component {
  constructor() {
    super();

    this.state = {url: '', apikey: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    getStorageSettings().then((settings) => {
      this.setState({
        url: settings.url,
        apikey: settings.apikey,
      })
    });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.saveSettingsForm({
      url: this.state.url,
      apikey: this.state.apikey,
      onSuccess: this.props.onSuccess,
    });
  }

  render() {
    const errorCheck = this.props.checkFailed ?
      <div className="alert alert-danger" role="alert">URL ou Clef d'API invalide !</div>
      : '';
    const errorSave = this.props.saveFailed ?
      <div className="alert alert-danger" role="alert">Erreur lors de la sauvegarde !</div>
      : '';
    
    const button = this.props.saveRequested ?
      <button type="button" className="btn btn-secondary btn-lg btn-block" disabled>Enregistrement</button>
      : <button type="submit" className="btn btn-primary btn-lg btn-block">Sauvegarder</button>

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Jeedom URL</label>
          <input type="text" className="form-control" id="url" value={this.state.url} onChange={this.handleChange} />
          <small className="form-text text-muted">URL publique d'accès à Jeedom.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="apikey">Clef d'API Jeedom</label>
          <input type="text" className="form-control" id="apikey" value={this.state.apikey} onChange={this.handleChange} />
          <small className="form-text text-muted">Configuration > API > Clef API</small>
        </div>

        {errorCheck}
        {errorSave}

        {button}
      </form>
    );
  }
}

function mapStateToProps(state) {
  const { settingsForm } = state;

  return settingsForm;
}

export default connect(
  mapStateToProps,
  { saveSettingsForm },
)(SettingsForm);
