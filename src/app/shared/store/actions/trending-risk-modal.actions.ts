import { Action as ngrxAction } from '@ngrx/store';
import { TrendingRiskModalState } from '../models';

export enum ActionType {
  TRENDING_RISK_MODAL_DATA_REQUEST = '[Shared - Trending Risk Modal] Request Data',
  TRENDING_RISK_MODAL_DATA_REQUEST_SUCCESS = '[Shared - Trending Risk Modal] Request Data Succeeded',
  TRENDING_RISK_MODAL_DATA_REQUEST_FAILURE = '[Shared - Trending Risk Modal] Request Data Failed',

  UPDATE_RISK_LEVEL_MODAL_GRAPH_INTERVAL = '[Shared - Trending Risk Modal] Update Interval'
}

export class TrendingRiskModalDataRequest implements ngrxAction {
  readonly type: ActionType = ActionType.TRENDING_RISK_MODAL_DATA_REQUEST;

  constructor(public payload: { claimNumber: string }) {}
}

export class TrendingRiskModalDataRequestSuccess implements ngrxAction {
  readonly type: ActionType =
    ActionType.TRENDING_RISK_MODAL_DATA_REQUEST_SUCCESS;

  constructor(public payload: TrendingRiskModalState) {}
}

export class TrendingRiskModalDataRequestFailure implements ngrxAction {
  readonly type: ActionType =
    ActionType.TRENDING_RISK_MODAL_DATA_REQUEST_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateRiskLevelModalGraphInterval implements ngrxAction {
  readonly type: ActionType = ActionType.UPDATE_RISK_LEVEL_MODAL_GRAPH_INTERVAL;

  constructor(public payload: 'monthly' | 'quarterly') {}
}

export type Action =
  | TrendingRiskModalDataRequest
  | TrendingRiskModalDataRequestSuccess
  | TrendingRiskModalDataRequestFailure
  | UpdateRiskLevelModalGraphInterval;
