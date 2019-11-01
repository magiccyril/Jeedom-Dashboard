import React from 'react';
import './Card.scss';

function Card(props) {
  const style = {
    backgroundImage: 'url(' + props.backgroundUrl + ')',
    backgroundSize: 'cover',
  };

  return (
    <div className="col-12 col-lg-6">
      <div className="card" style={style}>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <div className="text-right">
            <button className="btn btn-primary">Go somewhere</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
