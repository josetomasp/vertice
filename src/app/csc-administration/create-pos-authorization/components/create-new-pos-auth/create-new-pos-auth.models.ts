import { FormControl, FormGroup } from '@angular/forms';
import {
  PrescriberInformationLookupModel
} from '@modules/prescriber-information-lookup';

export interface PbmPrescriptionHistory {
  summary: PbmPrescriptionSummary;
  detail: PbmPrescriptionDetail;
}

export interface PbmPrescriptionSummary {
  prescriptionName: string;
  dateFilled: string;
  dateSubmitted: string;
  deaNumber: string;
  nabp: string;
  daysSupply: number;
  quantity: number;
}

export interface PbmPrescriptionDetail {
  ndc: string;

  submittedLabelName: string;
  prescriptionName?: string;
  prescriptionNote: string;
  dateOfService: string;
  primaryRejectCode: string;
  secondaryRejectCode: string;
  daysSupply: number;
  quantity: number;
  prescriberId: string;
  prescriberFirstName: string;
  prescriberLastName: string;
  prescriberPhone: string;
  brandGeneric?: string;
  inFormulary?: string;
  deaDrugClass?: string;
  previousDecision?: string;
  previousDecisionDate?: string;
  previousDecisionRequestedQuantity?: string;
  previousDecisionRequestedDaysSupply?: string;
  estimatedDaysSupplyOnHand?: string;
  awpUnitCost: number;
  isCompound: boolean;
  samaritanDoseApproved: boolean;
  compounds: PbmCompoundDetail[];
}

export interface PbmCompoundDetail {
  ndc: string;
  drugName: string;
  quantity: string;
}

export interface AddedPosAuthPrescriptions extends PbmPrescriptionHistory {
  selectedFC?: FormControl;
  addedPrescriptionsFG?: FormGroup;
  prescriberInformationLookupInitialValues?: PrescriberInformationLookupModel;
  disabled?: boolean;
  readonly?: boolean;
  manuallyAdded?: boolean;
}
export interface PbmExistingAuthorization {
  authorizationId: number;
  patientWaiting: boolean;
  authorizationType: string;
  readonly?: boolean;
  lineItems: PbmPrescriptionHistory[];
}

export interface CreatePosAuthRequestBody {
  phiMemberId: string;
  nabp: string;
  callerName: string;
  callerNumber: string;
  patientWaiting: boolean;
  internalNotes: string;
  details: PbmPrescriptionDetail[];
}
export interface AddLineItemPosAuthRequestBody {
  authorizationId: string;
  linesItems: PbmPrescriptionDetail[];
}

export interface CreatePosAuthSecondaryRejectCode {
  description: string;
  rejectCode: string;
}

export interface CreatePosAuthPrimaryRejectCode
  extends CreatePosAuthSecondaryRejectCode {
  secondaryRejectCodes: CreatePosAuthSecondaryRejectCode[];
}

export const imdbPosAuthRxHistoryRowData: PbmPrescriptionHistory[] = [
  {
    summary: {
      prescriptionName: 'Drug name 1',
      dateFilled: '2020-01-01',
      dateSubmitted: '2019-10-10',
      deaNumber: '1234564',
      nabp: '123456',
      daysSupply: 3,
      quantity: 6.6
    },
    detail: {
      prescriptionName: 'Drug name 1',
      prescriptionNote: null,
      ndc: null,
      submittedLabelName: '',
      dateOfService: null,
      primaryRejectCode: '770',
      secondaryRejectCode: null,
      daysSupply: 3,
      quantity: 6.6,
      prescriberId: null,
      prescriberFirstName: 'Bob',
      prescriberLastName: 'Smith',
      prescriberPhone: null,
      brandGeneric: 'Generic',
      inFormulary: 'Not Available',
      deaDrugClass: '2',
      previousDecision: 'Not Available',
      previousDecisionDate: 'Not Available',
      previousDecisionRequestedQuantity: 'Not Available',
      previousDecisionRequestedDaysSupply: 'Not Available',
      estimatedDaysSupplyOnHand: 'Not Available',
      awpUnitCost: 0.654,
      isCompound: false,
      samaritanDoseApproved: null,
      compounds: null
    }
  },
  {
    summary: {
      prescriptionName: 'Compound',
      dateFilled: '2021-09-01',
      dateSubmitted: '2021-10-10',
      deaNumber: '1234567',
      nabp: '65487',
      daysSupply: 10,
      quantity: 3.5
    },
    detail: {
      prescriptionName: 'Compound',
      prescriptionNote: null,
      ndc: null,
      submittedLabelName: '',
      dateOfService: null,
      primaryRejectCode: '654',
      secondaryRejectCode: null,
      daysSupply: 10,
      quantity: 3.5,
      prescriberId: null,
      prescriberFirstName: 'Bob',
      prescriberLastName: 'Smith',
      prescriberPhone: null,
      brandGeneric: 'Compound',
      inFormulary: 'Not Available',
      deaDrugClass: 'Compound',
      previousDecision: 'Not Available',
      previousDecisionDate: 'Not Available',
      previousDecisionRequestedQuantity: 'Not Available',
      previousDecisionRequestedDaysSupply: 'Not Available',
      estimatedDaysSupplyOnHand: 'Not Available',
      awpUnitCost: 0.123,
      isCompound: true,
      samaritanDoseApproved: null,
      compounds: [
        {
          ndc: '00228309311',
          quantity: '0.004',
          drugName: 'UNKNOWN'
        },
        {
          ndc: '00054023525',
          quantity: '4',
          drugName: 'UNKNOWN'
        }
      ]
    }
  }
];
