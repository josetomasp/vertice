import { FormGroup, Validators } from '@angular/forms';
import { RequestorInformationFormFieldNames } from '../requestor-information.formFieldNames';

export class HartfordConfig {
  static initialFormGroupSetup(fg: FormGroup) {
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

    HartfordConfig.setupChangeEvents(fg);
  }

  private static setupChangeEvents(fg: FormGroup) {
    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_ROLE
    ).valueChanges.subscribe((roleValue) => {
      // HIG CA Select
      if ('HIGSEL' === roleValue) {
        fg.get(
          RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
        ).addValidators(Validators.required);

        fg.get(
          RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
        ).updateValueAndValidity();
      } else {
        fg.get(
          RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
        ).clearValidators();
        fg.get(
          RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID
        ).updateValueAndValidity();
      }
    });
  }
}
