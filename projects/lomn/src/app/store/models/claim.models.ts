import { ClaimStatusEnum } from '@healthe/vertice-library';

export interface ClaimBannerField {
  name: string;
  label?: string;
  elementName?: string;
  value?: any;
  order?: number;
  showWhileCollapsed?: boolean;
  type?: string;
  width?: number;
  editable?: boolean;
}

export interface ClaimState {
  v3: ClaimV3;
  loadingV3: boolean;
  loadingV3Banner: boolean;
  claimBannerFields: ClaimBannerField[];
  errors: string[];
}

export interface ClaimV3 {
  header: Header;
  allowMAR: boolean;
  stateOfVenue: string;
  injuryDate: string;
  phiMemberId: string;
  modifiedDateTime: string;
  createdDateTime: string;
  claimOpenDate: string;
  claimReopenDate: string;
  claimClosedDate: string;
  claimReclosedDate: string;
  claimStatuses: Array<ClaimStatus>;
  drugFormulary: string;
  accidentDescription: string;
  injuryDescription: string;
  apportionmentFlag: boolean;
  apportionmentPercent: number;
  claimantPercent: number;
  otherApportionmentPercent: number;
  otherApportionmentDescription: string;
  controvertedClaimIndicator: string;
  coverageIndicator: string;
  lockedClaimIndicator: string;
  maintenanceOnlyIndicator: string;
  sensitivityFlag: boolean;
  longTermCareFlag: boolean;
  manuallyLockedUntilDate: string;
  claimLossDesignation: string;
  customerProvidedFileStatus: string;
  customerProvidedStatusIndicator: string;
  customerProvidedStatusText: string;
  customerProvidedDispositionCode: string;
  naicNumber: string;
  ncciCarrierCode: string;
  medicalSettlementType: string;
  medicalBenefitTerminationDate: string;
  medicalSettlementDate: string;
  policyCoverageEffectiveDate: string;
  policyCoverageTerminationDate: string;
  coveragePaymentType: string;
  policyNumberIdentifier: string;
  altClaimIdentifiers: Array<ClaimIdentifier>;
  claimant: Claimant;
  customer: Customer;
  employer: Employer;
  insurer: Insurer;
  adjuster: Adjuster;
  supervisor: Supervisor;
  caseManagers: Array<CaseManager>;
  tpa: TPA;
  attorney: Attorney;
  claimPolicy: ClaimPolicy;
  icdCodes: ICDCode[];
  miscData: MiscData;
}

export interface Header {
  transactionId: string;
  customerCode: string;
  hesClaimNumber: string;
  dateTimeStamp: string;
}

export interface ICDCode {
  icdCode: string;
  version: string;
  compensabilityDescription: string;
}

export interface ClaimStatus {
  productType: ProductType;
  claimStatus: ClaimStatusEnum;
  productTypeEffectiveDate: string;
  productTypeTerminationDate: string;
  productTypeHesInactiveDate: string;
}

export interface ClaimIdentifier {
  identifierValue: string;
  identifierType: string;
}

