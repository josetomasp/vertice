import { Action as ngrxAction } from '@ngrx/store';
import { Preference } from '../models/preferences.models';

export enum ActionType {
  GET_ALL_PREFERENCES = '[Preferences] Get All Preferences',
  GET_ALL_PREFERENCES_SUCCESS = '[Preferences] Get All Preferences Success',
  GET_ALL_PREFERENCES_FAIL = '[Preferences] Get All Preferences Fail',

  SAVE_PREFERENCES = '[Preferences] Save Preferences',
  SAVE_PREFERENCES_SUCCESS = '[Preferences] Save Preferences Success',
  SAVE_PREFERENCES_FAIL = '[Preferences] Save Preferences Fail',

  DELETE_PREFERENCES = '[Preferences] Delete Preference',
  DELETE_PREFERENCES_SUCCESS = '[Preferences] Delete Preference Success',
  DELETE_PREFERENCES_FAIL = '[Preferences] Delete Preference Fail',

  DELETE_ALL_PREFERENCES = '[Preferences] Delete All Preference',
  DELETE_ALL_PREFERENCES_SUCCESS = '[Preferences] Delete All Preference Success',
  DELETE_ALL_PREFERENCES_FAIL = '[Preferences] Delete All Preference Fail'
}

export class GetAllPreferences implements ngrxAction {
  readonly type: ActionType = ActionType.GET_ALL_PREFERENCES;

  constructor(public payload?) {}
}

export class GetAllPreferencesSuccess implements ngrxAction {
  readonly type: ActionType = ActionType.GET_ALL_PREFERENCES_SUCCESS;

  constructor(public payload: Preference<any>[]) {}
}

export class GetAllPreferencesFail implements ngrxAction {
  readonly type: ActionType = ActionType.GET_ALL_PREFERENCES_FAIL;

  constructor(public payload) {}
}

export class SavePreferences implements ngrxAction {
  readonly type: ActionType = ActionType.SAVE_PREFERENCES;

  constructor(public payload: Preference<any>[]) {}
}

export class SavePreferencesSuccess implements ngrxAction {
  readonly type: ActionType = ActionType.SAVE_PREFERENCES_SUCCESS;

  constructor(public payload) {}
}

export class SavePreferencesFail implements ngrxAction {
  readonly type: ActionType = ActionType.SAVE_PREFERENCES_FAIL;

  constructor(public payload) {}
}

export class DeletePreferences implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_PREFERENCES;

  constructor(public payload: Preference<any>[]) {}
}

export class DeletePreferencesSuccess implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_PREFERENCES_SUCCESS;

  constructor(public payload) {}
}

export class DeletePreferencesFail implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_PREFERENCES_FAIL;

  constructor(public payload) {}
}

export class DeleteAllPreferences implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_ALL_PREFERENCES;

  constructor(public payload?) {}
}

export class DeleteAllPreferencesSuccess implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_ALL_PREFERENCES_SUCCESS;

  constructor(public payload?) {}
}

export class DeleteAllPreferencesFail implements ngrxAction {
  readonly type: ActionType = ActionType.DELETE_ALL_PREFERENCES_FAIL;

  constructor(public payload?) {}
}

export type Action =
  /**
   * API Calls below
   */
  | GetAllPreferences
  | GetAllPreferencesSuccess
  | GetAllPreferencesFail
  | SavePreferences
  | SavePreferencesSuccess
  | SavePreferencesFail
  | DeletePreferences
  | DeletePreferencesSuccess
  | DeletePreferencesFail
  | DeleteAllPreferences
  | DeleteAllPreferencesSuccess
  | DeleteAllPreferencesFail;
