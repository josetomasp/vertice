import { combineReducers } from '@ngrx/store';
import { reducer as claimSearchReducer } from './claim-search.reducers';

const claimsReducer = combineReducers({
  claimSearch: claimSearchReducer
});

export function reducer(state, action) {
  return claimsReducer(state, action);
}
