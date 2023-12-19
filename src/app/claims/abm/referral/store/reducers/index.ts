import { Action, combineReducers } from '@ngrx/store';
import { fusionReferralAuthorizationReducer } from './fusion/fusion-authorization.reducers';
import { fusionMakeAReferralReducer } from './fusion/fusion-make-a-referral.reducers';
import { makeAReferralSearchReducer } from '../../../../../search-nav/store/reducers/make-a-referral-search.reducer';
import { makeReferralReducer } from './make-a-referral.reducers';
import { referralAuthorizationReducer } from './referral-authorization.reducers';
import { referralIdReducer } from './referral-id.reducers';
import { referralRootReducer } from './referral.reducers';
import { sharedMakeAReferralReducer } from './shared-make-a-referral.reducers';

import { ActionType } from '../actions/referral.actions';
import { referralInitialState } from '../models';

export function reducer(state, action: Action) {
  switch (action.type) {
    case ActionType.RESET_REFERRAL_STATE:
      return referralInitialState;

    default: {
      return combineReducers({
        root: referralRootReducer,
        referralId: referralIdReducer,
        sharedMakeReferral: sharedMakeAReferralReducer,
        makeReferral: makeReferralReducer,
        makeAReferralSearch: makeAReferralSearchReducer,
        fusionMakeReferral: fusionMakeAReferralReducer,
        referralAuthorization: referralAuthorizationReducer,
        fusionAuthorization: fusionReferralAuthorizationReducer
      })(state, action);
    }
  }
}

export * from './referral-activity.reducers';
