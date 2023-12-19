import { mergeClone } from 'src/app/shared/lib';
import * as fromIcdCodesTab from '../actions/icd-codes-tab.actions';
import { IcdCodesTabState } from '../models/icd-codes.models';

export function icdCodesReducer(
  state: IcdCodesTabState,
  action: fromIcdCodesTab.Action
) {
  switch (action.type) {
    case fromIcdCodesTab.ActionType.ICD_CODES_REQUEST:
      return mergeClone(state, { isLoading: true });

    case fromIcdCodesTab.ActionType.ICD_CODES_SUCCESS:
      return mergeClone(state, {
        isLoading: false,
        didFetchFromServer: true,
        icdCodeSet: action.payload
      });

    case fromIcdCodesTab.ActionType.ICD_CODES_FAIL:
      return mergeClone(state, { isLoading: false });

    default:
      return state;
  }
}
