import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReferralState } from 'src/app/claims/abm/referral/store/models/referral.models';
import {
  FusionMakeReferralState,
  MakeReferralFusionOptions
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';

export const referralStateKey = 'referral';

export const getReferralState = createFeatureSelector(referralStateKey);

export const getFusionMakeAReferralState = createSelector(
  getReferralState,
  (state: ReferralState) => state.fusionMakeReferral
);

export const getFusionReferralOptions = createSelector(
  getFusionMakeAReferralState,
  (state: FusionMakeReferralState) => state.referralOptions
);

export const getFusionBodyPartsForClaim = createSelector(
  getFusionReferralOptions,
  (state: MakeReferralFusionOptions) => {
    return state.bodyParts;
  }
);
