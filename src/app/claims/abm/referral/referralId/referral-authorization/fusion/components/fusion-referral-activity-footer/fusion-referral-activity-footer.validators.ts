import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

export class FusionReferralActivityFooterValidators extends Validators {
  static pendExpirationDateValidation(
    pendExpirationDatepickerMaxDate
  ): ValidatorFn {
    return (ac: AbstractControl): ValidationErrors => {
      if (ac.value) {
        let validationDate = new Date().setHours(0, 0, 0, 0);
        if (ac.value < validationDate) {
          return {
            dateMustBeInFuture: true
          };
        } else {
          if (pendExpirationDatepickerMaxDate != null) {
            if (pendExpirationDatepickerMaxDate < ac.value) {
              return {
                dateAboveMaxDate: true
              };
            }
          }
        }
      }

      return;
    };
  }
}
