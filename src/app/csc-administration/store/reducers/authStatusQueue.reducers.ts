import { AuthStatusQueueUserState } from '../models/authStatusQueue.models';
import { createReducer, on } from '@ngrx/store';
import { saveAuthStatusQueueUserState } from '../actions/authStatusQueue.actions';

export interface AuthStatusQueueState {
  userState: AuthStatusQueueUserState;
}

export const authStatusQueueInitialState: AuthStatusQueueState = {
  userState: {
    pageSize: 200,
    selectedTabIndex: 1,
    selectedTabPharmacyTypeIndex: [1, 0, 1, 1]
  } as AuthStatusQueueUserState
};

export const authStatusQueueReducer = createReducer(
  authStatusQueueInitialState,
  on(
    saveAuthStatusQueueUserState,
    (state, payload): AuthStatusQueueState => ({
      ...state,
      userState: payload
    })
  )
);
