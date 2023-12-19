import { RiskGraphType } from '@shared/components/risk-graph/risk-graph.models';

export interface GraphMetricItem {
  name: string;
  riskPercentage: number;
  riskIncreased: boolean;
}

export interface GraphSeriesItem {
  name: string;
  value: number;
}

export interface GraphSeries {
  name: string;
  series: GraphSeriesItem[];
}

export interface GraphSet {
  metrics: GraphMetricItem[];
  seriesData: GraphSeries[];
}

export interface RiskVolume {
  riskCategoryVolumes: GraphSet;
  riskLevelVolumes: GraphSet;
}

export interface PendingAuthorizationDashboardData {
  age: string;
  count: number;
}

export interface PendingAuthorizationDataByType {
  authorizationType: string;
  authorizationTypeLabel?: string;
  pendingAuthorizationDashboardData: PendingAuthorizationDashboardData[];
}

export interface PendingAuthorizationsGraphDataByAdjuster {
  assignedAdjuster: string;
  pendingAuthorizationDashboardDataByType: PendingAuthorizationDataByType[];
}

export interface DashboardState {
  riskGraphData: RiskVolume;
  currentGraph: RiskGraphType;
  currentMetrics: GraphMetricItem[];
  currentSeriesData: GraphSeries[];
  isLoading: boolean;
  didLoadOnce: boolean;
  errors: any[];
}

export const dashboardInitialState: DashboardState = {
  riskGraphData: {
    riskCategoryVolumes: { metrics: [], seriesData: [] },
    riskLevelVolumes: { metrics: [], seriesData: [] }
  },
  currentGraph: RiskGraphType.LEVEL,
  currentMetrics: [],
  currentSeriesData: [],
  isLoading: false,
  didLoadOnce: false,
  errors: []
};
