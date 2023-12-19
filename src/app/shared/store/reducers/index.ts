import { Action, combineReducers } from '@ngrx/store';
import { claimReducer } from '@shared/store/reducers/claim.reducers';
import { reducer as trendingModalReducer } from './trending-risk-modal.reducers';
import { initialSharedState } from '../models';
import { ActionType as SharedStateActionTypes } from '../actions/shared.actions';
import { prescriptionHistoryReducer } from '@shared/store/reducers/prescriptionHistory.reducers';
import { clinicalHistoryReducer } from '@shared/store/reducers/clinicalHistory.reducers';
import { claimViewRootReducer } from '@shared/store/reducers/claim-view.reducers';

/**
 * This is the preferred pattern to follow for splitting states across a feature state.
 * This prevents the type confusion when you have multiple calls to different reducers in one reducer.
 */
export function reducer(state, action: Action) {
  switch (action.type) {
    case SharedStateActionTypes.RESET_SHARED_STATE:
      return initialSharedState;

    default: {
      return combineReducers(
        {
          claimSearchState: claimViewRootReducer,
          trendingRiskModalState: trendingModalReducer,
          claim: claimReducer,
          prescriptionHistory: prescriptionHistoryReducer,
          clincalHistory: clinicalHistoryReducer
        },
        initialSharedState
      )(state, action);
    }
  }
}
