import { combineReducers } from '@ngrx/store';
import { mergeClone } from '@shared';
import { Action, ActionType } from '../actions/referral-activity.actions';
import { CurrentActivityState } from '../models';
import { referralNotesReducer } from './referral-notes.reducers';

export function referralActivityReducer(state, action) {
  return combineReducers({
    details: currentActivityReducer,
    referralNotes: referralNotesReducer
  })(state, action);
}

function currentActivityReducer(state: CurrentActivityState, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE_SELECTED_SERVICE_TYPE:
      return mergeClone(state, {
        selectedServiceType: action.payload
      });
    case ActionType.UPDATE_TABLE_FILTERS:
      return mergeClone(state, { activityTableFilters: action.payload });
    case ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY:
      return mergeClone(state, {
        currentActivityCards: [],
        statusBar: {},
        isLoading: true
      });
    case ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY_SUCCESS:
      return mergeClone(state, {
        ...action.payload.responseBody,
        errors: action.payload.errors,
        isLoading: false
      });
    case ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY_FAIL:
      return mergeClone(state, {
        currentActivityCards: [],
        isLoading: false
      });

    default:
      return state;
  }
}
