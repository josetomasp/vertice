import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserInfo, UserState } from '../models/user.models';

const getUserState = createFeatureSelector('user');
export const getUserInfo = createSelector(
  getUserState,
  (state: UserState): UserInfo => state.info
);

export const isUserInternal = createSelector(
  getUserInfo,
  (info): boolean => info.internal
);
export const getUsername = createSelector(getUserInfo, (info) => info.username);
export const getUserOKTASettingsURL = createSelector(
  getUserInfo,
  (info): string => info.oktaSettingsURL
);
export const getInternalUserCustomer = createSelector(
  getUserInfo,
  (info): string => info.internalUserCustomer
);

export const isJarvisLinkHidden = createSelector(
  getUserInfo,
  ({ jarvisLinkHidden }) => jarvisLinkHidden
);
export const getJarvisSSOLink = createSelector(getUserInfo, ({jarvisSSOLink}) => jarvisSSOLink)
