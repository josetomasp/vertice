import { combineReducers } from '@ngrx/store';
import {
  assignFirstFillsToClaimReducer,
  AssignFirstFillsToClaimState,
  initialAssignFirstFillsToClaimState
} from '../../assign-first-fill-to-claim/store/assign-first-fill-to-claim.reducer';
import {
  authStatusQueueInitialState,
  authStatusQueueReducer,
  AuthStatusQueueState
} from './authStatusQueue.reducers';

export const cscAdminFeatureKey = 'cscAdmin';
export const cscAdminInitialState: CscAdminState = {
  assignFirstFillLineItemsToClaimState: initialAssignFirstFillsToClaimState,
  authStatusQueueState: authStatusQueueInitialState
};

export interface CscAdminState {
  assignFirstFillLineItemsToClaimState: AssignFirstFillsToClaimState;
  authStatusQueueState: AuthStatusQueueState;
}

export function cscAdminReducer(state, action) {
  return combineReducers(
    {
      assignFirstFillLineItemsToClaimState: assignFirstFillsToClaimReducer,
      authStatusQueueState: authStatusQueueReducer
    },
    cscAdminInitialState
  )(state, action);
}
