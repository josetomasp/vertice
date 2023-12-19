import { AbstractControl, FormControl } from '@angular/forms';

export function allOrNothingValidator(control: AbstractControl) {
  const appointmentDate: FormControl = control.get(
    'appointmentDate'
  ) as FormControl;
  const appointmentTime: FormControl = control.get(
    'appointmentTime'
  ) as FormControl;
  const appointmentType: FormControl = control.get(
    'appointmentType'
  ) as FormControl;

  if (
    null == appointmentDate ||
    null == appointmentTime ||
    null == appointmentType
  ) {
    return null;
  }

  // If all of them are null, then there are no errors.
  if (
    null == appointmentDate.value &&
    null == appointmentTime.value &&
    null == appointmentType.value
  ) {
    return null;
  }

  // If all of them are NOT null, then there are no errors.
  if (
    null != appointmentDate.value &&
    null != appointmentTime.value &&
    null != appointmentType.value
  ) {
    return null;
  }
  // At this point, we know that at all our controls have been touched, and at least one of them is null while another is not null.
  return { allOrNothing: true };
}
