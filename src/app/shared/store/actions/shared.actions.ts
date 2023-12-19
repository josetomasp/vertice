import { Action as ngrxAction } from '@ngrx/store';
import { SnoozeClaimActionsQuery } from 'src/app/claims/store';

export enum ActionType {
  SNOOZE_CLAIM_RISK_ACTIONS_REQUEST = '[Claims - Claim Search] Snooze Claim Risk Actions Request',
  SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_SUCCESS = '[Claims - Claim Search] Snooze Claim Risk Actions Request Success',
  SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_FAIL = '[Claims - Claim Search] Snooze Claim Risk Actions Request Fail',

  RESET_SHARED_STATE = '[Shard State] Reset'
}

export class SnoozeClaimRiskActionsRequest implements ngrxAction {
  readonly type: ActionType = ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST;

  constructor(public payload: SnoozeClaimActionsQuery) {}
}

export class SnoozeClaimRiskActionsRequestSuccess implements ngrxAction {
  readonly type: ActionType =
    ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_SUCCESS;

  constructor(public payload: any) {}
}

export class SharedStateReset implements ngrxAction {
  readonly type: ActionType = ActionType.RESET_SHARED_STATE;

  constructor(public payload: any) {}
}

export class SnoozeClaimRiskActionsRequestFail implements ngrxAction {
  readonly type: ActionType = ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_FAIL;

  constructor(public payload: any) {}
}

export type Action =
  | SharedStateReset
  | SnoozeClaimRiskActionsRequest
  | SnoozeClaimRiskActionsRequestSuccess
  | SnoozeClaimRiskActionsRequestFail;
