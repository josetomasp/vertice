import { FormGroup } from '@angular/forms';
import { ClaimResult } from '../../../claims/abm/referral/store/models/claimResult.model';

export interface MakeAReferralSearchState {
  claimResult: ClaimResult[];
  searchForm: FormGroup;
  loading: boolean;
  serverErrors: Array<string>;
}
