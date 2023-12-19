import { mergeClone } from '@shared';
import * as _ from 'lodash';
import * as fromActivityTab from '../actions/activity-tab.actions';
import { ActivityTabState } from '../models/activity-tab.models';

export function activityTabReducer(
  state: ActivityTabState,
  action: fromActivityTab.Action
) {
  switch (action.type) {
    case fromActivityTab.ActionType.SELECT_ACTIVITY_TAB:
      return _.assign(_.clone(state), {
        ...state,
        activityTab: action.payload
      });
    case fromActivityTab.ActionType.UPDATE_COLUMN_SORT:
      return _.assign(_.clone(state), {
        ...state,
        columnSort: action.payload
      });
    case fromActivityTab.ActionType.UPDATE_COLUMN_VIEW:
      return _.assign(_.clone(state), {
        ...state,
        columnView: action.payload
      });
    case fromActivityTab.ActionType.UPDATE_FILTERS:
      return _.assign(_.clone(state), {
        ...state,
        filterPredicates: action.payload
      });
    case fromActivityTab.ActionType.INITIALIZED:
      return _.assign(_.clone(state), {
        ...state,
        initialized: true
      });
    case fromActivityTab.ActionType.REQUEST_ALL_ACTIVITY:
      return _.assign(_.clone(state), {
        ...state,
        isAllActivityLoading: true,
        dateRange: action.payload.dateRange
      });
    case fromActivityTab.ActionType.REQUEST_ALL_ACTIVITY_SUCCESS:
      return _.assign(_.clone(state), {
        ...state,
        isAllActivityLoading: false,
        allActivityData: action.payload.body.activities,
        serverErrors: [
          ...new Set([
            ...state.serverErrors,
            ...action.payload.body.serverErrors
          ])
        ]
      });
    case fromActivityTab.ActionType.REQUEST_ALL_ACTIVITY_FAIL:
      return _.assign(_.clone(state), {
        ...state,
        serverErrors: [...state.serverErrors, action.payload]
      });
    case fromActivityTab.ActionType.REQUEST_PENDING_ACTIVITY_SUCCESS:
      return mergeClone(state, {
        isPendingActivityLoading: false,
        pendingActivityData: action.payload.activities,
        serverErrors: [
          ...new Set([...state.serverErrors, ...action.payload.serverErrors])
        ]
      });

    case fromActivityTab.ActionType.PROCESS_PENDING_ACTIVITY:
      return _.assign(_.clone(state), {
        ...state,
        pendingActivityTotals: action.payload
      });

    case fromActivityTab.ActionType.SET_ACTIVITY_PAGER: {
      const tab = Object.keys(action.payload)[0];
      return {
        ...state,
        pagers: { ...state.pagers, [tab]: action.payload[tab] }
      };
    }

    default:
      return state;
  }
}
