import { Action as ngrxAction } from '@ngrx/store';
import {
  IncidentsQuery,
  IncidentsResponse
} from '../models/incidents-tab.model';

export enum ActionType {
  INCIDENTS_REQUEST = '[Claim View - Incidents Tab] Fetch Incidents Request',
  INCIDENTS_SUCCESS = '[Claim View - Incidents Tab] Incidents Fetch Success',
  INCIDENTS_FAIL = '[Claim View - Incidents Tab] Incidents Fetch Fail'
}

export class IncidentsRequest implements ngrxAction {
  type: ActionType = ActionType.INCIDENTS_REQUEST;

  constructor(public payload: IncidentsQuery) {}
}

export class IncidentsRequestSuccess implements ngrxAction {
  type: ActionType = ActionType.INCIDENTS_SUCCESS;

  constructor(public payload: IncidentsResponse) {}
}

export class IncidentsRequestFail implements ngrxAction {
  type: ActionType = ActionType.INCIDENTS_FAIL;

  constructor(public payload) {}
}

export type Action =
  | IncidentsRequest
  | IncidentsRequestSuccess
  | IncidentsRequestFail;
