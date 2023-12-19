import { Action as ngrxAction } from '@ngrx/store';

export enum ActionType {
  SET_CLAIM_OVERVIEW_BAR_FIELDS = '[Referral Module] Set Claim Overview Bar Fields',
  RESET_REFERRAL_STATE = '[Referral Module] Set Referals to Inital State'
}

export class SetClaimOverviewBarFields implements ngrxAction {
  readonly type = ActionType.SET_CLAIM_OVERVIEW_BAR_FIELDS;

  constructor(public payload: any) {}
}

export class ResetReferralToInitialState implements ngrxAction {
  readonly type = ActionType.RESET_REFERRAL_STATE;

  constructor(public payload: any) {}
}

export type Action = SetClaimOverviewBarFields | ResetReferralToInitialState;
