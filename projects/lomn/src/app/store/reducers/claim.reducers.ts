import { Action, ActionType } from '../../store/actions/claim.actions';
import { claimV2InitialState, ClaimV3 } from '../models/claim.models';

export function claimReducer(state, action: Action) {
  switch (action.type) {
    case ActionType.REQUEST_CLAIM_V2:
      return {
        ...state,
        v3: claimV2InitialState as ClaimV3,
        loadingV3: true,
        loadingV3Banner: true
      };
    case ActionType.REQUEST_CLAIM_V2_SUCCESS:
      return {
        ...state,
        v3: action.payload,
        loadingV3: false,
        loadingV3Banner: true
      };
    case ActionType.REQUEST_CLAIM_V2_FAIL:
      return {
        ...state,
        errors: [...state.errors, action.payload],
        loadingV3: false,
        loadingV3Banner: false
      };
    case ActionType.SET_CLAIM_BANNER_FIELDS:
      return {
        ...state,
        claimBannerFields: action.payload,
        loadingV3Banner: action.loadingBanner
      };
  }
  return state;
}
