import React from 'react';
import Pill from '../Pill/Pill';
import imgSun from './sun.svg';
import imgRain from './rain.svg';
import imgLight from './light.svg';

function Summary(props) {
  const outsideImage = props.summary.outsideRain > 0 ? imgRain : imgSun;
  const light = props.summary.light ? <Pill image={imgLight} /> : '';

  return (
    <h5 className="house-summary">
      <Pill text={props.summary.homeTemperature + '°'} />
      <Pill image={outsideImage} text={props.summary.outsideTemperature + '°'} />
      {light}
    </h5>
  );
}

export default Summary;