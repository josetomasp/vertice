import { PbmAuthFooterConfig } from './pbm-authorization-information.model';
import { FormGroup } from '@angular/forms';
import { PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG } from './pbm-auth-pos-footer-default-config';

export const PBM_AUTH_FOOTER_DEFAULT_CONFIG: PbmAuthFooterConfig = {
  footerConfig: PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG,
  submitClickedBefore: false,
  showErrors: false,
  submitted: false,
  pbmAuthformGroup: new FormGroup({})
};
