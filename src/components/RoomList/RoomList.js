import React, { Component } from 'react';
import { connect } from "react-redux";
import { getRooms } from "../../redux/modules/room";
import Room from '../Room/Room';
import './RoomList.scss';

export class RoomList extends Component {
  componentDidMount() {
    this.props.getRooms();
  }

  render() {
    const error = this.props.error ?
      <div className="alert alert-danger" role="alert">
        Erreur lors de la récupération des pièces
        <button type="button" className="btn btn-link" onClick={this.props.getRooms}>Réessayer</button>
      </div>
      : '';
    const loading = this.props.loading ?
      <div className="alert alert-light" role="alert">Récupération des pièces...</div>
      : '';
    const empty = (this.props.rooms.length === 0 && !this.props.error && !this.props.loading) ?
      <div className="alert alert-info" role="alert">Aucune pièce de défini</div>
      : '';
    const list = (this.props.rooms.length > 0 && !this.props.error && !this.props.loading) ?
      <div className="row">
        {this.props.rooms.map(room => (
          <Room key={room.id} name={room.name} />
        ))}
      </div>
      : '';

    return (
      <div className="room-list-container">
        <div className="container">
          <div className="row room-list">
            <div className="col-12">
              <h3>Pièces</h3>
              {loading}
              {error}
              {empty}
              {list}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.room.loading,
    error: state.room.error,
    rooms: state.room.list
  };
}

export default connect(
  mapStateToProps,
  { getRooms }
)(RoomList);
