import { mergeClone } from 'src/app/shared/lib';
import * as fromIncidentsTab from '../actions/incidents-tab.actions';
import { IncidentsTabState } from '../models/incidents-tab.model';

export function incidentsReducer(
  state: IncidentsTabState,
  action: fromIncidentsTab.Action
) {
  switch (action.type) {
    case fromIncidentsTab.ActionType.INCIDENTS_REQUEST:
      return mergeClone(state, { isLoading: true });

    case fromIncidentsTab.ActionType.INCIDENTS_SUCCESS:
      return mergeClone(state, {
        isLoading: false,
        didFetchFromServer: true,
        incidentsResponse: action.payload
      });

    case fromIncidentsTab.ActionType.INCIDENTS_FAIL:
      return mergeClone(state, {
        isLoading: false,
        errors: action.payload
      });

    default:
      return state;
  }
}
