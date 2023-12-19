import { combineReducers } from '@ngrx/store';
import { viewReducer } from './preferences-screen.reducers';
import { preferencesReducer } from './preferences.reducers';

export const preferencesStateFeatureKey = 'preferencesRoot';

const rootReducer = combineReducers({
  view: viewReducer,
  preferencesStore: preferencesReducer
});

export function reducer(state, action) {
  return rootReducer(state, action);
}
