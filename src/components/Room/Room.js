import React, { Component } from 'react';
import BackdropRoom from '../BackdropRoom/BackdropRoom';
import './Room.scss';

export class Room extends Component {
  constructor() {
    super();

    this.state = {
      showBackdrop: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick() {
    this.setState({showBackdrop: true});
  }

  handleClose() {
    this.setState({showBackdrop: false});
  }

  render() {
    const backdrop = this.state.showBackdrop ? <BackdropRoom room={this.props.room} onClose={this.handleClose} /> : '';

    return (
      <div className="col-6 col-md-4 col-lg-3">
        <div className="card room" onClick={this.handleClick}>
          {this.props.room.name}
        </div>
        {backdrop}
      </div>
    )
  };
}

export default Room;
