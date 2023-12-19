import { createSelector } from '@ngrx/store';
import { getAuthorizationDetailsClaimNumber } from './pbm-authorization-information.selectors';
import { getDecodedClaimNumber } from 'src/app/store/selectors/router.selectors';

export const getAuthorizationClaimNumberToRouteComparison = createSelector(
  getAuthorizationDetailsClaimNumber,
  getDecodedClaimNumber,
  (currentClaimNumber, decodedClaimNumber) => ({
    isEqual: currentClaimNumber === decodedClaimNumber,
    currentClaimNumber,
    decodedClaimNumber
  })
);
