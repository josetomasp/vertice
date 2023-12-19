import {
  FusionClinicalAlert
} from '../../../../../abm/referral/store/models/fusion/fusion-authorizations.models';
import { PbmAuthorizationNote } from './pbm-authorization-note.models';

export interface AuthorizationLineItem {
  currentStateName: string;
  nabp: string;
  ndc: string;
  npi: string;
  prescriberPhone: string;
  drugDisplayName: string;
  drugGPI: string;
  transactionalMme?: number;
  claimMmeWithPrescription?: number;
  paperLineItemKey: number;
  posLineItemKey: number;
  prescriberFax: string;
  rejectCodes: string;
  rxNumber: string;
  inFormulary: boolean;
  prescriber: AuthorizationLineItemPrescriber;
  dateFilled: string;
  compound: boolean;
  daysSupply: number;
  quantity: number;
  letterType: string;
  samaritanDoseWarnings: string[];
  displayNotes: string;
  slrIndicator: string; // workflowTransactionPattern
  slrDrugName: string;
  drugItemName: string; // itemName
  brand: string; // multiSource
  totalAwp: number; // drug.currentAwpPrice
  deaClass: string; // deaClass
  isOneTimeOnly: boolean;
  lomnActionDate?: string;
  lomnAction?: string;
  previousDecisionNote?: string;
  workflowNotificationType?: string;
  currentUsersDecisionIsPreliminary?: boolean;
  twoLevelApproval: boolean;
  isPaper: boolean;
  estimatedDaysSupplyOnHand?: number;
  isRxNewToClaim?: boolean;
  previousDecision?: string;
  previousDecisionDate?: string;
  previousDecisionMessage?: string;
  previousDecisionPrimaryReasonCode?: string;
  previousDecisionPrimaryReasonDescription?: string;
  previousDecisionSecondaryReasonCode?: string;
  previousDecisionSecondaryReasonDescription?: string;
  mostRecentQuantity?: number;
  mostRecentDaysSupply?: number;
  reasons?: PbmAuthorizationReason[];
  datePickerPresets?: PbmAuthorizationDatePickerPreset[];
  alerts?: FusionClinicalAlert[];
  notes?: PbmAuthorizationNote[];
  ingredients?: PbmAuthorizationIngredient[];
  permissibleActionsForCurrentUser?: string[];
  // TODO: THIS WILL NEED TO BE MOVE TO A DIFFERENT MODEL ONCE WE KNOW HOW DIFFERENT THE PAPER MODEL IS
  totalAmount: number;
  originalTotalAmount: number;
  daw: number;
  amountEditable: boolean;
  message?: string;
  actionMessages?: string[];
  statusIndicators?: string[];
  // VER-5114 Added last decision
  lastDecisionDateTime?: string;
  lastDecisionComment?: string;
  lastDecisionAction?: string;
  lastDecisionPeriod?: number;
  lastDenialReason1?: string | number;
  lastDenialReason2?: string | number;
  lastDecisionUser?: string;
  isPriorAuthPreviouslyLoaded?: boolean;
  dispensingFee?: number;
  workflowTransactionPattern?: string;
  workflowGpi?: string;
  slrWorkflowName?: string;
  validNdc?: boolean;
}

export interface PbmAuthorizationDatePickerPreset {
  displayString: string;
  numberOfDays: number;
}

export interface PbmAuthorizationReason {
  description: string;
  ncpdpRejectCode: string;
}

export interface PbmAuthorizationIngredient {
  name: string;
  ndc: string;
  rejectCode: string;
  quantity: number;
  validNdc?: boolean;
}

export interface AuthorizationLineItemPrescriber {
  prescriberId: string;
  prescriberType: string;
  credential: string;
  name: string;
  foundById: string;
  foundByIdType: string;
  lastName: string;
  middleName: string;
  specialty: string[];
  npi: string;
  deaLicense: string;
  organizations: string[];
  organizationsSpecialty: string[];
  primaryAddress: string[];
  primaryPhone: string;
  primaryAltPhone: string;
  primaryFax: string;
  secondaryAddress: string[];
  secondaryPhone: string;
  secondaryAltPhone: string;
  secondaryFax: string;
}

export interface RxAuthorizationLineItemFormState {
  lineItemId?: number;
  action?: string;
  actionPeriodDate?: string;
  approvalPeriodType?: string;
  denialPeriodType?: string;
  primaryDenialReason?: any;
  secondaryDenialReason?: any;
  amount?: number;
  note?: string;
}
