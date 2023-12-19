import { AbstractControl } from '@angular/forms';

export function dmeOtherValidation(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  if (control.value && control.value.subTypeDescription === 'Other') {
    const notes: AbstractControl = control.parent.get('notes');

    return notes.value == null || notes.value === ''
      ? { notesRequired: true }
      : null;
  }
  return null;
}

export function dmeNotesValidation(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const productControl: AbstractControl = control.parent.get('product');

  if (productControl) {
    productControl.updateValueAndValidity();
  }

  return null;
}
