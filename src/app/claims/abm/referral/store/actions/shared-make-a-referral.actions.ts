import { createAction, props } from '@ngrx/store';

import { ReferralSubmitError } from '../models/fusion/fusion-make-a-referral.models';
import { ReferralSubmitMessage } from '../models/make-a-referral.models';
import { ErrorSharedMakeAReferral } from '../models/shared-make-a-referral.models';
import { ActionType } from './make-a-referral.actions';

export interface SuccessSharedSubmitResponse {
  [key: string]: {
    referralId: number;
    postSubmitData: { [key: string]: any };
  };
}

export const submitReferrals = createAction(
  '[ Make a Referral :: Shared ] Submit Referral',
  props<{  submitMessage: ReferralSubmitMessage }>()
);

export const submitReferralSuccess = createAction(
  '[Make a Referral :: Shared] Submit Referral Call Success' as ActionType,
  props<{
    claimNumber: string;
    customerId: string;
    coreReferralData: { [key: string]: { [key: string]: any } };
    successResponseFusion: SuccessSharedSubmitResponse;
    errorResponse?: ErrorSharedMakeAReferral[];
    showSuccessBanner: boolean;
    successfulServices: string[];
  }>()
);
export const submitReferralFail = createAction(
  '[Make a Referral :: Shared] Submit Referral Fail' as ActionType,
  props<{ errorResponse: ErrorSharedMakeAReferral[] }>()
);

export const submitReferralsDone = createAction(
  '[Make a Referral :: Shared] Submit Referral Done'
);

export const openDocumentUploadProgressModal = createAction(
  '[Make a Referral :: Shared] Open Document Upload Progress Modal'
);

export const resetUploadDocumentsMeta = createAction(
  '[Make a Referral :: Shared] Reset Upload Documents Meta'
);

export const completeReferralSubmit = createAction(
  '[Make a Referral :: Shared] Complete Referral Submit'
);

export const resetSharedMakeAReferralErrors = createAction(
  '[Make a Referral :: Shared] Reset Errors'
);

export const partialFail = createAction(
  '[Make a Referral :: Shared] Partial Fail'
);

export const resetSharedMakeAReferral = createAction(
  '[Make a Referral :: Shared] Reset'
);
