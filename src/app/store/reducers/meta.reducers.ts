import { ActionType } from '../../claim-view/store/actions/claim-view.actions';
import { claimViewInitialState } from '../../claim-view/store/models/claim-view.models';
import { RootState } from '../models/root.models';

export function clearClaimView(reducer) {
  return function(state: RootState, action) {
    if (action.type === ActionType.RESET_CLAIM_VIEW) {
      state.claimview = claimViewInitialState;
    }
    return reducer(state, action);
  };
}
