import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RequestorInformationFormFieldNames } from '../requestor-information.formFieldNames';
import { ClaimStatusEnum } from '@healthe/vertice-library';

export class StateFundConfig {
  private static validTerminatedClaimRoles: string[] = [
    'CLMUA',
    'URG',
    'URO',
    'CLMUS',
    'AME',
    'QME',
    'CLMSCS',
    'TRAN',
    'TRPAUT'
  ];

  private static terminatedClaimRolesValidator(
    ac: AbstractControl
  ): ValidationErrors {
    if (ac.value) {
      if (!StateFundConfig.validTerminatedClaimRoles.includes(ac.value)) {
        return {
          invalidStateFundTerminatedRoleChoice: true
        };
      }
    }

    return {};
  }

  static initialFormGroupSetup(fg: FormGroup, claimStatus: string) {
    fg.get(RequestorInformationFormFieldNames.REQUESTOR_ROLE).setValidators(
      Validators.required
    );

    fg.get(RequestorInformationFormFieldNames.REQUESTOR_NAME).setValidators(
      Validators.required
    );

    fg.get(RequestorInformationFormFieldNames.REQUESTOR_PHONE).setValidators(
      Validators.required
    );

    fg.get(RequestorInformationFormFieldNames.INTAKE_METHOD).setValidators(
      Validators.required
    );

    fg.markAllAsTouched();

    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_ROLE
    ).updateValueAndValidity();
    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_NAME
    ).updateValueAndValidity();
    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_PHONE
    ).updateValueAndValidity();
    fg.get(
      RequestorInformationFormFieldNames.INTAKE_METHOD
    ).updateValueAndValidity();

    StateFundConfig.setupTerminatedClaimValidations(fg, claimStatus);

    StateFundConfig.setupChangeEvents(fg, claimStatus);
  }

  private static setupTerminatedClaimValidations(
    fg: FormGroup,
    claimStatus: string
  ) {
    if (ClaimStatusEnum.TERMINATED === claimStatus) {
      fg.get(RequestorInformationFormFieldNames.REQUESTOR_ROLE).addValidators(
        StateFundConfig.terminatedClaimRolesValidator
      );
    }
  }

  private static setupChangeEvents(fg: FormGroup, claimStatus: string) {
    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_ROLE
    ).valueChanges.subscribe((roleValue) => {
      StateFundConfig.resetValidators(fg);
      StateFundConfig.setupTerminatedClaimValidations(fg, claimStatus);

      switch (roleValue) {
        default:
          break;

        case 'PASSPT':
          StateFundConfig.setupPassportValidations(fg);
          break;

        case 'URO':
        case 'URG':
          StateFundConfig.setupUroUrgValidations(fg);
          break;
      }

      StateFundConfig.validateAffectedControls(fg);
    });
  }

  private static resetValidators(fg: FormGroup) {
    fg.get(RequestorInformationFormFieldNames.REQUESTOR_ROLE).clearValidators();

    fg.get(
      RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
    ).clearValidators();

    fg.get(
      RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER
    ).clearValidators();

    // This is always required
    fg.get(RequestorInformationFormFieldNames.REQUESTOR_ROLE).addValidators(
      Validators.required
    );
  }

  private static setupPassportValidations(fg: FormGroup) {
    fg.get(
      RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
    ).addValidators(Validators.required);

    fg.get(
      RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
    ).updateValueAndValidity();
  }

  private static validateAffectedControls(fg: FormGroup) {
    fg.get(
      RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
    ).updateValueAndValidity();

    fg.get(
      RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER
    ).updateValueAndValidity();
  }

  private static setupUroUrgValidations(fg: FormGroup) {
    fg.get(
      RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER
    ).addValidators(Validators.required);

    fg.get(
      RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER
    ).updateValueAndValidity();
  }
}
