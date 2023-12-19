import { createSelector } from '@ngrx/store';
import { getNavSearchState } from './nav-search.selectors';
import {
  NavReferralBaseState,
  NavSearchState
} from '../reducers/nav-search.reducers';

export const selectActivityReferralsState = createSelector(
  getNavSearchState,
  (state: NavSearchState) => state.activityReferrals
);

export const getActivityReferrals = createSelector(
  selectActivityReferralsState,
  (state: NavReferralBaseState) => state.referrals
);

export const getActivityReferralSearchForm = createSelector(
  selectActivityReferralsState,
  (state: NavReferralBaseState) => state.searchForm
);

export const getActivityReferralsLoading = createSelector(
  selectActivityReferralsState,
  (state: NavReferralBaseState) => state.loading
);

export const getActivityReferralsErrors = createSelector(
  selectActivityReferralsState,
  (state: NavReferralBaseState) => state.errors
);
