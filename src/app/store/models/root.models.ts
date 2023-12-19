import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { ClaimsState, SharedState } from '@shared/store/models';
import { ClaimViewState } from '../../claim-view/store/models/claim-view.models';
import { PBMAuthorizationState } from '../../claims/pbm/authorization/store/models/pbm-authorization.models';
import { RootPreferencesState } from '../../preferences/store/models/preferences.models';
import { UserState } from '../../user/store/models/user.models';
import { ReferralActivityState } from '../../claims/abm/referral/store/models';

export interface RootState {
  preferences: RootPreferencesState;
  claimview: ClaimViewState;
  referralActivity: ReferralActivityState;
  'pbm-authorizations': PBMAuthorizationState;
  user: UserState;
  shared: SharedState;
  claims: ClaimsState;
  router: RouterReducerState<RouterStateUrl>;
}

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}
