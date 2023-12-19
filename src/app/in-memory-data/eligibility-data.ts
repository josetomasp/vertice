import { IMDBClaim, IMDBClaimV3 } from '../in-memory-data.service';
import { C000662ClaimV2 } from './claimV2/C000662';
import { DEF489ClaimV2 } from './claimV2/DEF489';

export const eligibility: IMDBClaim[] = [
  {
    claimNumber: '56594e31383236',
    claimantName: 'Drake Tremaine',
    phiMemberId: 'VYN1826TRV',
    injuryDate: '08/29/2004',
    injuryDescription: '2ND   3RD DEGREE BURNS OVER 32% OF LOWER BODY',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Dragons R US, CO Incorporated',
    stateOfVenue: 'TN',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '564d4438353235',
    claimantName: 'Salathiel McHard',
    phiMemberId: 'VMD8525TRV',
    injuryDate: '12/27/1988',
    injuryDescription: 'STRAIN',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Snakes r us',
    stateOfVenue: 'TX',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '444e4731383837',
    claimantName: 'Abel Skidmore',
    phiMemberId: 'DNG1887TRV',
    injuryDate: '05/30/1994',
    injuryDescription: 'STRAIN/BUTTOCKS',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Skidmore Inc.',
    stateOfVenue: 'VA',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '46323632343733',
    claimantName: 'Roswell Blair',
    phiMemberId: 'F262473TRV',
    injuryDate: '11/10/1974',
    injuryDescription: 'Inflammation',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Spirit Costumes',
    stateOfVenue: 'LA',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '45575638373339',
    claimantName: 'Fabian Ackers',
    phiMemberId: 'EWV8739TRV',
    injuryDate: '12/23/2013',
    injuryDescription: 'Dislocation',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Ackerson and Sons',
    stateOfVenue: 'WA',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '45583439363533',
    claimantName: 'Madoc Sellick',
    phiMemberId: 'EX49653TRV',
    injuryDate: '09/04/1983',
    injuryDescription: '2ND   3RD DEGREE BURNS OVER 32% OF LOWER BODY',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Slick Sellicks',
    stateOfVenue: 'NM',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '4e393539353636',
    claimantName: 'Ramsey Gifford',
    phiMemberId: 'N959566TRV',
    injuryDate: '03/25/1979',
    injuryDescription: 'LUMBAR STRAIN/ HERN DISC',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Bad Chefs Association',
    stateOfVenue: 'NY',
    customerId: '54524156454c455253'
  },
  {
    claimNumber: '4e393539353636',
    claimantName: 'Bevys Whitney',
    phiMemberId: 'FAU7225TRV',
    injuryDate: '10/05/2017',
    injuryDescription: 'LACERATION',
    pbmClaimStatus: 'ACTIVE',
    employerOrgName: 'Whitless Whitney',
    stateOfVenue: 'GA',
    customerId: '54524156454c455253'
  }
];

export const eligibilityV3: IMDBClaimV3[] = [
  C000662ClaimV2 as IMDBClaimV3,
  DEF489ClaimV2 as IMDBClaimV3
];
