import { createSelector } from '@ngrx/store';
import { ClaimViewState } from '../models/claim-view.models';
import {
  IncidentsResponse,
  IncidentsTabState
} from '../models/incidents-tab.model';
import { getClaimViewState } from './claim-view.selectors';

export const getIncidentsState = createSelector(
  getClaimViewState,
  (state: ClaimViewState): IncidentsTabState => state.incidentsTab
);

export const getIsIncidentsLoading = createSelector(
  getIncidentsState,
  (state: IncidentsTabState): boolean => state.isLoading
);

export const didIncidentsTabFetchFromServer = createSelector(
  getIncidentsState,
  (state: IncidentsTabState): boolean => state.didFetchFromServer
);

export const getIncidentsResponse = createSelector(
  getIncidentsState,
  (state: IncidentsTabState): IncidentsResponse => state.incidentsResponse
);

export const getIncidentsErrors = createSelector(
  getIncidentsState,
  (state: IncidentsTabState): string[] => state.errors
);
