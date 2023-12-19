import { AbstractControl } from '@angular/forms';
import * as _moment from 'moment';

const moment = _moment;

export function validAirpotValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const error =
    control.value != null && control.value !== '' && !control.pristine;
  return error ? { wasValuePicked: true } : null;
}

export function duplicateAirportValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const fcFrom: AbstractControl = control.parent.get('flyingFrom');
  const fcTo: AbstractControl = control.parent.get('flyingTo');

  const error =
    fcFrom.value === fcTo.value && control.value !== '' && fcFrom.value !== '';

  return error ? { duplicate: true } : null;
}

export function departurerOrAppointmentValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const fcDepartureDate: AbstractControl = control.parent.get('departureDate');
  const fcAppointmentDate: AbstractControl = control.parent.get(
    'appointmentDate'
  );

  const error = !(fcDepartureDate.value || fcAppointmentDate.value);

  return error ? { required: true } : null;
}

export function departureBeforeReturnValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const fcDepartureDate: AbstractControl = control.parent.get('departureDate');
  const fcReturnDate: AbstractControl = control.parent.get('returnDate');

  const error =
    fcDepartureDate.value != null &&
    fcReturnDate.value != null &&
    moment(fcDepartureDate.value).isAfter(fcReturnDate.value);
  return error ? { departureBeforeReturn: true } : null;
}
