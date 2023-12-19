import { RiskGraphType } from '@shared/components/risk-graph/risk-graph.models';
import * as _ from 'lodash';
import { ActionType } from '../actions/dashboard.actions';
import {
  dashboardInitialState,
  DashboardState,
  GraphSet
} from '../models/dashboard.models';

const initialState: DashboardState = dashboardInitialState;

export function reducer(state: DashboardState = initialState, action) {
  switch (action.type) {
    case ActionType.RISK_GRAPH_DATA_REQUEST:
      return _.assign(_.clone(state), { isLoading: true });

    case ActionType.RISK_GRAPH_DATA_SUCCESS:
      let riskTypeAssignemnt: GraphSet = { metrics: [], seriesData: [] };
      switch (state.currentGraph) {
        default:
        case RiskGraphType.CATEGORY:
          riskTypeAssignemnt = action.payload.riskCategoryVolumes;
          break;

        case RiskGraphType.LEVEL:
          riskTypeAssignemnt = action.payload.riskLevelVolumes;
          break;
      }

      return _.assign(_.clone(state), {
        riskGraphData: action.payload,
        currentMetrics: riskTypeAssignemnt.metrics,
        currentSeriesData: riskTypeAssignemnt.seriesData,
        isLoading: false,
        didLoadOnce: true
      });

    case ActionType.RISK_GRAPH_DATA_FAIL:
      return _.assign(_.clone(state), {
        isLoading: false,
        errors: [...state.errors, action.payload]
      });

    case ActionType.RISK_GRAPH_SELECT_CATEGORY:
      return _.assign(_.clone(state), {
        currentGraph: action.payload,
        currentMetrics: state.riskGraphData.riskCategoryVolumes.metrics,
        currentSeriesData: state.riskGraphData.riskCategoryVolumes.seriesData
      });

    case ActionType.RISK_GRAPH_SELECT_LEVEL:
      return _.assign(_.clone(state), {
        currentGraph: action.payload,
        currentMetrics: state.riskGraphData.riskLevelVolumes.metrics,
        currentSeriesData: state.riskGraphData.riskLevelVolumes.seriesData
      });
    default:
      return state;
  }
}
