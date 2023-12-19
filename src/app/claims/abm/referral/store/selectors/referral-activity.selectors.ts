import { createSelector } from '@ngrx/store';
import { ReferralIdState } from '../models/referral-id.models';
import { getReferralIdState } from './referral-id.selectors';

export const getReferralActivityState = createSelector(
  getReferralIdState,
  (state: ReferralIdState) => state.referralActivity
);

export const getReferralActivityDetails = createSelector(
  getReferralActivityState,
  (state) => state.details
);

export const getCurrentActivityCards = createSelector(
  getReferralActivityDetails,
  (state) => state.currentActivityCards
);

export const getCurrentActivityErrors = createSelector(
  getReferralActivityDetails,
  (state) => state.errors
);

export const getStatusBarState = createSelector(
  getReferralActivityDetails,
  (state) => state.statusBar
);

export const getServiceTypes = createSelector(
  getStatusBarState,
  (state) => state.serviceTypes
);

export const getSelectedServiceType = createSelector(
  getReferralActivityDetails,
  (state) => state.selectedServiceType
);

export const isReferralActivityLoading = createSelector(
  getReferralActivityDetails,
  (state) => state.isLoading
);

export const getActivityTableFilters = createSelector(
  getReferralActivityDetails,
  (state) => state.activityTableFilters
);

export const hasAdditionalContactAttempts = createSelector(
  getReferralActivityDetails,
  (state) => state.hasAdditionalContactAttempts
);

export const getAllContactAttempts = createSelector(
  getReferralActivityDetails,
  (state) => state.allContactAttempts
);
