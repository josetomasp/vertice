import * as _ from 'lodash';
import { mergeClone } from '@shared/lib';
import * as fromSharedActions from '../actions/trending-risk-modal.actions';
import { TrendingRiskModalState } from '../models';

export function reducer(
  state: TrendingRiskModalState,
  action: fromSharedActions.Action
) {
  switch (action.type) {
    // BEGIN ACTIONS FOR ENTIRE MODAL DATA
    case fromSharedActions.ActionType.TRENDING_RISK_MODAL_DATA_REQUEST:
      return mergeClone(state, {
        monthlyRiskGraphData: {
          ...state.monthlyRiskGraphData
        },
        claimantInformation: {
          riskLevel: {
            riskIncreased: action.payload.riskIncreased,
            trendScoreDuration: action.payload.daysSinceRiskLevelChange
          }
        }
      });
    case fromSharedActions.ActionType.TRENDING_RISK_MODAL_DATA_REQUEST_SUCCESS:
      return mergeClone(state, {
        claimantInformation: { ...action.payload.claimantInformation },
        monthlyRiskGraphData: action.payload.monthlyRiskGraphData,
        quarterlyRiskGraphData: action.payload.quarterlyRiskGraphData,
        riskGraphData: action.payload.monthlyRiskGraphData,
        riskDetails: action.payload.riskDetails,
        errors: [],
        isLoading: false
      });
    case fromSharedActions.ActionType.TRENDING_RISK_MODAL_DATA_REQUEST_FAILURE:
      return mergeClone(state, {
        claimantInformation: null,
        monthlyRiskGraphData: null,
        quarterlyRiskGraphData: null,
        riskDetails: null,
        errors: [action.payload],
        isLoading: false
      });
    case fromSharedActions.ActionType.UPDATE_RISK_LEVEL_MODAL_GRAPH_INTERVAL:
      return mergeClone(state, {
        riskGraphData: state[`${action.payload}RiskGraphData`]
      });
  }

  return _.cloneDeep(state);
}
