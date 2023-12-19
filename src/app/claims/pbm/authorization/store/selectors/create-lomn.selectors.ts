import { createSelector } from '@ngrx/store';
import {
  getAuthorizationLineItems,
  getLOMNWizardState,
  getAuthorizationId
} from './pbm-authorization-information.selectors';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { AuthorizationLineItem } from '../models/pbm-authorization-information/authorization-line-item.models';

export const getLomnMedList = createSelector(
  getAuthorizationLineItems,
  (lineItems: AuthorizationLineItem[]) =>
    lineItems.map((lineItem) => ({
      label: lineItem.drugDisplayName,
      value: lineItem,
      uniqueKey: '' + lineItem.drugDisplayName + '' + lineItem?.prescriber.npi
    }))
);

export const getNdcArrayList = createSelector(
  getAuthorizationLineItems,
  (lineItems) => lineItems.map((lineItem) => lineItem.ndc)
);

export const getNdcToLineItemMap = createSelector(
  getAuthorizationLineItems,
  (lineItems) => {
    const ndcToLineItemMap = {};
    lineItems.forEach(
      (lineItem) => (ndcToLineItemMap[lineItem.ndc] = lineItem)
    );
    return ndcToLineItemMap;
  }
);

export const getNdcToAlertMap = createSelector(
  getAuthorizationLineItems,
  (lineItems: AuthorizationLineItem[]) => {
    const alertMap = {};
    for (let i = 0; i < lineItems.length; i++) {
      const { ndc, alerts } = lineItems[i];
      alertMap[ndc] = alerts;
    }
    return alertMap;
  }
);

export const isSubmittingLOMN = createSelector(
  getLOMNWizardState,
  (state) => state.submittingCreateLOMN
);

export const getCreateLOMNResponse = createSelector(
  getLOMNWizardState,
  (state) => state.wizardResponse
);
export const areExparteCopiesRequired = createSelector(
  getLOMNWizardState,
  (state) => state.exparteCopiesRequired
);
export const getLetterTypes = createSelector(
  getLOMNWizardState,
  (state) => state.letterTypes
);

export const getSubmitMessageWithoutFormData = createSelector(
  getDecodedCustomerId,
  getDecodedClaimNumber,
  getAuthorizationId,
  (customerId, claimNumber, authorizationId) => ({
    customerId,
    claimNumber,
    authorizationId
  })
);
