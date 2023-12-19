import { AbstractControl } from '@angular/forms';

export function approvedForOrDateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }

  const fcapprovedFor: AbstractControl = control.parent.get(
    'approvedForDuration'
  );
  const fcDate: AbstractControl = control.parent.get('approvedDatePicker');

  const error = !fcapprovedFor.value && !fcDate.value;

  return error ? { approvedForOrDate: true } : null;
}
