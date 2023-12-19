import { createFeatureSelector, createSelector } from '@ngrx/store';
import { find } from 'lodash';
import { Preference, RootPreferencesState } from '../models/preferences.models';
import { preferencesStateFeatureKey } from '../reducers';

export const getPreferencesState = createFeatureSelector(
  preferencesStateFeatureKey
);

export const getAllPreferences = createSelector(
  getPreferencesState,
  (state: RootPreferencesState) => state.preferencesStore.preferences
);

export const getPreferenceByQuery = createSelector(
  getAllPreferences,
  (state, query): Preference<any> => find(state, query)
);
