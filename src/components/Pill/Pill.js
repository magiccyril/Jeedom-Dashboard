import React from 'react';
import './Pill.scss';

function Pill(props) {
  const pillImageUrl = props.image;
  let pillImage = '';
  if (pillImageUrl) {
    const pillImgStyle = {
      backgroundImage: 'url(' + pillImageUrl + ')'
    };
    pillImage = <span className="pill-img" style={pillImgStyle}>&nbsp;</span>;
  }
  
  return (
    <span>
      <span className="pill">
        {pillImage}
        {props.text}
      </span>&nbsp;
    </span>
  );
}

export default Pill;
