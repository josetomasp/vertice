import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { hexDecode } from '../../hexDecode';
export const getRouterState = createFeatureSelector('router');

export const getRouterParams = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => state.state.params
);

export const getPathSegments = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => state.state.url.split('/')
);

export const getEncodedClaimNumber = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => state.state.params.claimNumber
);
export const getDecodedClaimNumber = createSelector(
  getEncodedClaimNumber,
  (claimNumber) => hexDecode(claimNumber)
);
export const getEncodedCustomerId = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => {
    return state.state.params.customerId;
  }
);
export const getDecodedCustomerId = createSelector(
  getEncodedCustomerId,
  (customerId) => hexDecode(customerId)
);
export const getEncodedAuthorizationId = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) =>
    state && state.state ? state.state.params.authorizationId : null
);
export const getDecodedAuthorizationId = createSelector(
  getEncodedAuthorizationId,
  (authorizationId) => hexDecode(authorizationId)
);

export const getEncodedReferralId = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => state.state.params.referralId
);
export const getDecodedReferralId = createSelector(getEncodedReferralId, (id) =>
  hexDecode(id)
);

// ABM Authorization specific
export const getAuthorizationArchetype = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) => state.state.params.authArchetype
);
// PBM Authorization
export const getPbmServiceType = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) =>
    state && state.state ? state.state.params.serviceType : null
);

// PBM drug selected NDC for LOMN
export const getPbmLomnSelectedNdc = createSelector(
  getRouterState,
  (state: RouterReducerState<any>) =>
    state && state.state ? state.state.params.drugNdc : null
);
