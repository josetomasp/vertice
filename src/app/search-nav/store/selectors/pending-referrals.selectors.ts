import { createSelector } from '@ngrx/store';
import { getNavSearchState } from './nav-search.selectors';
import {
  NavReferralBaseState,
  NavSearchState
} from '../reducers/nav-search.reducers';

export const selectPendingReferralsState = createSelector(
  getNavSearchState,
  (state: NavSearchState) => state.pendingReferrals
);

export const getPendingReferrals = createSelector(
  selectPendingReferralsState,
  (state: NavReferralBaseState) => state.referrals
);

export const getPendingReferralSearchForm = createSelector(
  selectPendingReferralsState,
  (state: NavReferralBaseState) => state.searchForm
);

export const getPendingReferralsLoading = createSelector(
  selectPendingReferralsState,
  (state: NavReferralBaseState) => state.loading
);

export const getPendingReferralsErrors = createSelector(
  selectPendingReferralsState,
  (state: NavReferralBaseState) => state.errors
);
