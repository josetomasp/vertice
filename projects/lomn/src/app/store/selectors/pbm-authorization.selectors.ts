import { createFeatureSelector } from '@ngrx/store';
export const pbmFeatureKey = 'pbmAuthorizationRootState';
export const getPbmAuthorizationState = createFeatureSelector(pbmFeatureKey);
