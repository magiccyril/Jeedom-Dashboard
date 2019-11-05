import React from 'react';
import Room from '../Room/Room';
import './RoomList.scss';

function RoomList(props) {
  const error = props.error ?
    <div className="alert alert-danger" role="alert">
      Erreur lors de la récupération des pièces
      <button type="button" className="btn btn-link" onClick={props.getRooms}>Réessayer</button>
    </div>
    : '';
  const loading = props.loading ?
    <div className="alert alert-light" role="alert">Récupération des pièces...</div>
    : '';
  const empty = (props.rooms.length === 0 && !props.error && !props.loading) ?
    <div className="alert alert-info" role="alert">Aucune pièce de défini</div>
    : '';
  const list = (props.rooms.length > 0 && !props.error && !props.loading) ?
    <div className="row">
      {props.rooms.map(room => (
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

export default RoomList;
