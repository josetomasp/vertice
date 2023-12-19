import { ActionType } from '../actions/eligibility-tab.actions';

export function eligibilityReducer(state, action) {
  switch (action.type) {
    case ActionType.SET_ELIGIBILITY_INFO:
      return action.payload;
  }
  return state;
}
