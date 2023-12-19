import { Injectable } from '@angular/core';

export enum TableCondition {
  OneMonthFilterNoData,
  ThreeMonthFilterNoData,
  SixMonthFilterNoData,
  PastYearFilterNoData,
  ServiceError,
  NoDataForQuery,
  NoSearchPerformed,
  NoDocuments,
  NoDataForGraph,
  NoReferralOverviewData,
  NoPendingAuthorizationData,
  NoOtherMedicationData
}

// Claim Overview Bar Fields
export const ACTIVITY_LABELS = {
  // creationDate: 'Creation Date',
  'claimant.fullName': 'Claimant name',
  injuryDate: 'Date of injury',
  injuryDescription: 'Injury description',
  'employer.name': 'Employer name',
  stateOfVenue: 'State of venue',
  'claimant.birthDate': 'Claimant dob',
  'claimant.ssn': 'Claimant ssn',
  phiMemberId: 'Pharmacy member id',
  'attorney.fullName': 'Attorney rep.',
  longTermCareFlag: 'Long term care',
  accidentDescription: 'Accident',
  claimReopenDate: 'Claim reopen date',
  claimClosedDate: 'Claim close date',
  apportionment: 'Apportionment',
  'customer.officeCode': 'Office code',
  medicalSettlementDate: 'Settlement date'
};
Object.freeze(ACTIVITY_LABELS);

// Claim Overview Bar labelChangeNames
export const ACTVITY_LABEL_ELEMENT_NAMES = {
  // creationDate: 'Creation Date',
  'claimant.fullName': 'claimantName',
  injuryDate: 'injuryDate',
  injuryDescription: 'injuryDescription',
  'employer.name': 'employerName',
  stateOfVenue: 'stateOfVenue',
  'claimant.birthDate': 'claimantDOB',
  'claimant.ssn': 'claimantSSN',
  phiMemberId: 'phiMemberId',
  'attorney.fullName': 'attorneyRep',
  longTermCareFlag: 'longTermCare',
  accidentDescription: 'accident',
  claimReopenDate: 'claimReopenDate',
  claimClosedDate: 'claimCloseDate',
  apportionment: 'apportionment',
  'customer.officeCode': 'officeCode',
  medicalSettlementDate: 'settlementDate'
};
Object.freeze(ACTVITY_LABEL_ELEMENT_NAMES);

export const CLAIM_SEARCH_LABELS = {
  claimNumber: 'Claim Number',
  dateOfInjury: 'Injury Date Range',
  riskLevel: 'Risk Level',
  claimantFirstName: 'Claimant First Name',
  claimantLastName: 'Claimant Last Name',
  assignedAdjuster: 'Assigned Adjuster',
  riskCategory: 'Risk Category',
  stateOfVenue: 'Benefit State'
};

/**
 * Service to store$ and distribute all messages to be shown on screen
 */
@Injectable({
  providedIn: 'root'
})
export class VerbiageService {
  public claimBannerFieldLabelMap = new Map<string, string>([]);
  tableVerbiage = new Map<TableCondition, string>([
    [TableCondition.NoDataForGraph, 'No Risk Trend Information Available'],
    [
      TableCondition.OneMonthFilterNoData,
      'There has been no activity in the past 30 days. Please adjust your search criteria and try again'
    ],
    [
      TableCondition.ThreeMonthFilterNoData,
      'There has been no activity in the past 90 days. Please adjust your search criteria and try again'
    ],
    [
      TableCondition.SixMonthFilterNoData,
      'There has been no activity in the past 6 months. Please adjust your search criteria and try again'
    ],
    [
      TableCondition.PastYearFilterNoData,
      'There has been no activity in the past year. Please adjust your search criteria and try again'
    ],
    [TableCondition.ServiceError, ''],
    [
      TableCondition.NoDataForQuery,
      'No data available for date range and/or filters. \n Please adjust your search criteria for more results.'
    ],
    [TableCondition.NoDocuments, 'No documents found for this claim.'],
    [TableCondition.NoSearchPerformed, 'Click search for results'],
    [
      TableCondition.NoReferralOverviewData,
      'No overview data found for this referral'
    ],
    [
      TableCondition.NoPendingAuthorizationData,
      'No pending authorization found'
    ],
    [
      TableCondition.NoOtherMedicationData,
      'No medications found for the entered NDC or drug name.'
    ]
  ]);

  constructor() {}

  getLabel(labelName): string {
    return ACTIVITY_LABELS[labelName];
  }

  getElementName(labelName): string {
    return ACTVITY_LABEL_ELEMENT_NAMES[labelName];
  }

  getTableVerbiage(tableCondition: TableCondition) {
    return this.tableVerbiage.get(tableCondition);
  }
}
