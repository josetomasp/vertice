import { createReducer, on } from '@ngrx/store';
import * as NavDraftReferralActions from '../actions/draft-referrals.actions';
import { NavReferralBaseState } from './nav-search.reducers';

export const navDraftReferralsInitialState: NavReferralBaseState = {
  referrals: [],
  searchForm: null,
  loading: false,
  errors: []
};

export const navDraftReferralsReducer = createReducer(
  navDraftReferralsInitialState,
  on(
    NavDraftReferralActions.loadDraftReferrals,
    (state: NavReferralBaseState) => ({
      ...state,
      loading: true
    })
  ),
  on(
    NavDraftReferralActions.loadDraftReferralsSuccess,
    (state: NavReferralBaseState, { referrals }) => ({
      ...state,
      referrals: [...referrals],
      loading: false
    })
  ),
  on(
    NavDraftReferralActions.saveDraftSearchForm,
    (state: NavReferralBaseState, { form }) => ({
      ...state,
      searchForm: form
    })
  )
);
