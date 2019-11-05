import React from 'react';
import './Snackbar.scss';

function Snackbar(props) {
  const cssClass = props.text ? ' snackbar-show' : ' snackbar-hide';

  return (
    <div className={'container snackbar-container ' + cssClass}>
      <div className="row">
        <div className="col-12 fixed-bottom">
          <div className={'snackbar alert alert-' + props.type} role="alert">
            {props.text}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Snackbar;
