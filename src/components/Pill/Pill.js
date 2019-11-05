import React from 'react';
import './Pill.scss';

function Pill(props) {
  const pillImageUrl = props.image;
  let pillImage = '';
  if (pillImageUrl) {
    const pillImgStyle = {
      backgroundImage: 'url(' + pillImageUrl + ')'
    };
    let pillClassName = ['pill-img'];
    if (props.text) {
      pillClassName.push('pill-img-with-text');
    }
    else {
      pillClassName.push('pill-img-no-text');
    }

    pillImage = <span className={pillClassName.join(' ')} style={pillImgStyle}>&nbsp;</span>;
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
