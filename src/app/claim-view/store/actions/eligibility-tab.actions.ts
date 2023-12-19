import { Action as ngrxAction } from '@ngrx/store';
import { EligibilityTabState } from '../models/eligibility-tab.models';

export enum ActionType {
  SET_ELIGIBILITY_INFO = '[Claim View - Eligibility] Set Eligibility Info'
}

export class SetEligibilityInfo implements ngrxAction {
  readonly type = ActionType.SET_ELIGIBILITY_INFO;

  constructor(public payload: EligibilityTabState) {}
}

export type Action = SetEligibilityInfo;
