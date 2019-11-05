import React, { Component } from 'react';
import Card from '../Card/Card';

export class CardCamera extends Component {
  constructor() {
    super();
    this.state = {
      time: Date.now()
    };
  }

  componentDidMount() {
    //setInterval(() => this.setState({ time: Date.now() }), 10000);
  }

  render() {
    return (
      <Card
        title={this.props.title}
        imgTop={this.props.cameraImage + '&time=' + this.state.time}>
        <p className="card-text">Le garage est ouvert ou fermé depuis tant de temps !</p>
        <div className="text-right">
          <button className="btn btn-primary">Actioner</button>
        </div>
      </Card>
    )
  }
}

export default CardCamera;
