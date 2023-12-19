import { Action as ngrxAction } from '@ngrx/store';
import { ClaimSearchForm, ClaimSearchResponse } from '@shared/store/models';

export enum ActionType {
  CLAIM_VIEW_SEARCH_REQUEST = '[Claim View - Claim Search] Claim Search Request',
  CLAIM_VIEW_SEARCH_SUCCESS = '[Claim View - Claim Search] Claim Search Success',
  CLAIM_VIEW_SEARCH_FAIL = '[Claim View - Claim Search] Claim Search Fail'
}

export class ClaimViewSearchRequest implements ngrxAction {
  type: ActionType = ActionType.CLAIM_VIEW_SEARCH_REQUEST;

  constructor(public payload: ClaimSearchForm) {}
}

export class ClaimViewSearchSuccess implements ngrxAction {
  type: ActionType = ActionType.CLAIM_VIEW_SEARCH_SUCCESS;

  constructor(public payload: ClaimSearchResponse) {}
}

export class ClaimViewSearchFail implements ngrxAction {
  type: ActionType = ActionType.CLAIM_VIEW_SEARCH_FAIL;

  constructor(public payload: any) {}
}

export type Action =
  | ClaimViewSearchRequest
  | ClaimViewSearchSuccess
  | ClaimViewSearchFail;
