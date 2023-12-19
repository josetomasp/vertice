import { createFeatureSelector } from '@ngrx/store';

export const referralStateKey = 'referral';

export const getReferralState = createFeatureSelector(referralStateKey);
