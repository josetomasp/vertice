import { AbstractControl } from '@angular/forms';

export function discardReasonsValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }

  const fcCreateEpaq: AbstractControl = control.parent.get('CreateEpaq');
  if ('DISCARD' === fcCreateEpaq.value && control.value == null) {
    return { required: true };
  }

  return null;
}

export function otherReasonsValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }

  const fcCreateEpaq: AbstractControl = control.parent.get('CreateEpaq');
  const fcDiscardReasons: AbstractControl = control.parent.get(
    'discardReasons'
  );
  if (
    'DISCARD' === fcCreateEpaq.value &&
    'OTHER' === fcDiscardReasons.value &&
    !control.value
  ) {
    return { required: true };
  }

  return null;
}
