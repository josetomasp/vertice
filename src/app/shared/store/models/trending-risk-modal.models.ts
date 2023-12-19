import { Intervention } from './claim-search-models';

export interface RiskGraphData {
  name: string;
  series: { name: any; value: any }[];
}

export interface RiskLevelOverTimeRequestParameters {
  claimNumber: string;
  interval: string;
}

export interface RiskLevelOverTimeData {
  name: string;
  series: { name: any; value: any }[];
  interval: string;
}

export interface RiskDetail {
  riskLevel: string;
  riskLevelNumber: number;
  riskCategory: string;
  riskSubcategory: string;
  riskIndicator: string;
  riskDescription: string;
  atRiskOf: string;
  recommendations: Array<string>;
}

export interface TrendingRiskModalState {
  claimNumber: string;
  riskLevel: string;
  riskLevelNumber: number;
  claimantInformation: ClaimantInformation;
  riskGraphData: RiskGraphData;
  monthlyRiskGraphData: RiskGraphData;
  quarterlyRiskGraphData: RiskGraphData;
  riskDetails: Array<RiskDetail>;
  isLoading: boolean;
  interventions: Array<Intervention>;
}

export interface ClaimantInformation {
  claimantSSN: string;
  claimantName: string;
  claimantAge: number;
  dateOfBirth: string;
  address: string;
  employerName: string;
  claimMME: number;
  riskLevel: { riskIncreased: boolean; trendScoreDuration: number };
  claimNumber: string;
  riskFactors: number;
}

export const TRENDING_RISK_MODAL_INITIAL_STATE = {
  claimantInformation: {
    claimantSSN: '',
    claimantName: '',
    claimantAge: 0,
    dateOfBirth: '',
    address: '',
    employerName: '',
    claimMME: 0,
    riskLevel: { riskIncreased: false, trendScoreDuration: 0 },
    claimNumber: '',
    riskFactors: 0
  },
  riskGraphData: { name: '', series: [] },
  monthlyRiskGraphData: { name: '', series: [] },
  quarterlyRiskGraphData: { name: '', series: [] },
  riskDetails: [],
  isLoading: false,
  interventions: [],
  claimNumber: '',
  riskLevel: '',
  riskLevelNumber: 0
};
