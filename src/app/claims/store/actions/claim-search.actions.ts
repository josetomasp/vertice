import { Action as ngrxAction } from '@ngrx/store';
import { ClaimSearchExport } from '../models';
import {
  ClaimSearchForm,
  ClaimSearchOptions,
  ClaimSearchResponse
} from '@shared/store/models';

export enum ActionType {
  CLAIM_SEARCH_OPTIONS_REQUEST = '[Claims - Claim Search] Request Options',
  CLAIM_SEARCH_OPTIONS_SUCCESS = '[Claims - Claim Search] Request Options Success',
  CLAIM_SEARCH_OPTIONS_FAIL = '[Claims - Claim Search] Request Options Fail',

  UPDATE_CLAIM_SEARCH_FORM = '[Claims - Claim Search] Update Claim Search Form',
  UPDATE_FILTER_SUMMARY = '[Claims - Claim Search] Update Filter Summary',

  CLAIM_SEARCH_REQUEST = '[Claims - Claim Search] Claim Search Request',
  CLAIM_SEARCH_SUCCESS = '[Claims - Claim Search] Claim Search Success',
  CLAIM_SEARCH_FAIL = '[Claims - Claim Search] Claim Search Fail',

  CLAIM_SEARCH_EXPORT_REQUEST = '[Claims - Claim Search Export] Claim Search Export Request',
  CLAIM_SEARCH_EXPORT_SUCCESS = '[Claims - Claim Search Export] Claim Search Export Success',
  CLAIM_SEARCH_EXPORT_FAIL = '[Claims - Claim Search Export] Claim Search Export Fail'
}

export class ClaimSearchExportRequest implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_EXPORT_REQUEST;

  constructor(public payload: ClaimSearchExport) {}
}

export class ClaimSearchExportSuccess implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_EXPORT_SUCCESS;

  constructor(public payload: any) {}
}

export class ClaimSearchExportFail implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_EXPORT_FAIL;

  constructor(public payload: any) {}
}

export class ClaimSearchRequest implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_REQUEST;

  constructor(public payload: ClaimSearchForm) {}
}

export class ClaimSearchSuccess implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_SUCCESS;

  constructor(public payload: ClaimSearchResponse) {}
}

export class ClaimSearchFail implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_FAIL;

  constructor(public payload: any) {}
}

export class ClaimSearchOptionsRequest implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_OPTIONS_REQUEST;

  constructor(public payload: any) {}
}

export class ClaimSearchOptionsSuccess implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_OPTIONS_SUCCESS;

  constructor(public payload: ClaimSearchOptions) {}
}

export class ClaimSearchOptionsFail implements ngrxAction {
  type: ActionType = ActionType.CLAIM_SEARCH_OPTIONS_FAIL;

  constructor(public payload: any) {}
}

export class UpdateClaimSearchForm implements ngrxAction {
  type: ActionType = ActionType.UPDATE_CLAIM_SEARCH_FORM;

  constructor(public payload: ClaimSearchForm) {}
}

export class UpdateFilterSummary implements ngrxAction {
  type: ActionType = ActionType.UPDATE_FILTER_SUMMARY;

  constructor(public payload: string) {}
}

export type Action =
  | ClaimSearchOptionsRequest
  | ClaimSearchOptionsSuccess
  | ClaimSearchOptionsFail
  | UpdateClaimSearchForm
  | UpdateFilterSummary
  | ClaimSearchExportRequest
  | ClaimSearchExportSuccess
  | ClaimSearchExportFail
  | ClaimSearchRequest
  | ClaimSearchSuccess
  | ClaimSearchFail;
