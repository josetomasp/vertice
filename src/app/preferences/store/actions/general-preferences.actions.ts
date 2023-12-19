import { Action } from '@ngrx/store';
import { Preference } from '../models/preferences.models';

export enum ActionTypes {
  /**
   * Global Preferences
   */
  CREATE_GLOBAL_PREFERENCE = '[Preferences] Create Global Preference',
  CREATE_GLOBAL_PREFERENCE_SUCCESS = '[Preferences] Create Global Preference Success',
  CREATE_GLOBAL_PREFERENCE_FAIL = '[Preferences] Create User Preference Fail',
  PATCH_GLOBAL_PREFERENCE = '[Preferences] Patch Global Preference',
  PATCH_GLOBAL_PREFERENCE_SUCCESS = '[Preferences] Patch Global Preference Success',
  PATCH_GLOBAL_PREFERENCE_FAIL = '[Preferences] Patch Global Preference Fail'
}

export class PatchGlobalPreference implements Action {
  readonly type: ActionTypes = ActionTypes.PATCH_GLOBAL_PREFERENCE;

  constructor(public payload: Preference<any>) {}
}

export class PatchGlobalPreferenceSuccess implements Action {
  readonly type: ActionTypes = ActionTypes.PATCH_GLOBAL_PREFERENCE_SUCCESS;

  constructor(public payload: boolean) {}
}

export class PatchGlobalPreferenceFail implements Action {
  readonly type: ActionTypes = ActionTypes.PATCH_GLOBAL_PREFERENCE_FAIL;

  constructor(public payload: boolean) {}
}

export class CreateGlobalPreference implements Action {
  readonly type: ActionTypes = ActionTypes.CREATE_GLOBAL_PREFERENCE;

  constructor(public payload: any) {}
}

export class CreateGlobalPreferenceSuccess implements Action {
  readonly type: ActionTypes = ActionTypes.CREATE_GLOBAL_PREFERENCE_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateGlobalPreferenceFail implements Action {
  readonly type: ActionTypes = ActionTypes.CREATE_GLOBAL_PREFERENCE_FAIL;

  constructor(public payload: any) {}
}

export type Action =
  | PatchGlobalPreference
  | PatchGlobalPreferenceSuccess
  | PatchGlobalPreferenceFail
  | CreateGlobalPreference
  | CreateGlobalPreferenceSuccess
  | CreateGlobalPreferenceFail;
