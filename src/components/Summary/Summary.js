import React from 'react';
import Pill from '../Pill/Pill';
import imgSun from './sun.svg';
import imgRain from './rain.svg';
import imgLight from './light.svg';
import imgUser from './user.svg';

function Summary(props) {
  const outsideImage = props.summary.outsideRain > 0 ? imgRain : imgSun;
  const light = props.summary.light ? <Pill image={imgLight} /> : '';
  
  const presence = Object.keys(props.summary.presence).reduce((total, person) => (
    total + (props.summary.presence[person] === true ? 1 : 0)
  ), 0)

  return (
    <h5 className="house-summary">
      <Pill image={imgUser} text={presence} />
      <Pill text={props.summary.homeTemperature + '°'} />
      <Pill image={outsideImage} text={props.summary.outsideTemperature + '°'} />
      {light}
    </h5>
  );
}

export default Summary;