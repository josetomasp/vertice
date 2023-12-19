import { createAction, props } from '@ngrx/store';
import { AuthStatusQueueUserState } from '../models/authStatusQueue.models';

export const saveAuthStatusQueueUserState = createAction(
  '[CSCAuthStatusQueue] Save User State',
  props<AuthStatusQueueUserState>()
);
