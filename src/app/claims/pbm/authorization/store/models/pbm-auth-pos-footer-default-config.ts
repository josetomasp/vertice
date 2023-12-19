import { PbmAuthPOSFooterConfig } from './pbm-authorization-information.model';
import { FormGroup } from '@angular/forms';

export const PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG: PbmAuthPOSFooterConfig = {
  showRequestedCallbackFields: false,
  callerFormGroup: new FormGroup({})
};
