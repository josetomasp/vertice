import { createSelector } from '@ngrx/store';
import { ReferralActivityState, ReferralNotesState } from '../models';
import { getReferralActivityState } from './referral-activity.selectors';

const getReferralNotesState = createSelector(
  getReferralActivityState,
  (state: ReferralActivityState) => state.referralNotes
);
export const getReferralNotes = createSelector(
  getReferralNotesState,
  (state: ReferralNotesState) => {
    return state.notes;
  }
);
export const getReferralNotesCount = createSelector(
  getReferralNotesState,
  (state: ReferralNotesState) => {
    return state.notes.length;
  }
);
