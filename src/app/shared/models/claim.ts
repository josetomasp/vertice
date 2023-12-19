import { ClaimStatusEnum } from '@healthe/vertice-library';
import { State } from './state.type';

export interface Claim {
  stateOfVenue: State;
  phiMemberId: string;
  injuryDate: string;
  injuryDescription: string;
  pbmClaimStatus: string;
  claimantName: string;
  employerOrgName: string;
}

export interface Employer {
  addresses: Array<Address>;
  orgName: string;
  orgFEIN: string;
}

export interface Address {
  address1: string;
  city: string;
  state: State;
}

export interface Claimant {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface ClaimHeader {
  customerCode: string;
  hesClaimNumber: string;
}

export interface ClaimStatus {
  productType: string;
  claimStatus: ClaimStatusEnum;
}
