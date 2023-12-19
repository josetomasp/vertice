import { createSelector } from '@ngrx/store';
import { getReferralIdState } from './referral-id.selectors';

export const getAuthorizationHistoryState = createSelector(
  getReferralIdState,
  (state) => state.authorizationHistory
);

export const isAuthorizationHistoryLoading = createSelector(
  getAuthorizationHistoryState,
  (state) => state.isLoading
);

export const getAuthorizationHistoryGroups = createSelector(
  getAuthorizationHistoryState,
  (state) => state.historyGroups
);

export const isAuthorizationHistoryLoaded = createSelector(
  getAuthorizationHistoryState,
  (state) => state.historyGroups && state.historyGroups.length > 0
);

export const getAuthorizationHistoryErrors = createSelector(
  getAuthorizationHistoryState,
  (state) => state.errors
);
