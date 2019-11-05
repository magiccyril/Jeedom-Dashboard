import React from 'react';
import './Card.scss';

function Card(props) {
  const cssClass = ['card'];
  if (props.error) {
    cssClass.push('border-danger');
  }

  const style = {
    backgroundImage: 'url(' + props.backgroundUrl + ')',
    backgroundSize: 'cover',
  };

  const imgTop = props.imgTop ?
    <img className='card-img-top' src={props.imgTop} alt='' />
    : '';
  const imgBottom = props.imgBottom ?
    <img className='card-img-top' src={props.imgBottom} alt='' />
    : '';
  
  const overlay = props.overlay ? 
    <div className="card-img-overlay"><p className="card-text text-center">{props.overlay}</p></div>
    : '';

  const hasChildren = props.children ? 'has-children' : 'no-child';

  return (
    <div className={cssClass.join(' ')} style={style}>
      {imgTop}
      {overlay}
      <div className="card-body">
        <h5 className={'card-title ' + hasChildren}>{props.title}</h5>
        {props.children}
      </div>
      {imgBottom}
    </div>
  );
}

export default Card;
