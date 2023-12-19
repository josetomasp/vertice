import { createSelector } from '@ngrx/store';
import { AuthorizationLineItem } from '../models/pbm-authorization-information.model';
import {
  getAuthorizationLineItems,
  getLOMNWizardState,
  getAuthorizationId
} from './pbm-authorization-information.selectors';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId
} from './router.selectors';

export const getLomnMedList = createSelector(
  getAuthorizationLineItems,
  (lineItems: AuthorizationLineItem[]) =>
    lineItems.map((lineItem) => {
      let label = lineItem.drugItemName + ' - Prescribed by ';
      if (
        lineItem?.prescriber.lastName &&
        lineItem?.prescriber.lastName.trim().length > 0
      ) {
        const middleInitial =
          lineItem.prescriber.middleName &&
          lineItem.prescriber.middleName.length > 0
            ? lineItem.prescriber.middleName.substr(0, 1).toUpperCase() + ' '
            : '';
        label =
          label +
          lineItem.prescriber.lastName +
          ', ' +
          lineItem.prescriber.name +
          ' ' +
          middleInitial +
          (lineItem.prescriber.credential
            ? lineItem.prescriber.credential
            : '');
      } else {
        label = label + lineItem.prescriber.npi;
      }
      return {
        label,
        value: lineItem,
        uniqueKey: '' + lineItem.drugDisplayName + '' + lineItem?.prescriber.npi
      };
    })
);

export const getNdcArrayList = createSelector(
  getAuthorizationLineItems,
  (lineItems) => lineItems.map((lineItem) => lineItem.ndc)
);

export const getNdcToLineItemMap = createSelector(
  getAuthorizationLineItems,
  (lineItems: AuthorizationLineItem[]) => {
    const ndcToLineItemMap = {};
    lineItems.forEach(
      (lineItem) => (ndcToLineItemMap[lineItem.ndc] = lineItem)
    );
    return ndcToLineItemMap;
  }
);

export const getNdcToAlertMap = createSelector(
  getAuthorizationLineItems,
  (lineItems: any[]) => {
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
