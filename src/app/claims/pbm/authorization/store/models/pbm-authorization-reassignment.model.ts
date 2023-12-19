export interface PbmAuthClaimReassignmentState {
  isSearching: boolean;
  searchResponse: PbmAuthSearchClaimResponse[];
}

export interface PbmAuthSearchClaimRequest {
  claimNumber?: string;
  claimantFirstName?: string;
  claimantLastName?: string;
  claimantSsn?: string;
  injuryEndDate?: string;
  injuryStartDate?: string;
}

export interface PbmAuthSearchClaimResponse {
  abmClaimStatus: string;
  adjusterFirstName: string;
  adjusterFullName: string;
  adjusterLastName: string;
  claimNumber: string;
  claimantBirthDate: string;
  claimantFirstName: string;
  claimantFullName: string;
  claimantLastName: string;
  claimantSsn: string;
  customerCode: string;
  customerOfficeCode: string;
  employerName: string;
  pbmClaimStatus: string;
  phiMemberId: string;
  stateOfVenue: string;
}

export interface PbmAuthSubmitClaimRequest {
  fromAuthorizationId: number;
  toPhiMemberId?: string;
  claimNumber?: string;
}
