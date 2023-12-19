import * as _ from 'lodash';
import { mergeClone } from '@shared/lib';
import { Action, ActionType } from '@shared/store/actions/shared.actions';

export function sharedReducer(state, action: Action) {
  switch (action.type) {
    case ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_FAIL:
      return mergeClone(state, {
        errors: [...state.errors, action.payload],
        isLoading: false
      });
  }

  return _.cloneDeep(state);
}
