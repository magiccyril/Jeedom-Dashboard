import React, { useState, useEffect } from 'react';
import './Backdrop.scss';

function Backdrop(props) {
  const [visibility, setVisibilty] = useState(false);
  const hide = (e) => {
    e.preventDefault();
    setVisibilty(false);
    if (props.onClose) {
      setTimeout(() => props.onClose(), 350);
    }
  };
  const show = () => setVisibilty(true) 

  useEffect(show);

  const cssClass = visibility ? ' backdrop-show' : ' backdrop-hide';

  return (
    <div className={'backdrop settings-backdrop ' + cssClass}>
      <div className="backdrop-background" onClick={hide}></div>
      <div className="backdrop-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-9 backdrop-content">
              <h3>{props.title}</h3>
              <a href="#App" className="backdrop-close text-hide" onClick={hide}>Fermer</a>
              <hr/>
              <div className="backdrop-content-scroll">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Backdrop;
