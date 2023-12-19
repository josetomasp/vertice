import { FormArray, FormGroup } from '@angular/forms';

/**
 * TODO: See if this can be removed. Unused
 * @param formToInvestigate
 */
export function getInvalidControlsRecursive(
  formToInvestigate: FormGroup | FormArray
): string[] {
  let invalidControls: string[] = [];
  let recursiveFunc = (form: FormGroup | FormArray, parentField?: string) => {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control.invalid) {
        invalidControls.push(parentField + '.' + field);
      }
      if (control instanceof FormGroup) {
        recursiveFunc(control, field);
      } else if (control instanceof FormArray) {
        recursiveFunc(control, field);
      }
    });
  };
  recursiveFunc(formToInvestigate, 'formGroup');
  return invalidControls;
}
