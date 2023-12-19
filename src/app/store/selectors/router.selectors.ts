import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { hexDecode } from '@shared/lib/formatters/hexDecode';
import { RouterStateUrl } from '../models/root.models';
import { Params } from '@angular/router';
import { ReferralAuthorizationArchetype } from '../../claims/abm/referral/referralId/referral-authorization/referral-authorization.models';
import { PbmAuthorizationServiceType } from '../../claims/pbm/authorization/store/models/pbm-authorization-service-type.models';

export const getRouterState = createFeatureSelector('router');

export const getRouterParams = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): Params => state.state.params
);

export const getPathSegments = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string[] =>
    state.state.url.split('/')
);

export const getEncodedClaimNumber = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string =>
    state.state.params.claimNumber
);
export const getDecodedClaimNumber = createSelector(
  getEncodedClaimNumber,
  (claimNumber): string => hexDecode(claimNumber)
);
export const getEncodedCustomerId = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string => {
    return state.state.params.customerId;
  }
);
export const getDecodedCustomerId = createSelector(
  getEncodedCustomerId,
  (customerId): string => hexDecode(customerId)
);
export const getEncodedAuthorizationId = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string =>
    state && state.state ? state.state.params.authorizationId : null
);
export const getDecodedAuthorizationId = createSelector(
  getEncodedAuthorizationId,
  (authorizationId): string => hexDecode(authorizationId)
);

export const getEncodedReferralId = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string =>
    state.state.params.referralId
);
export const getDecodedReferralId = createSelector(
  getEncodedReferralId,
  (id): string => hexDecode(id)
);

// ABM Authorization specific
export const getAuthorizationArchetype = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): ReferralAuthorizationArchetype =>
    state.state.params.authArchetype
);
// PBM Authorization
export const getPbmServiceType = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): PbmAuthorizationServiceType =>
    state && state.state ? state.state.params.serviceType : null
);

// PBM drug selected NDC for LOMN
export const getPbmLomnSelectedNdc = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string =>
    state && state.state ? state.state.params.drugNdc : null
);

// Status which is used to determine which lines show up (based on 1:many status mapping)
export const getPbmAuthStatusView = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>): string =>
    state && state.state ? state.state.queryParams.status : null
);
