import * as _moment from 'moment';

const moment = _moment;

export function dateTimeComparator(item1, item2, ascending: boolean) {
  const date1 = moment(item1, 'MM/DD/YYYY h:mm a');
  const date2 = moment(item2, 'MM/DD/YYYY h:mm a');
  let returnValue = 0;

  if (date1.isSame(date2)) {
    returnValue = 0;
  }
  if (date1.isValid() && date2.isValid()) {
    date1.isAfter(date2) ? (returnValue = 1) : (returnValue = -1);
  } else {
    if (date1.isValid()) {
      returnValue = 1;
    } else {
      if (date2.isValid()) {
        returnValue = -1;
      } else {
        returnValue = 0;
      }
    }
  }

  if (ascending) {
    return returnValue;
  } else {
    return returnValue * -1;
  }
}
