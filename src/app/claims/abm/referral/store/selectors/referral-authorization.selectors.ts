import { createSelector } from '@ngrx/store';

import { getReferralState } from './index';
import {
  ReferralAuthorizationAction,
  ReferralAuthorizationState
} from '../../referralId/referral-authorization/referral-authorization.models';
import { ReferralState } from '../models/referral.models';

export const getReferralAuthorizationState = createSelector(
  getReferralState,
  (state: ReferralState) => state.referralAuthorization
);

export const getReferralAuthorizationIsLoaded = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState) => state.isLoaded
);

export const isReferralAuthLoading = createSelector(
  getReferralAuthorizationState,
  (state) => state.isLoading
);

export const getReferralAuthorizationSet = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState) => state.referralAuthorizationSet
);

export const isOpenAuthDetailsExpanded = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState) => state.isOpenAuthDetailsExpanded
);

export const isAuthorizationIsSuccessfullySubmitted = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState) =>
    state.isAuthorizationSuccessfullySubmitted
);

export const getOpenAuthData = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState) =>
    state.referralAuthorizationSet.referralAuthorization.authorizationItems[0]
      .authData
);

export const getReferralAuthorizationAction = createSelector(
  getReferralAuthorizationState,
  (state: ReferralAuthorizationState): ReferralAuthorizationAction =>
    state.referralAuthorizationAction
);
