import { createAction, props } from '@ngrx/store';

import {
  ReferralAuthorizationAction,
  ReferralAuthorizationItem,
  ReferralAuthorizationSet
} from '../../referralId/referral-authorization/referral-authorization.models';

export const loadReferralAuthorizationSet = createAction(
  '[Referral Authorization] Load Authorization Set',
  props<{
    encodedCustomerId: string;
    encodedReferralId: string;
    encodedClaimNumber: string;
    isManualAuthorizations: boolean;
  }>()
);

export const loadReferralAuthorizationSetSuccess = createAction(
  '[Referral Authorization] Load Authorization Set Success',
  props<{ referralAuthSet: ReferralAuthorizationSet }>()
);

export const loadReferralAuthorizationSetFailure = createAction(
  '[Referral Authorization] Load Authorization Set Failure'
);

export const clearReferralAuthorizationSet = createAction(
  '[Referral Authorization] Clear Authorization Set'
);

export const updateReferralAuthorizationFormData = createAction(
  '[Referral Authorization] Update Referral Authorization Form Data',
  props<{ authItemId: number; formData: any }>()
);

export const addReferralAuthorizationItem = createAction(
  '[Referral Authorization] Add Referral Authorization item',
  props<{ authItem: ReferralAuthorizationItem }>()
);

export const removeReferralAuthorizationItem = createAction(
  '[Referral Authorization] Remove Referral Authorization item',
  props<{ authItem: ReferralAuthorizationItem }>()
);

export const setAuthorizationIsSuccessfullySubmitted = createAction(
  '[Referral Authorization] Authorization Submit Set Success',
  props<{ authorizationIsSuccessfullySubmitted: boolean }>()
);

export const setOpenAuthDetailsExpanded = createAction(
  '[Referral Authorization] Authorization Details Expanded/Collapsed',
  props<{ isOpenAuthDetailsExpanded: boolean }>()
);

export const rollbackTripsAuthorized = createAction(
  '[Referral Authorization] Rollback Trips Authorized'
);

export const loadReferralAuthorizationAction = createAction(
  '[Referral Authorization] Load Authorization Action',
  props<{
    encodedReferralId: string;
    encodedCustomerId: string;
    encodedClaimNumber: string;
  }>()
);

export const loadReferralAuthorizationActionSuccess = createAction(
  '[Referral Authorization] Load Authorization Action Success',
  props<{ referralAuthorizationActions: ReferralAuthorizationAction }>()
);

export const loadReferralAuthorizationActionFailure = createAction(
  '[Referral Authorization] Load Authorization Action Failure'
);
