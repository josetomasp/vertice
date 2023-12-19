import { createReducer, on } from '@ngrx/store';
import {
  clearClaimResults,
  loadClaimResults,
  loadClaimResultsFail,
  loadClaimResultsSuccess,
  saveSearchForm
} from '../actions/make-a-referral-search.actions';
import { MakeAReferralSearchState } from '../models/make-a-referral-search.models';
import { mergeClone } from '@shared';

export const makeAReferralSearchInitialState: MakeAReferralSearchState = {
  claimResult: [],
  searchForm: null,
  loading: false,
  serverErrors: []
};

export const makeAReferralSearchReducer = createReducer(
  makeAReferralSearchInitialState,
  on(loadClaimResults, (state: MakeAReferralSearchState) => ({
    ...state,
    loading: true
  })),
  on(
    loadClaimResultsSuccess,
    (state: MakeAReferralSearchState, { claims }) => ({
      ...state,
      claimResult: [...claims],
      loading: false,
      serverErrors: []
    })
  ),
  on(
    loadClaimResultsFail,
    (state: MakeAReferralSearchState, { serverErrors }) =>
      mergeClone(state, {
        claimResult: [],
        loading: false,
        serverErrors: serverErrors
      })
  ),
  on(clearClaimResults, (state: MakeAReferralSearchState) => ({
    ...state,
    claimResult: [],
    loading: false,
    serverErrors: []
  })),
  on(saveSearchForm, (state: MakeAReferralSearchState, { form }) => ({
    ...state,
    searchForm: form
  }))
);
