import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import CardContainer from '../../containers/CardContainer/CardContainer';

export function BackdropRoom(props) {
  return (
    <Backdrop title={props.room.name} onClose={props.onClose}>
      <CardContainer cards={props.room.cards} />
    </Backdrop>
  );
}

export default BackdropRoom;
