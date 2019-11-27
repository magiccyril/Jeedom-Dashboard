import React from 'react';
import './Pill.scss';

function Pill(props) {
  let pillImage = '';

  if (props.image) {
    const pillImgStyle = {
      backgroundImage: 'url(' + props.image + ')'
    };

    let imgClassName = ['pill-img'];
    imgClassName.push(props.text !== undefined ?
      'pill-img-with-text' : 'pill-img-no-text'
    );

   pillImage = <span className={imgClassName.join(' ')} style={pillImgStyle}>&nbsp;</span>;
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
