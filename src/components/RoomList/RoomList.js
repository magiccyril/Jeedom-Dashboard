import React from 'react';
import Room from '../Room/Room';
import { ROOMS } from '../../constants/rooms';
import './RoomList.scss';

function RoomList() {
  let roomList = [];
  ROOMS.forEach((room, i) => roomList.push(<Room key={i} room={room} />))
  
  return (
    <div className="room-list-container">
      <div className="container">
        <div className="row room-list">
          <div className="col-12">
            <h3 className="container-title">Pièces</h3>
            <div className="row">
              {roomList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomList;
