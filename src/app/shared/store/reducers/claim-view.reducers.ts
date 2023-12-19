import * as _ from 'lodash';
import * as fromClaimViewAction from '../actions/claim-view.actions';

export function claimViewRootReducer(state, action) {
  switch (action.type) {
    case fromClaimViewAction.ActionType.CLAIM_VIEW_SEARCH_SUCCESS:
      return _.assign(_.clone(state), {
        claimsSearchResults: [...action.payload.claims],
        totalNumberOfClaimsFound: action.payload.totalNumberOfClaimsFound
      });
    default:
      return state;
  }
}
