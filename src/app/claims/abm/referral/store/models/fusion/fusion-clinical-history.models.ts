export interface ClinicalHistoryPeerReviewDetail {
  peerReviewDate: string;
  reviewer: string;
  decision: string;
}

export interface ClinicalHistoryBodyPartDetail {
  title: string;
  subTitle: string;
  columns: { columnName: string | number; columnLabel: string }[];
  tableData: { evaluationDescription: string; [key: string]: string }[];
}

export interface ClinicalHistoryDetail {
  title: string;
  anticipatedDischargeDate: string;
  dischargeDate: string;
  mdVisitScheduleDate: string;
  peerReview: ClinicalHistoryPeerReviewDetail[];
  partsOfBody: ClinicalHistoryBodyPartDetail[];
}

export interface ClinicalHistoryExport {
  encodedClaimNumber: string;
  claimantName: string;
  encodedCustomerId: string;
  encodedReferralId: string;
  exportType: 'PDF' | 'EXCEL';
  indexNumber: number;
}

export interface UIFusionClinicalHistory {
  clinicalHistory: ClinicalHistoryDetail[];
}

export interface FusionClinicalHistoryState extends UIFusionClinicalHistory {
  isLoading: boolean;
  errors: string[];
}

export const FUSION_CLINICAL_HISTORY_INITIAL_STATE: FusionClinicalHistoryState = {
  clinicalHistory: [],
  isLoading: false,
  errors: []
};
