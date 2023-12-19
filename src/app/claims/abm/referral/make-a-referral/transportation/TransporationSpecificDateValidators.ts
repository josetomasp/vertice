import { AbstractControl } from '@angular/forms';

export function duplicateFromAndToValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }
  const fcFrom: AbstractControl = control.parent.get('fromAddress');
  const fcTo: AbstractControl = control.parent.get('toAddress');

  if (null == fcFrom || null == fcTo) {
    return null;
  }

  if (fcFrom.value == null || fcTo.value == null) {
    return null;
  }

  if (fcFrom.value.id == null || fcTo.value.id == null) {
    return null;
  }

  const error = fcFrom.value.id === fcTo.value.id;

  return error ? { duplicate: true } : null;
}
