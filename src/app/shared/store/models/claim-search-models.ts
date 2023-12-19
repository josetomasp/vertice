export interface ClaimsState {
  claimSearch: ClaimSearchState;
}

export interface ClaimSearchOptions {
  assignedAdjuster: Array<string>;
  riskCategory: Array<string>;
  riskLevel: Array<string>;
  stateOfVenue: Array<string>;
}

export interface ClaimSearchForm {
  claimNumber?: string;
  claimantLastName?: string;
  claimantFirstName?: string;
  assignedAdjuster?: string;
  dateOfInjury?: { fromDate: string; toDate: string };
  riskLevel?: string;
  riskCategory?: string;
  stateOfVenue?: string;
}

export interface ClaimSearchState extends ClaimSearchForm {
  claimsSearchOptions: ClaimSearchOptions;
  claimsSearchResults: Array<ClaimSearchClaim>;
  totalNumberOfClaimsFound: number;
  filterSummary: string;
  errors: Array<string>;
  isLoading: boolean;
}

export interface ClaimSearchResponse {
  totalNumberOfClaimsFound: number;
  claims: Array<ClaimSearchClaim>;
}

export interface ClaimSearchClaim {
  actionOccurred: boolean;
  claimantName: string;
  adjusterName: string;
  adjusterEmail: string;
  phiMemberId: string;
  claimNumber: string;
  dateOfInjury: string;
  daysSinceRiskLevelChange: number;
  interventions: Intervention[];
  latestActionDate: string;
  claimMME: number;
  previousActions: ClaimAction[];
  riskCategory: string[];
  riskIncreased: boolean;
  riskLevel: string;
  riskLevelNumber: number;
  snoozed: boolean;
  snoozedUntilDate: string;
  stateAndOfficeID: string;
}

export interface ClaimAction {
  type: string;
  date: string;
  status: string;
}

export interface Intervention {
  type: string;
  url: string;
  action: string;
}
