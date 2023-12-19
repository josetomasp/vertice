import { createSelector } from '@ngrx/store';
import { getNavSearchState } from './nav-search.selectors';
import {
  NavReferralBaseState,
  NavSearchState
} from '../reducers/nav-search.reducers';

export const selectDraftReferralsState = createSelector(
  getNavSearchState,
  (state: NavSearchState) => state.draftReferrals
);

export const getDraftReferrals = createSelector(
  selectDraftReferralsState,
  (state: NavReferralBaseState) => state.referrals
);

export const getDraftReferralSearchForm = createSelector(
  selectDraftReferralsState,
  (state: NavReferralBaseState) => state.searchForm
);

export const getDraftReferralsLoading = createSelector(
  selectDraftReferralsState,
  (state: NavReferralBaseState) => state.loading
);
