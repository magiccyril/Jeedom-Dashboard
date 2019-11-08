export function formatDoorDate(object, door) {
  if (!door) {
    return object + ' est dans un état indéterminée';
  }

  const status = door.open ? 'ouvert' : 'fermé';

  if (!door.history || door.history.length === 0) {
    return object + ' est ' + status + ' depuis une période indéterminée';
  }
  
  let duration;
  let diff = door.history[0].datetime.diffNow().negate();
  if (diff.toFormat('d') > 1) {
    duration = diff.toFormat('d') +' jours';
  } else if (diff.toFormat('d') > 0) {
    duration = '1 jour';
  } else if (diff.toFormat('h') > 1) {
    duration = diff.toFormat('h') + ' heures';
  } else if (diff.toFormat('h') > 0) {
    duration = '1 heure';
  } else if (diff.toFormat('m') > 1) {
    duration = diff.toFormat('m') + ' minutes';
  } else if (diff.toFormat('m') > 0) {
    duration = '1 minute';
  } else {
    duration = "moins d'une minute";
  }

  return object + ' est ' + status + ' depuis ' + duration + '.';
}