import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from '../models/dashboard.models';

const getDashboardState = createFeatureSelector('dashboard');

export const getCurrentMetrics = createSelector(
  getDashboardState,
  (state: DashboardState) => state.currentMetrics
);
export const getCurrentSeriesData = createSelector(
  getDashboardState,
  (state: DashboardState) => state.currentSeriesData
);

export const getCurrentGraph = createSelector(
  getDashboardState,
  (state: DashboardState) => state.currentGraph
);

export const isRiskGraphLoading = createSelector(
  getDashboardState,
  (state: DashboardState) => state.isLoading
);

export const didRiskGraphLoadOnce = createSelector(
  getDashboardState,
  (state: DashboardState) => state.didLoadOnce
);
