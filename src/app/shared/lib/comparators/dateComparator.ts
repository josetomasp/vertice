import { environment } from '../../../../environments/environment';
import * as _moment from 'moment';

const moment = _moment;

export function dateComparator(item1, item2, ascending: boolean) {
  const date1 = moment(item1, environment.dateFormat);
  const date2 = moment(item2, environment.dateFormat);
  let returnValue: number;

  if (date1.isValid() && date2.isValid()) {
    date1.isAfter(date2) ? (returnValue = 1) : (returnValue = -1);
  } else {
    console.error('Invalid date format for comparison');
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
