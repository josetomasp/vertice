import { Action as ngrxAction } from '@ngrx/store';
import {
  RiskGraphRequest,
  RiskGraphType
} from '../../../shared/components/risk-graph/risk-graph.models';
import { RiskVolume } from '../models/dashboard.models';

export enum ActionType {
  RISK_GRAPH_DATA_REQUEST = '[Dashboard] Risk Graph Data Request',
  RISK_GRAPH_DATA_SUCCESS = '[Dashboard] Risk Graph Data Success',
  RISK_GRAPH_DATA_FAIL = '[Dashboard] Risk Graph Data Fail',
  RISK_GRAPH_SELECT_CATEGORY = '[Dashboard] Risk Graph Select Category',
  RISK_GRAPH_SELECT_LEVEL = '[Dashboard] Risk Graph Select Level'
}

export class RiskGraphDataRequest implements ngrxAction {
  type: ActionType = ActionType.RISK_GRAPH_DATA_REQUEST;

  constructor(public payload: RiskGraphRequest) {}
}

export class RiskGraphDataSuccess implements ngrxAction {
  type: ActionType = ActionType.RISK_GRAPH_DATA_SUCCESS;

  constructor(public payload: RiskVolume) {}
}

export class RiskGraphDataFail implements ngrxAction {
  type: ActionType = ActionType.RISK_GRAPH_DATA_FAIL;

  constructor(public payload) {}
}

export class RiskGraphSelectCategory implements ngrxAction {
  type: ActionType = ActionType.RISK_GRAPH_SELECT_CATEGORY;

  constructor(public payload: RiskGraphType) {}
}

export class RiskGraphSelectLevel implements ngrxAction {
  type: ActionType = ActionType.RISK_GRAPH_SELECT_LEVEL;

  constructor(public payload: RiskGraphType) {}
}

export type Action =
  | RiskGraphSelectCategory
  | RiskGraphSelectLevel
  | RiskGraphDataRequest
  | RiskGraphDataSuccess
  | RiskGraphDataFail;
