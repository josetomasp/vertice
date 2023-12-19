import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const oneValueRequiredValidator = (
  validator: ValidatorFn,
  controls: string[] = null
) => (group: FormGroup): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls);
  }

  const hasAtLeastOne =
    group &&
    group.controls &&
    controls.some((k) => !validator(group.controls[k]));

  return hasAtLeastOne
    ? null
    : {
        hasNoValues: true
      };
};
