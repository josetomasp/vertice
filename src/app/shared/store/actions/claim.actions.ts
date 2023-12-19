import { Action as ngrxAction } from '@ngrx/store';
import { ClaimBannerField, ClaimV3 } from '@shared/store/models/claim.models';
import { ClaimQuery } from '../../../store/models/claimQuery';

export enum ActionType {
  REQUEST_CLAIM_V2 = '[Shared - Claim] Request ClaimV2',
  REQUEST_CLAIM_V2_SUCCESS = '[Shared - Claim] Request ClaimV2 Success',
  REQUEST_CLAIM_V2_FAIL = '[Shared - Claim] Request ClaimV2 Fail',

  SET_CLAIM_BANNER_FIELDS = '[Shared - Claim] Set Claim Banner Fields'
}

export class RequestClaimV2 implements ngrxAction {
  readonly type = ActionType.REQUEST_CLAIM_V2;

  constructor(public payload: ClaimQuery) {}
}

export class RequestClaimV2Success implements ngrxAction {
  readonly type = ActionType.REQUEST_CLAIM_V2_SUCCESS;

  constructor(public payload: ClaimV3) {}
}

export class RequestClaimV2Fail implements ngrxAction {
  readonly type = ActionType.REQUEST_CLAIM_V2_FAIL;

  constructor(public payload: string) {}
}

export class SetClaimBannerFields implements ngrxAction {
  readonly type = ActionType.SET_CLAIM_BANNER_FIELDS;

  constructor(
    public payload: ClaimBannerField[],
    public loadingBanner: boolean
  ) {}
}

export type Action =
  | RequestClaimV2
  | RequestClaimV2Success
  | RequestClaimV2Fail
  | SetClaimBannerFields;
