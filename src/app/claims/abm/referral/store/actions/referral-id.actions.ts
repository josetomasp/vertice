import { Action as ngrxAction } from '@ngrx/store';
import {
  ICDCode,
  ICDCodeSaveRequest,
  ReferralOverviewCardState,
  ReferralOverviewQuery
} from '../models/referral-id.models';

export enum ActionType {
  REQUEST_REFERRAL_OVERVIEW = '[Referral ID] Request Referral Overview',
  REQUEST_REFERRAL_OVERVIEW_SUCCESS = '[Referral ID] Request Referral Overview Success',
  REQUEST_REFERRAL_OVERVIEW_FAIL = '[Referral ID] Request Referral Overview Fail',

  SAVE_REFERRAL_ICDCODES = '[Referral ID] Save Referral ICD Codes',
  SAVE_REFERRAL_ICDCODES_SUCCESS = '[Referral ID] Save Referral ICD Codes Success',
  SAVE_REFERRAL_ICDCODES_FAIL = '[Referral ID] Save Referral ICD Codes Fail',

  ICDCODE_MODAL_SAVEBUTTON_STATE = '[Referral ID] Set ICD Code Modal Save Button State',
  SET_REFERRAL_TYPE = '[Referral ID] Set Referral Type'
}

export class RequestReferralOverview implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_OVERVIEW;

  constructor(public payload: ReferralOverviewQuery) {}
}

export class RequestReferralOverviewSuccess implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_OVERVIEW_SUCCESS;

  constructor(public payload: ReferralOverviewCardState) {}
}

export class RequestReferralOverviewFail implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_OVERVIEW_FAIL;

  constructor(public payload: string) {}
}

export class SaveReferralICDCodes implements ngrxAction {
  readonly type = ActionType.SAVE_REFERRAL_ICDCODES;

  constructor(public payload: ICDCodeSaveRequest) {}
}

export class SetICdCodeModalSaveButtonState implements ngrxAction {
  readonly type = ActionType.ICDCODE_MODAL_SAVEBUTTON_STATE;

  constructor(public payload: boolean) {}
}

export class SaveReferralICDCodesSuccess implements ngrxAction {
  readonly type = ActionType.SAVE_REFERRAL_ICDCODES_SUCCESS;

  constructor(public payload: ICDCode[]) {}
}

export class SaveReferralICDCodesFail implements ngrxAction {
  readonly type = ActionType.SAVE_REFERRAL_ICDCODES_FAIL;

  constructor(public payload: any) {}
}

export type Action =
  | SetICdCodeModalSaveButtonState
  | RequestReferralOverview
  | RequestReferralOverviewSuccess
  | RequestReferralOverviewFail
  | SaveReferralICDCodes
  | SaveReferralICDCodesSuccess
  | SaveReferralICDCodesFail;
