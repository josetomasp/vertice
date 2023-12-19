import { combineReducers } from '@ngrx/store';
import { authorizationReducer } from './authorization-history.reducers';
import { fusionClinicalHistoryReducers } from './fusion/fusion-clinical-history.reducers';
import { referralActivityReducer } from './referral-activity.reducers';
import {
  ICDCode,
  ReferralIdState,
  ReferralOverviewCardState
} from '../models/referral-id.models';
import { Action, ActionType } from '../actions/referral-id.actions';
import { mergeClone } from '@shared';
import { referralIdInitialState } from '../models';

export function referralIdReducer(
  state: ReferralIdState,
  action
): ReferralIdState {
  return combineReducers({
    referralOverviewCard: referralOverviewCardReducer,
    referralActivity: referralActivityReducer,
    authorizationHistory: authorizationReducer,
    fusionClinicalHistory: fusionClinicalHistoryReducers
  })(state, action);
}

function referralOverviewCardReducer(
  state: ReferralOverviewCardState,
  action: Action
) {
  switch (action.type) {
    case ActionType.REQUEST_REFERRAL_OVERVIEW:
      return mergeClone(state, {
        ...referralIdInitialState.referralOverviewCard,
        isLoading: true
      });
    case ActionType.REQUEST_REFERRAL_OVERVIEW_SUCCESS:
      return mergeClone(state, {
        ...action.payload,
        isLoading: false
      });

    case ActionType.SAVE_REFERRAL_ICDCODES_SUCCESS:
      return mergeClone(state, {
        diagnosisCodeAndDescription: buildDiagnosisCodeAndDescription(
          action.payload
        ),
        icdCodes: action.payload,
        isSaving: false
      });
    case ActionType.REQUEST_REFERRAL_OVERVIEW_FAIL:
      return mergeClone(state, {
        errors: [...state.errors, action.payload],
        isLoading: false
      });
    case ActionType.SAVE_REFERRAL_ICDCODES:
      return mergeClone(state, { isSaving: true, icdCodeSaveDisabled: true });
    case ActionType.SAVE_REFERRAL_ICDCODES_FAIL:
      return mergeClone(state, { isSaving: false, icdCodeSaveDisabled: false });
    case ActionType.ICDCODE_MODAL_SAVEBUTTON_STATE:
      return mergeClone(state, {
        icdCodesModal: { icdCodeSaveDisabled: action.payload }
      });
    default:
      return state;
  }
}

function buildDiagnosisCodeAndDescription(IcdList: ICDCode[]) {
  let retVal: string[] = [];
  IcdList.forEach((icd) => {
    retVal.push(icd.icdCode + ' - ' + icd.icdDescription);
  });

  return retVal;
}
