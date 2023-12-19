import { createReducer, on } from '@ngrx/store';
import * as NavPendingReferralActions from '../actions/pending-referrals.actions';
import { NavReferralBaseState } from './nav-search.reducers';

export const navPendingReferralsInitialState: NavReferralBaseState = {
  referrals: [],
  searchForm: null,
  loading: false,
  errors: []
};

export const navPendingReferralsReducer = createReducer(
  navPendingReferralsInitialState,
  on(
    NavPendingReferralActions.loadPendingReferrals,
    (state: NavReferralBaseState) => ({
      ...state,
      loading: true,
      errors: []
    })
  ),
  on(
    NavPendingReferralActions.loadPendingReferralsSuccess,
    (state: NavReferralBaseState, { referrals }) => ({
      ...state,
      referrals: [...referrals],
      loading: false,
      errors: []
    })
  ),
  on(
    NavPendingReferralActions.loadPendingReferralsFail,
    (state: NavReferralBaseState, { errors }) => ({
      ...state,
      referrals: [],
      loading: false,
      errors: errors
    })
  ),
  on(
    NavPendingReferralActions.savePendingSearchForm,
    (state: NavReferralBaseState, { form }) => ({
      ...state,
      searchForm: { ...form }
    })
  )
);
