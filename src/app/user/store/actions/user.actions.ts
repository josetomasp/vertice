import { Action as ngrxAction } from '@ngrx/store';
import { UserInfo } from '../models/user.models';

export enum ActionTypes {
  USER_INFO_REQUEST = '[User] User Info Request',
  USER_INFO_SUCCESS = '[User] User Info Success',
  USER_INFO_FAIL = '[User] User Info Fail',
  USER_SET_INTERNAL_USER_CUSTOMER = '[User] Set Internal User Customer',
  TOGGLE_INTERNAL = '[User] toggle internal',
  SET_JARVIS_LINK_VISIBILITY = '[User] Set Jarvis Link Visibility'
}

export class UserInfoRequest implements ngrxAction {
  type: ActionTypes = ActionTypes.USER_INFO_REQUEST;

  constructor(public payload: any) {}
}

export class UserInfoSuccess implements ngrxAction {
  type: ActionTypes = ActionTypes.USER_INFO_SUCCESS;

  constructor(public payload: UserInfo) {}
}

export class UserInfoFail implements ngrxAction {
  type: ActionTypes = ActionTypes.USER_INFO_FAIL;

  constructor(public payload: any) {}
}

export class UserInfoSetInternalUserCustomer implements ngrxAction {
  type: ActionTypes = ActionTypes.USER_SET_INTERNAL_USER_CUSTOMER;

  constructor(public payload: string) {}
}

export class SetJarvisLinkVisibility implements ngrxAction {
  type: ActionTypes = ActionTypes.SET_JARVIS_LINK_VISIBILITY;
  constructor(public payload: { jarvisLinkHidden: boolean, jarvisSSOLink?: string }) {}
}
export class ToggleInternal implements ngrxAction {
  type = ActionTypes.TOGGLE_INTERNAL;
  constructor(public payload: any) {}
}

export type Action =
  | UserInfoRequest
  | UserInfoSuccess
  | UserInfoFail
  | UserInfoSetInternalUserCustomer
  | ToggleInternal
  | SetJarvisLinkVisibility;
