export enum ActionType {
  SET_CLAIM_BANNER_FIELDS_SUCCESS = '[Claim View - Root] Set Claim Banner Data Success',

  RESET_CLAIM_VIEW = '[Claim View - Root] Reset Claim View'
}

export class SetClaimBannerFieldsSuccess {
  readonly type: ActionType = ActionType.SET_CLAIM_BANNER_FIELDS_SUCCESS;

  constructor(public payload) {}
}

export class ResetClaimView {
  readonly type: ActionType = ActionType.RESET_CLAIM_VIEW;
}

export type Action = SetClaimBannerFieldsSuccess | ResetClaimView;
