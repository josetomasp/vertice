import {
  AuthorizationDetails,
  AuthorizationInformationState,
  PbmAuthorizationNote
} from '../models/pbm-authorization-information.model';
import { getPbmAuthorizationState } from './pbm-authorization.selectors';
import { PBMAuthorizationState } from '../models/pbm-authorization.models';
import { createSelector } from '@ngrx/store';
import { getPbmServiceType } from './router.selectors';

export const getPbmAuthorizationRootState = createSelector(
  getPbmAuthorizationState,
  (state) => state
);

export const getAuthorizationInformationState = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) => state.pbmAuthorizationInformationState
);

export const getAuthorizationDetails = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) => state.authorizationDetails
);



export const getAuthorizationLineItems = createSelector(
  getAuthorizationDetails,
  getPbmServiceType,
  (
    {
      authorizationLineItems,
      pharmacyInformationForm: {
        pharmacy: { nabp, npi }
      }
    },
    serviceType
  ) => {
    if (serviceType === 'paper') {
      return authorizationLineItems;
    } else {
      return authorizationLineItems.map((lineItem) => ({
        ...lineItem,
        npi: lineItem.prescriber.npi
      }));
    }
  }
);

export const getAuthorizationId = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationId
);

export const getAuthorizationDetailsHeader = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationDetailsHeader
);

export const getLOMNWizardState = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) => state.pbmLOMNWizardState
);

export const getAuthorizationLineItemDatePickerPresets = (
  lineItemIndex: number
) =>
  createSelector(
    getAuthorizationDetails,
    (state) => state.authorizationLineItems[lineItemIndex].datePickerPresets
  );

export const isAuthorizationInformationIsLoading = createSelector(
  getPbmAuthorizationRootState,
  (state: AuthorizationInformationState) => state.isLoading
);
