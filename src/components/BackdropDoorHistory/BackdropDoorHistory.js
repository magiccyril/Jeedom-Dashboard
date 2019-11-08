import React from 'react';

import Backdrop from '../Backdrop/Backdrop';

function formatHistoryListItem(element, i) {
  const badgeClassName = element.open ? 'badge-danger' : 'badge-success';

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
      {element.datetime.toFormat('dd/LL/yyyy HH:mm:ss')}
      <span className={"badge badge-pill " + badgeClassName}>
        {element.open ? 'Ouvert' : 'Fermé'}
      </span>
    </li>
  );
}

function BackdropDoorHistory(props) {
  if (!props.history) {
    return '';
  }

  const historyList = props.history.slice(0, 15).map(formatHistoryListItem);

  return (
    props.show ?
      <Backdrop title={props.title} onClose={props.onClose}>
        <p>15 derniers évènements :</p>
        <ul className="list-group list-group-flush">
          {historyList}
        </ul>
      </Backdrop>
    : ''
  );
}

export default BackdropDoorHistory;