export interface Claimant {
  address: Address;
  communications: Array<Communication>;
  weight: number;
  height: number;
  birthDate: string;
  deathDate: string;
  gender: string;
  language: string;
  ssn: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface Employer {
  address: Address;
  communications: Array<Communication>;
  accountId: string;
  orgFEIN: string;
  name: string;
}

export interface Insurer {
  address: Address;
  communications: Array<Communication>;
  insurerCode: string;
  orgFEIN: string;
  name: string;
}

export interface Adjuster {
  address: Address;
  communications: Array<Communication>;
  adjusterIdentifier: string;
  fullName: string;
}

export interface Supervisor {
  address: Address;
  communications: Array<Communication>;
  supervisorIdentifier: string;
  fullName: string;
}

export interface CaseManager {
  address: Address;
  communications: Array<Communication>;
  caseManagerIdentifier: string;
  fullName: string;
  caseManagerRoleCode: string;
  caseManagerRoleDescription: string;
}

export interface TPA {
  address: Address;
  communications: Array<Communication>;
  tpaCode: string;
  orgFEIN: string;
  name: string;
}

export interface Attorney {
  address: Address;
  communications: Array<Communication>;
  attorneyIdentifier: string;
  firmName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface MiscData {
  claimSystem: string;
  fcciCompanyCode: string;
  mco: string;
  wcdNumber: string;
}

export interface Address {
  address1: string;
  address2?: string;
  state?: string;
  zip: string;
  city?: string;
}

export interface Communication {
  type: CommunicationType;
  communicationValue: string;
}

export interface Customer {
  accountCode: string;
  clientCode: string;
  officeCode: string;
  groupCode: string;
}

export interface ClaimPolicy {
  claimPolicyTypeByCustomerCode: string;
}

export type ProductType = 'ABM' | 'PBM';
export type Status =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED'
  | 'TERMINATED'
  | 'UNKNOWN';

export type CommunicationType =
  | 'EMAIL'
  | 'HOME'
  | 'WORK'
  | 'CELL'
  | 'FAX'
  | 'UNKNOWN';

export const claimV2InitialState = {
  adjuster: {},
  caseManagers: {},
  claimPolicy: {},
  insurer: {},
  miscData: {},
  stateOfVenue: '',
  supervisor: {},
  tpa: {},
  header: {
    transactionId: ''
  },
  injuryDate: '',
  phiMemberId: '',
  modifiedDateTime: '',
  createdDateTime: '',
  claimOpenDate: '',
  claimReopenDate: '',
  claimClosedDate: '',
  claimReclosedDate: '',
  claimStatuses: [],
  drugFormulary: '',
  accidentDescription: '',
  injuryDescription: '',
  apportionmentFlag: true,
  apportionmentPercent: 0,
  claimantPercent: 0,
  otherApportionmentPercent: 0,
  otherApportionmentDescription: '',
  controvertedClaimIndicator: '',
  coverageIndicator: '',
  lockedClaimIndicator: '',
  maintenanceOnlyIndicator: '',
  sensitivityFlag: false,
  longTermCareFlag: true,
  manuallyLockedUntilDate: '',
  claimLossDesignation: '',
  customerProvidedFileStatus: '',
  customerProvidedStatusIndicator: '',
  customerProvidedStatusText: '',
  customerProvidedDispositionCode: '',
  naicNumber: '',
  ncciCarrierCode: '',
  medicalSettlementType: '',
  medicalBenefitTerminationDate: '',
  medicalSettlementDate: '',
  policyCoverageEffectiveDate: '',
  policyCoverageTerminationDate: '',
  coveragePaymentType: '',
  policyNumberIdentifier: '',
  attorney: {
    fullName: ''
  } as Attorney,

  altClaimIdentifiers: [
    {
      identifierValue: '',
      identifierType: 'AGENCY_CLAIM_NUMBER'
    },
    {
      identifierValue: '',
      identifierType: 'ACQUISITION_CLAIM_NUMBER'
    }
  ],

  claimant: {
    address: {
      address1: '',
      address2: '',
      state: '',
      zip: ''
    },
    communications: [
      {
        type: 'UNKNOWN',
        communicationValue: ''
      },
      {
        type: 'UNKNOWN',
        communicationValue: ''
      },
      {
        type: 'UNKNOWN',
        communicationValue: ''
      }
    ],
    weight: 0,
    height: 0,
    birthDate: '',
    deathDate: '',
    gender: '',
    language: '',
    ssn: '',
    fullName: ''
  },

  customer: {
    accountCode: '',
    clientCode: '',
    officeCode: '',
    groupCode: ''
  },

  employer: {
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    },
    communications: [
      {
        type: 'UNKNOWN',
        communicationValue: ''
      },
      {
        type: 'UNKNOWN',
        communicationValue: ''
      }
    ],
    accountId: '',
    orgFEIN: '',
    name: ''
  },
  icdCodes: []
};

export interface Apportionment {
  apportionmentFlag: boolean;
  apportionmentPercent: number;
  claimantPercent: number;
  otherApportionmentPercent: number;
  otherApportionmentDescription: string;
}
