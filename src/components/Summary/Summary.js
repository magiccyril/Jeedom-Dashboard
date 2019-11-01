import React, { Component } from 'react';
import { connect } from "react-redux";
import { setSummaryIntervalRegistration } from "../../redux/modules/summary";
import Pill from '../Pill/Pill';
import imgSun from './sun.svg';
import imgRain from './rain.svg';

export class Summary extends Component {
  componentDidMount() {
    this.props.setSummaryIntervalRegistration();
  }

  render() {
    const outsideImage = this.props.summary.outsideRain > 0 ? imgRain : imgSun;

    return (
      <h5 className="house-summary">
        <Pill text={this.props.summary.homeTemperature + '°'} />
        <Pill image={outsideImage} text={this.props.summary.outsideTemperature + '°'} />
        <Pill text="72 lx" />
      </h5>
    );
  }
}

function mapStateToProps(state) {
  return {
    summary: state.summary
  };
}

export default connect(
  mapStateToProps,
  { setSummaryIntervalRegistration }
)(Summary);