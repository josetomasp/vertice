export interface SharedMakeReferralState {
  submittingReferrals: boolean;
  totalDocuments: number;
  uploadedDocuments: number;
  complete: boolean;
  errors: ErrorSharedMakeAReferral[];
  showSuccessBanner: boolean;
  successfulServices: string[];
  partialFail: boolean;
}

export const sharedMakeReferralInitialState: SharedMakeReferralState = {
  totalDocuments: 0,
  uploadedDocuments: 0,
  submittingReferrals: false,
  complete: false,
  errors: [],
  showSuccessBanner: true,
  successfulServices: [],
  partialFail: false
};

export interface ErrorSharedMakeAReferral {
  service: string;
  serviceLabel?: string;
  error: { statusCode: string; messages: string[] };
}
