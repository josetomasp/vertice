import { createFeatureSelector } from '@ngrx/store';
import { authorizationReducerKey } from '../reducers/pbm-authorization.reducers';

export const getPbmAuthorizationState = createFeatureSelector(
  authorizationReducerKey
);
