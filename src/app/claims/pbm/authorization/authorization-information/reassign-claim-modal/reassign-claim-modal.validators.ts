import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

export class ReassignClaimModalValidators extends Validators {
  // Last name is only required when the first name is filled in.
  static lastNameRequiredIfFirstName(): ValidatorFn {
    return (ac: AbstractControl): ValidationErrors => {
      const parent: FormGroup = ac.parent as FormGroup;
      if (null == parent) {
        return null;
      }
      const firstName: AbstractControl = parent.get('claimantFirstName');
      const LastName: AbstractControl = parent.get('claimantLastName');

      if (null == firstName || null == LastName) {
        return null;
      }

      if (!!firstName.value) {
        if (!!LastName.value) {
          return null;
        }
        return { lastNameRequired: true };
      }
      return null;
    };
  }

  static emptyOrMinLength(length: number): ValidatorFn {
    return (ac: AbstractControl): ValidationErrors => {
      if (!ac.value) {
        return null;
      }
      if ((ac.value as string).length < length) {
        return { minLength: true };
      }
      return null;
    };
  }

  static formGroupHasSomeValues(): ValidatorFn {
    return (ac: AbstractControl): ValidationErrors => {
      const fg: FormGroup = ac as FormGroup;
      let hasAValue = false;

      Object.keys(fg.controls).forEach((key) => {
        if (!!fg.get(key).value) {
          hasAValue = true;
        }
      });

      if (false === hasAValue) {
        return { noValues: true };
      }
      return null;
    };
  }
}
