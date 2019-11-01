import React from 'react';
import './Room.scss';

function Room(props) {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card room">
        {props.name}
      </div>
    </div>
  );
}

export default Room;
