import { FormGroup, Validators } from '@angular/forms';

import { RequestorInformationFormFieldNames } from '../requestor-information.formFieldNames';

export class GallagherConfig {
  static initialFormGroupSetup(fg: FormGroup) {
    fg.get(RequestorInformationFormFieldNames.REQUESTOR_ROLE).setValidators(
      Validators.required
    );

    fg.markAllAsTouched();

    fg.get(
      RequestorInformationFormFieldNames.REQUESTOR_ROLE
    ).updateValueAndValidity();
  }
}
