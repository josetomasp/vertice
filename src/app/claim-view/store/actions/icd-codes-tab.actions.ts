import { Action as ngrxAction } from '@ngrx/store';
import { IcdCodeSet } from '../models/icd-codes.models';

export enum ActionType {
  ICD_CODES_REQUEST = '[Claim View - ICD Codes Tab] Fetch ICD Codes Request',
  ICD_CODES_SUCCESS = '[Claim View - ICD Codes Tab] ICD Codes Fetch Success',
  ICD_CODES_FAIL = '[Claim View - ICD Codes Tab] ICD Codes Fetch Fail'
}

export class IcdCodesRequest implements ngrxAction {
  type: ActionType = ActionType.ICD_CODES_REQUEST;

  constructor(public payload: IcdCodeSet) {}
}

export class IcdCodesRequestSuccess implements ngrxAction {
  type: ActionType = ActionType.ICD_CODES_SUCCESS;

  constructor(public payload: IcdCodeSet) {}
}

export class IcdCodesRequestFail implements ngrxAction {
  type: ActionType = ActionType.ICD_CODES_FAIL;

  constructor(public payload) {}
}

export type Action =
  | IcdCodesRequest
  | IcdCodesRequestSuccess
  | IcdCodesRequestFail;
