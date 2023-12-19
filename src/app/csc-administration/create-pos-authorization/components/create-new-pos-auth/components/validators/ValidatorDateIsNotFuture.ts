import { AbstractControl, ValidationErrors } from '@angular/forms';

export const validatorDateIsNotFuture = (
  ac: AbstractControl
): ValidationErrors => {
  if (ac.value) {
    let validationDate = new Date().setHours(23, 59, 59, 0);
    if (ac.value > validationDate) {
      return {
        futureDate: true
      };
    }
  }
  return null;
};
