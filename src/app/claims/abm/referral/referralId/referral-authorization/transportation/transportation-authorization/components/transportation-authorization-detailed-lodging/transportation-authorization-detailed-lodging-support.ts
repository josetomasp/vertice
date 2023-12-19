import * as _moment from 'moment';

const moment = _moment;

export const lodgingNumberOfRoomsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const lodgingPriceOfRoomOptions = [
  'Best Available',
  '$',
  '$$',
  '$$$',
  '$$$$',
  '$$$$$'
];

export function numberOfNightsUpdateCheckoutDate(
  checkinDate: string,
  numberOfNights: number
): string {
  if (null == checkinDate) {
    return null;
  }
  const checkin_date = moment(checkinDate);
  if (false === checkin_date.isValid()) {
    return null;
  }
  if (numberOfNights <= 0) {
    return null;
  }

  checkin_date.add(numberOfNights, 'days');

  return checkin_date.utc().format();
}

export function calculateNumberOfNights(
  checkinDate: string,
  checkoutDate: string
): number {
  if (null == checkinDate || null == checkoutDate) {
    return null;
  }

  const checkin_date = moment(checkinDate);
  const checkout_date = moment(checkoutDate);
  if (checkin_date.isValid() && checkout_date.isValid()) {
    const result = checkout_date.diff(checkin_date, 'days');
    if (result <= 0) {
      return null;
    }
    return result;
  } else {
    return null;
  }
}
