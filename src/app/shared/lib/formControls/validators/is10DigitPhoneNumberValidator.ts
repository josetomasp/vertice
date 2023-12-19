import { AbstractControl, FormControl } from '@angular/forms';

export function is10DigitPhoneNumberValidator(control: AbstractControl) {
  const fc: FormControl = control as FormControl;
  if (null == fc) {
    return null;
  }

  const value = fc.value as String;
  if (null == value) {
    return { invalidPhoneNumber: true };
  } else {
    if (value.length === 10) {
      return null;
    }
  }
  return { invalidPhoneNumber: true };
}
