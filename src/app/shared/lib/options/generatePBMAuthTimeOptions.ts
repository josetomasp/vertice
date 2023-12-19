import * as _moment from 'moment';
import { TimeOption } from '@shared/lib';

const moment = _moment;

/**
 *
 * TODO: Move this to the pbm module/folder structure
 *
 * Generates a list of options of 24 hours chopped up by the given interval
 * @param startTime :: a moment start time like  moment().startOf('day').add(1230, 'minutes') 8:30 PM
 * @param endTime :: moment end time like  moment().startOf('day').add(7, 'hours') 7:00 AM
 * @param minuteIntervals :: how many minutes in between option
 * Reversing the start and end times will change the order of the list
 * @example [typescript]
 *  generatePBMAuthTimeOptions( moment().startOf('day').add(1230, 'minutes'),
    moment().startOf('day').add(7, 'hours'))
 * // gives [{value: '20:30:00', label: '8:30 PM'}, {value: '20:00:00', label: '8:00 PM'}, ...]
 */
export function generatePBMAuthTimeOptions(
  startTime: _moment.Moment,
  endTime: _moment.Moment,
  minuteIntervals = 30
): TimeOption[] {
  let numberOfOptions =
    moment.duration(startTime.diff(endTime)).asMinutes() / minuteIntervals;
  const options = [];
  const valueFormat = 'HH:mm:ss';
  const labelFormat = 'h:mm A';

  let ascendingTimeOrder = true;
  if (numberOfOptions < 0) {
    numberOfOptions = -numberOfOptions;
    ascendingTimeOrder = false;
  }
  if (ascendingTimeOrder) {
    for (let i = 0; i <= numberOfOptions; i++) {
      options.push(startTime.clone().subtract(i * minuteIntervals, 'minutes'));
    }
  } else {
    for (let i = 0; i <= numberOfOptions; i++) {
      options.push(startTime.clone().add(i * minuteIntervals, 'minutes'));
    }
  }

  let returnValue = options.map((o) => ({
    value: o.format(valueFormat),
    label: o.format(labelFormat)
  }));

  return returnValue;
}

export function generatePBMAuthTimeOptionFromDate(date: string) {
  const datoConvert: Date = moment(date).toDate();
  var hour = datoConvert.getHours();
  var minutes = datoConvert.getMinutes();
  var minutesToSet = '';
  if (minutes < 15) {
    minutesToSet = '00';
  } else if (minutes < 45) {
    minutesToSet = '30';
  } else {
    minutesToSet = '00';
    ++hour;
  }

  return ('0' + hour).slice(-2) + ':' + minutesToSet + ':00';
}
