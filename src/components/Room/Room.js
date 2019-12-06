import React, { useState } from 'react';
import BackdropRoom from '../BackdropRoom/BackdropRoom';
import './Room.scss';

export function Room(props) {
  const [backdropShown, setShowBackdrop] = useState(false);
  const hideBackdrop = () => setShowBackdrop(false);
  const showBackdrop = () => setShowBackdrop(true);

  const backdrop = backdropShown ? <BackdropRoom room={props.room} onClose={hideBackdrop} /> : '';

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card room" onClick={showBackdrop}>
        {props.room.name}
      </div>
      {backdrop}
    </div>
  )
}

export default Room;
