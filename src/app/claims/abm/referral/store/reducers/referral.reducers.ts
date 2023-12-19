import { mergeClone } from '@shared';
import { Action, ActionType } from '../actions/referral.actions';
import { ReferralRootState } from '../models/referral.models';

export function referralRootReducer(state: ReferralRootState, action: Action) {
  switch (action.type) {
    case ActionType.SET_CLAIM_OVERVIEW_BAR_FIELDS:
      return mergeClone(state, {
        claimantOverviewBar: { fields: action.payload }
      });
  }
  return state;
}
