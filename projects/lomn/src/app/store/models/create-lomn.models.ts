import {
  AuthorizationLineItem,
  AuthorizationLineItemPrescriber
} from './pbm-authorization-information.model';

export interface LomnEligibility {
  exparteWarningMessage: string;
  exparteCopiesRequired: boolean;
  lomnSupported: boolean;
}

export interface LOMNSubmitContactInfo {
  address1: string;
  address2: string;
  city: string;
  fax: string;
  firstName: string;
  lastName: string;
  middle: string;
  state: string;
  zip: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface LOMNSubmitMessage {
  claimNo: string;
  comment: string;
  compound: boolean;
  customerID: string;
  dateFilled: string;
  daysSupply: number;
  nabp: string;
  ndc: string;
  npi: string;
  paperLineItemKey?: number;
  posLineItemKey?: number;
  prescriberFax: string;
  quantity: number;
  attorney: LOMNSubmitContactInfo;
  claimant: LOMNSubmitContactInfo;
}

export interface LOMNLineItemFormValue {
  compound: boolean;
  dateFilled: string;
  daysSupply: number;
  displayNotes: string;
  drugDisplayName: string;
  nabp: string;
  ndc: string;
  npi: string;
  paperLineItemKey?: number;
  posLineItemKey?: number;
  prescriber: AuthorizationLineItemPrescriber;
  prescriberFax: string;
  quantity: number;
}

/**
 * This is the same model as the AuthorizationLineItem because only certain values but we
 * don't know exactly where some of the info comes from, so for now, they will
 * look the same.
 **/

export interface LomnMedicationOption {
  nabp: string;
  ndc: string;
  npi: string;
  drugDisplayName: string;
  paperLineItemKey: number;
  posLineItemKey: number;
  prescriberFax: string;
  dateFilled: string;
  compound: boolean;
  daysSupply: number;
  quantity: number;
}

export interface LOMNAttorneyInformationFormState {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  primaryFax: string;
  email: string;
  fax: string;
}

export interface LOMNClaimantInformationFormState {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  primaryFax: string;
}

export interface LOMNAttorneyAndClaimantInformationFormState {
  attorneyInvolvement: boolean;
  claimantInformation: LOMNClaimantInformationFormState;
  attorneyInformation?: LOMNAttorneyInformationFormState;
}

export interface LOMNWizardState {
  exparteWarningMessage: string;
  exparteCopiesRequired: boolean;
  letterTypes: { [key: string]: string };
  wizardFormState: LOMNWizardFormState;
  wizardResponse: LOMNWizardFormResponse;
  submittingCreateLOMN: boolean;
}

export interface CreateLOMNSubmitMessage {
  claimNo: string;
  comment: string;
  customerID: string;
  dateFilled: string;
  nabp: string;
  ndc: string;
  npi: string;
  prescriberFax: string;
  daysSupply: number;
  paperLineItemKey: number;
  posLineItemKey: number;
  quantity: number;
  compound: boolean;
  paperBillKey: number;
  claimant: LOMNSubmitContactInfo;
  attorney?: LOMNSubmitContactInfo;
}

export interface LOMNWizardFormState {
  medicationList: AuthorizationLineItem[];
  attorneyAndClaimantInformation: LOMNAttorneyAndClaimantInformationFormState;
}

export interface LOMNWizardFormResponse {
  errors?: string[];
  successful: boolean;
}
