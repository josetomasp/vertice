import * as _moment from 'moment';
import { TimeOption } from '@shared/lib';

const moment = _moment;

/**
 * Generates a list of options of 24 hours chopped up by the given interval
 * @param minuteIntervals :: how many minutes in between option
 * @param militaryTime :: whether to display 24 time as the label
 * @example [typescript]
 * const options = generateTimeOptions(15);
 * // gives [{value: '00:00:00', label: '12:00:00 AM'}, {value: '00:15:00', label: '12:15:00 AM'}, ...]
 */
export function generateABMReferralTimeOptions(
  minuteIntervals = 60,
  militaryTime = false
): TimeOption[] {
  if (minuteIntervals > 60) {
    throw new Error('Cant split intervals by more than an hour');
  }

  const options = [];
  const valueFormat = 'HH:mm:ss';
  const labelFormat = militaryTime ? valueFormat : 'h:mm A';
  const numberOfOptions = 1440 / minuteIntervals;
  const startDateTime = moment().startOf('day');
  const startDuration = moment.duration('06:00:00');
  for (let i = 0; i < numberOfOptions; i++) {
    options.push(startDuration.clone().add(i * minuteIntervals, 'minutes'));
  }

  let returnValue = options.map((o) => ({
    value: startDateTime
      .clone()
      .add(o)
      .format(valueFormat),
    label: startDateTime
      .clone()
      .add(o)
      .format(labelFormat)
  }));

  returnValue.unshift({ value: 'Unknown', label: 'Unknown' });
  return returnValue;
}
