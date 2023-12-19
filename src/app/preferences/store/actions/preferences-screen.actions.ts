import { Action as ngrxAction } from '@ngrx/store';
import { TableTabType } from '../../../claim-view/store/models/activity-tab.models';

export enum ActionTypes {
  UPDATE_COLUMN_VIEWS_BY_TAB = '[Preferences Screen] Update Column View by Tab',
  /**
   * View Specific
   */
  UPDATE_GENERAL_PREFERENCES_EXPANDED = '[Preferences Screen] Update General Preferences Expanded',
  UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_EXPANDED = '[Preferences Screen] Claim View Banner Preferences Expanded',
  UPDATE_CLAIM_VIEW_LISTS_EXPANDED = '[Preferences Screen] Claim View Lists Preferences Expanded',

  UPDATE_GENERAL_PREFERENCES_DIRTY = '[Preferences Screen] General Preferences Dirty',
  UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_DIRTY = '[Preferences Screen] Claim View Banner Preferences Dirty',
  UPDATE_CLAIM_VIEW_LISTS_DIRTY = '[Preferences Screen] Claim View Lists Preferences Dirty',
  SET_CLAIM_LIST_SELECTED_TAB = '[Preferences Claim Table List Screen] Selected Tab',
  RESET_PREFS_VIEW_STATE_TO_PRISTINE = '[Preferences Screen] Reset view state to pristine'
}

/**
 * Preferences Screen
 */
export class UpdateGeneralCardExpanded implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.UPDATE_GENERAL_PREFERENCES_EXPANDED;

  constructor(public payload: boolean) {}
}

export class UpdateClaimViewBannerCardExpanded implements ngrxAction {
  readonly type: ActionTypes =
    ActionTypes.UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_EXPANDED;

  constructor(public payload: boolean) {}
}

export class UpdateClaimViewListsCardExpanded implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.UPDATE_CLAIM_VIEW_LISTS_EXPANDED;

  constructor(public payload: boolean) {}
}

export class UpdateGeneralCardDirty implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.UPDATE_GENERAL_PREFERENCES_DIRTY;

  constructor(public payload: boolean) {}
}

export class UpdateClaimViewBannerCardDirty implements ngrxAction {
  readonly type: ActionTypes =
    ActionTypes.UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_DIRTY;

  constructor(public payload: boolean) {}
}

export class UpdateClaimViewListsCardDirty implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.UPDATE_CLAIM_VIEW_LISTS_DIRTY;

  constructor(public payload: object) {}
}

export class SetClaimTableListPreferencesTab implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.SET_CLAIM_LIST_SELECTED_TAB;

  constructor(public payload: TableTabType) {}
}

export class UpdateColumnViewsByTab implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.UPDATE_COLUMN_VIEWS_BY_TAB;

  constructor(public payload: { tab: string; columnView: string }) {}
}

export class ResetPrefsViewStateToPristine implements ngrxAction {
  readonly type: ActionTypes = ActionTypes.RESET_PREFS_VIEW_STATE_TO_PRISTINE;

  constructor(public payload) {}
}

export type Action =
  | ResetPrefsViewStateToPristine
  | UpdateGeneralCardExpanded
  | UpdateClaimViewBannerCardExpanded
  | UpdateClaimViewListsCardExpanded
  | UpdateGeneralCardDirty
  | UpdateClaimViewBannerCardDirty
  | UpdateClaimViewListsCardDirty
  | SetClaimTableListPreferencesTab
  | UpdateColumnViewsByTab;
