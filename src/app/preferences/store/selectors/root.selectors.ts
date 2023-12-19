import { createFeatureSelector } from '@ngrx/store';
import { RootPreferencesState } from '../models/preferences.models';
import { preferencesStateFeatureKey } from '../reducers';

export const getPreferencesRootState = createFeatureSelector<
  RootPreferencesState
>(preferencesStateFeatureKey);
