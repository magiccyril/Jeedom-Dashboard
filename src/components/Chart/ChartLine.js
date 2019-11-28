import React from 'react';
import { Line } from 'react-chartjs-2';

function ChartLine(props) {
  if (!props.data) {
    return '';
  }

  const labels = props.data.map(elem => (elem.datetime.toJSDate()));
  const values = props.data.map(elem => (elem.value));

  const data = {
    labels: labels,
    datasets: [
      {
        label: props.label,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        data: values,
      }
    ]
  };

  const options = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        }
      }]
    },
    elements: {
      point:{
        radius: 0
      }
    },
    legend: {
      display: false,
    }
  };

  return <Line data={data} options={options} />
}

export default ChartLine;
