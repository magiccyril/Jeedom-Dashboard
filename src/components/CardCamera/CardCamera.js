import React, { Component } from 'react';
import Card from '../Card/Card';

const REFRESH_DELAY = 5 * 1000;

export class CardCamera extends Component {
  constructor() {
    super();
    this.state = {
      time: Date.now()
    };
    this.interval = undefined;
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), REFRESH_DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
