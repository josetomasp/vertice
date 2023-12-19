import { combineReducers } from '@ngrx/store';
import { pbmAuthRootReducer } from './pbm-authorization-information.reducers';
import { PBM_AUTHORIZATION_INITIAL_STATE } from '../models/pbm-authorization-initial-state';

export const authorizationReducerKey = 'pbm-authorization';

export function authorizationReducer(state, action) {
  return combineReducers(
    {
      pbmAuthorizationRootState: pbmAuthRootReducer
    },
    {
      pbmAuthorizationRootState: PBM_AUTHORIZATION_INITIAL_STATE
    }
  )(state, action);
}
