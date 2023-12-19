import { mergeClone } from '@shared/lib/store/mergeClone';
import { each, findIndex } from 'lodash';
import { Action, ActionType } from '../actions/preferences.actions';
import { Preference, PreferencesState } from '../models/preferences.models';

function updatePreferences(
  preferences: Preference<any>[],
  updates: Preference<any>[]
) {
  each(updates, (pref) => {
    const idx = findIndex(preferences, {
      componentGroupName: pref.componentGroupName,
      componentName: pref.componentName,
      componentTypeName: pref.componentTypeName,
      screenName: pref.screenName,
      preferenceTypeName: pref.preferenceTypeName
    });
    preferences.splice(idx, 1, pref);
  });
  return preferences;
}

export function preferencesReducer(state: PreferencesState, action: Action) {
  switch (action.type) {
    case ActionType.GET_ALL_PREFERENCES:
      return mergeClone(state, { isLoading: true });
    case ActionType.SAVE_PREFERENCES_SUCCESS:
      return {
        preferences: updatePreferences([...state.preferences], action.payload),
        isLoading: false,
        errors: []
      };
    case ActionType.GET_ALL_PREFERENCES_SUCCESS:
      return {
        preferences: action.payload,
        isLoading: false,
        errors: []
      };
    case ActionType.DELETE_PREFERENCES_FAIL:
    case ActionType.DELETE_ALL_PREFERENCES_FAIL:
    case ActionType.GET_ALL_PREFERENCES_FAIL:
      return mergeClone(state, { errors: [action.payload], isLoading: false });
    default:
      return state;
  }
}
