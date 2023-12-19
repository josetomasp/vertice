import { AbstractControl } from '@angular/forms';
import * as _moment from 'moment';

const moment = _moment;

export function validCityOrAirpotValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const error = control.value == null || control.value === '';
  return error ? { wasValuePicked: true } : null;
}

export function nightsOrCheckinDateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const fcNights: AbstractControl = control.parent.get('numberOfNights');
  const fcCheckInDate: AbstractControl = control.parent.get('checkInDate');

  const error = !fcNights.value && !fcCheckInDate.value;
  return error ? { nightsOrCheckinDate: true } : null;
}

export function checkingDateBeforeCheckoutDateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }

  const fcCheckInDate: AbstractControl = control.parent.get('checkInDate');
  const fcCheckOutDate: AbstractControl = control.parent.get('checkOutDate');
  const checkInDate = moment(fcCheckInDate.value);
  const checkOutDate = moment(fcCheckOutDate.value);

  // Only check if both dates ae valid.
  if (!checkInDate.isValid() || !checkOutDate.isValid()) {
    return null;
  }

  const error = checkInDate.isSameOrAfter(checkOutDate);
  return error ? { checkinDateAfterCheckoutDate: true } : null;
}
