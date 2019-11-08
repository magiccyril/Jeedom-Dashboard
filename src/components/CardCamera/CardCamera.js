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
        imgTop={this.props.cameraImage + '&time=' + this.state.time}
        overlay={this.props.overlay}>
        {this.props.children}
      </Card>
    )
  }
}

export default CardCamera;
