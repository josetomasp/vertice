import { createSelector } from '@ngrx/store';
import { getCscAdminState } from './cscAdmin.selectors';
import { CscAdminState } from '../reducers/cscAdmin.reducers';

import { AuthStatusQueueState } from '../reducers/authStatusQueue.reducers';
import { AuthStatusQueueUserState } from '../models/authStatusQueue.models';

export const selectAuthStatusQueueState = createSelector(
  getCscAdminState,
  ({ authStatusQueueState }: CscAdminState): AuthStatusQueueState =>
    authStatusQueueState
);

export const selectAuthStatusQueueUserState = createSelector(
  selectAuthStatusQueueState,
  (state: AuthStatusQueueState): AuthStatusQueueUserState => state.userState
);
