import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Snackbar.scss';

export class Snackbar extends Component {
  render() {
    const cssClass = this.props.text ? ' snackbar-show' : ' snackbar-hide';

    return (
      <div className={'container snackbar-container ' + cssClass}>
        <div className="row">
          <div className="col-12 fixed-bottom">
            <div className="snackbar alert alert-success" role="alert">
              {this.props.text}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    text: state.snackbar.text,
  }
}

export default connect(mapStateToProps, null)(Snackbar);
