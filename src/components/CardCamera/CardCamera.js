import React, { Component } from 'react';
import { connect } from "react-redux";
import { getCameraImage } from "../../redux/modules/camera";
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
    this.props.getCameraImage(this.props.cameraId);
  }

  render() {
    return (
      <Card
        title={this.props.title}
        backgroundUrl={this.props.image + '&time=' + this.state.time} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    image: state.camera[ownProps.cameraId]
  };
}

export default connect(
  mapStateToProps,
  { getCameraImage }
)(CardCamera);
