export interface RiskGraphDataPoint {
  value: any;
  name: any;
  series: string;
}

export enum RiskGraphType {
  CATEGORY = 'category',
  LEVEL = 'level'
}

export interface RiskCategoryMetric {
  riskPercentage: number;
  riskIncreased: boolean;
  categoryName: string;
}

export interface RiskGraphSeriesData {
  [key: string]: RiskGraphDataPoint;
}

export interface RiskGraphData {
  riskCategoryMetrics: Array<RiskCategoryMetric>;
  seriesData: RiskGraphSeriesData;
}

export interface RiskGraphAgeRange {
  fromDate: string;
  toDate: string;
}

export enum RiskGraphTimeInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export interface RiskGraphRequest {
  riskStartDate: string;
  riskEndDate: string;
  doiStartDate: string;
  doiEndDate: string;
  timeInterval: RiskGraphTimeInterval;
}
