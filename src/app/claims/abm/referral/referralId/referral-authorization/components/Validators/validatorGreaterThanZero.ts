import { AbstractControl } from '@angular/forms';

export function greaterThanZeroValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const error = !control.value || control.value <= 0;

  return error ? { greaterThanZero: true } : null;
}
