import { createReducer, on } from '@ngrx/store';
import * as NavActivityReferralActions from '../actions/activity-referrals.actions';
import { NavReferralBaseState } from './nav-search.reducers';

export const navActivityReferralsInitialState: NavReferralBaseState = {
  referrals: [],
  searchForm: null,
  loading: false,
  errors: []
};

export const navActivityReferralsReducer = createReducer(
  navActivityReferralsInitialState,
  on(
    NavActivityReferralActions.loadActivityReferrals,
    (state: NavReferralBaseState) => ({
      ...state,
      loading: true,
      errors: []
    })
  ),
  on(
    NavActivityReferralActions.loadActivityReferralsSuccess,
    (state: NavReferralBaseState, { referrals }) => ({
      ...state,
      referrals: [...referrals],
      loading: false,
      errors: []
    })
  ),
  on(
    NavActivityReferralActions.loadActivityReferralsFail,
    (state: NavReferralBaseState, { errors }) => ({
      ...state,
      referrals: [],
      loading: false,
      errors: errors
    })
  ),
  on(
    NavActivityReferralActions.saveActivitySearchForm,
    (state: NavReferralBaseState, { form }) => ({
      ...state,
      // This should not be an actual formgroup.... also, the action is doing a cloneDeep, and this was doing a spread...
      searchForm: form
    })
  )
);
