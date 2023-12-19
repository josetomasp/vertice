import { createSelector } from '@ngrx/store';
import { getReferralState } from './index';
import { ReferralRootState, ReferralState } from '../models/referral.models';

export const getReferralRootState = createSelector(
  getReferralState,
  (state: ReferralState) => state.root
);

export const getClaimOverviewBarFields = createSelector(
  getReferralRootState,
  (state: ReferralRootState) => state.claimantOverviewBar.fields
);
