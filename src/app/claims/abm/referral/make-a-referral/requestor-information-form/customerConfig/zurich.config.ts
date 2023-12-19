import { FormGroup, Validators } from '@angular/forms';

import { RequestorInformationFormFieldNames } from '../requestor-information.formFieldNames';

export class ZurichConfig {
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
  }
}
