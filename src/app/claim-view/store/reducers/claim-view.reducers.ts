import { combineReducers } from '@ngrx/store';
import { claimViewInitialState } from '../models/claim-view.models';
import { activityTabReducer } from './activity-tab.reducers';
import { eligibilityReducer } from './eligibility-tab.reducers';
import { icdCodesReducer } from './icd-codes-reducers';
import { incidentsReducer } from './incidents-tab-reducer';

function claimViewRootReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export function reducer(state, action) {
  return combineReducers(
    {
      root: claimViewRootReducer,
      activityTab: activityTabReducer,
      icdCodeTab: icdCodesReducer,
      incidentsTab: incidentsReducer,
      eligibilityTab: eligibilityReducer
    },
    claimViewInitialState
  )(state, action);
}
