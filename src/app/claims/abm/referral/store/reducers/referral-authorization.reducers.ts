import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import {
  referralAuthorizationInitialState,
  ReferralAuthorizationItem,
  ReferralAuthorizationState
} from '../../referralId/referral-authorization/referral-authorization.models';
import {
  addReferralAuthorizationItem,
  clearReferralAuthorizationSet,
  loadReferralAuthorizationActionSuccess,
  loadReferralAuthorizationSet,
  loadReferralAuthorizationSetFailure,
  loadReferralAuthorizationSetSuccess,
  removeReferralAuthorizationItem,
  rollbackTripsAuthorized,
  setAuthorizationIsSuccessfullySubmitted,
  setOpenAuthDetailsExpanded,
  updateReferralAuthorizationFormData
} from '../actions/referral-authorization.actions';

export const referralAuthorizationReducer = createReducer(
  referralAuthorizationInitialState,
  on(
    loadReferralAuthorizationSet,
    (state: ReferralAuthorizationState): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.isLoading = true;
      cloneState.isLoaded = false;
      return cloneState;
    }
  ),
  on(
    loadReferralAuthorizationSetSuccess,
    (
      state: ReferralAuthorizationState,
      { referralAuthSet }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.isLoading = false;
      cloneState.isLoaded = true;
      cloneState.referralAuthorizationSet = referralAuthSet;
      cloneState.referralAuthorizationSet.referralAuthorization.originalAuthorizationItems = _.cloneDeep(
        referralAuthSet.referralAuthorization.authorizationItems
      );
      cloneState.referralAuthorizationSet = referralAuthSet;
      return cloneState;
    }
  ),
  on(
    loadReferralAuthorizationSetFailure,
    (state: ReferralAuthorizationState): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.isLoading = false;
      cloneState.isLoaded = false;

      return cloneState;
    }
  ),
  on(
    clearReferralAuthorizationSet,
    (state: ReferralAuthorizationState): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);

      cloneState.isOpenAuthDetailsExpanded = false;
      cloneState.referralAuthorizationSet.referralAuthorization.authorizationItems = _.cloneDeep(
        cloneState.referralAuthorizationSet.referralAuthorization
          .originalAuthorizationItems
      );

      cloneState.referralAuthorizationSet.referralAuthorization.authorizationItems = _.cloneDeep(
        cloneState.referralAuthorizationSet.referralAuthorization
          .originalAuthorizationItems
      );

      return cloneState;
    }
  ),
  on(
    updateReferralAuthorizationFormData,
    (
      state: ReferralAuthorizationState,
      { authItemId, formData }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      let item: ReferralAuthorizationItem = null;

      cloneState.referralAuthorizationSet.referralAuthorization.authorizationItems.forEach(
        (oldItem) => {
          if (oldItem.uniqueId === authItemId) {
            item = oldItem;
          }
        }
      );

      item.authData = { ...item.authData, ...formData };
      // This will need to be fixed when we do the Refactoring for Open Auth (IE bug)
      delete item.authData.authData;
      return cloneState;
    }
  ),
  on(
    addReferralAuthorizationItem,
    (
      state: ReferralAuthorizationState,
      { authItem }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.referralAuthorizationSet.referralAuthorization.authorizationItems.push(
        authItem
      );

      return cloneState;
    }
  ),
  on(
    removeReferralAuthorizationItem,
    (
      state: ReferralAuthorizationState,
      { authItem }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      const itemList =
        cloneState.referralAuthorizationSet.referralAuthorization
          .authorizationItems;
      _.remove(itemList, { uniqueId: authItem.uniqueId });

      return cloneState;
    }
  ),
  on(
    setOpenAuthDetailsExpanded,
    (
      state: ReferralAuthorizationState,
      { isOpenAuthDetailsExpanded }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.isOpenAuthDetailsExpanded = isOpenAuthDetailsExpanded;

      return cloneState;
    }
  ),
  on(
    setAuthorizationIsSuccessfullySubmitted,
    (
      state: ReferralAuthorizationState,
      { authorizationIsSuccessfullySubmitted }
    ): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      cloneState.isAuthorizationSuccessfullySubmitted = authorizationIsSuccessfullySubmitted;

      return cloneState;
    }
  ),
  on(
    rollbackTripsAuthorized,
    (state: ReferralAuthorizationState): ReferralAuthorizationState => {
      const cloneState: ReferralAuthorizationState = _.cloneDeep(state);
      const referralAuth =
        cloneState.referralAuthorizationSet.referralAuthorization;
      referralAuth.authorizationItems[0].authData = {
        ...referralAuth.originalAuthorizationItems[0].authData
      };
      return cloneState;
    }
  ),
  on(
    loadReferralAuthorizationActionSuccess,
    (
      state: ReferralAuthorizationState,
      { referralAuthorizationActions }
    ): ReferralAuthorizationState => {
      return {
        ...state,
        referralAuthorizationAction: referralAuthorizationActions
      };
    }
  )
);
