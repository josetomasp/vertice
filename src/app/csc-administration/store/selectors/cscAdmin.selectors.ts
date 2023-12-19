import { createFeatureSelector } from '@ngrx/store';
import { cscAdminFeatureKey } from '../reducers/cscAdmin.reducers';

export const getCscAdminState = createFeatureSelector(cscAdminFeatureKey);
