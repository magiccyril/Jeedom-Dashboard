import React, { Component } from 'react';
import './Backdrop.scss';

export class Backdrop extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({show: true})
    }, 1);
  }

  handleClose(event) {
    event.preventDefault();
    this.setState({show: false});
    if (this.props.onClose) {
      setTimeout(() => {
        this.props.onClose();
      }, 350);
    }
  }

  render() {
    const cssClass = this.state.show ? ' backdrop-show' : ' backdrop-hide';

    return (
      <div className={'backdrop settings-backdrop ' + cssClass}>
        <div className="backdrop-background" onClick={this.handleClose}></div>
        <div className="backdrop-wrapper">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-9 backdrop-content">
                <h3>{this.props.title}</h3>
                <a href="#App" className="backdrop-close text-hide" onClick={this.handleClose}>Fermer</a>
                <hr/>
                <div className="backdrop-content-scroll">
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Backdrop;
