import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import ChartLine from '../Chart/ChartLine';

const HISTORY_LENGTH = 365;

function BackdropWeatherHistory(props) {
  if (!props.show) {
    return '';
  }

  let content = '';
  if (props.history.loading) {
    content = <p>Chargement...</p>;
  }
  else {
    content = <div className="backdrop-weather-row">
      <div className="chart-line col-12">
        <ChartLine
          label={props.title}
          data={props.history.data.slice(0, HISTORY_LENGTH)} />
      </div>
    </div>;
  }

  return (
    <Backdrop title={props.title} onClose={props.onClose}>
      {content}
    </Backdrop>
  );
}

export default BackdropWeatherHistory;
