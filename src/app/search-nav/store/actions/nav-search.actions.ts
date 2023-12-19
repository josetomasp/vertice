import { createAction, props } from '@ngrx/store';
import { SearchOptions } from '../models/search-options.model';
import { HealtheSelectOption } from '@shared';

export const loadSearchOptionsRequest = createAction(
  '[Search Nav] Load Search Options'
);

export const loadSearchOptionsSuccess = createAction(
  '[Search Nav] Load Search Options Success',
  props<{ searchOptions: SearchOptions }>()
);

export const loadSearchOptionsFail = createAction(
  '[Search Nav] Load Search Request Options Fail',
  props<{ errors: string[] }>()
);

export const loadAssignedAdjustersRequest = createAction(
  '[Search Nav] Load Assigned Adjusters',
  props<{ encodedCustomerId: string }>()
);

export const loadAssignedAdjustersSuccess = createAction(
  '[Search Nav] Load Assigned Adjusters Success',
  props<{ assignedAdjusters: HealtheSelectOption<string>[] }>()
);

export const loadAssignedAdjustersFail = createAction(
  '[Search Nav] Load Assigned Adjusters Fail',
  props<{ errors: string[] }>()
);

export const initializeSearchState = createAction(
  '[Search Nav] Initializing Search State',
  props<{
    searchFormName: string;
  }>()
);

export const saveSearchFormValues = createAction(
  '[Search Nav] Saving Search Form Values',
  props<{
    searchFormName: string;
    searchFormValues: { [parameter: string]: any };
  }>()
);

export const executeNavigationSearchRequest = createAction(
  '[Search Nav] Executing Search Request',
  props<{
    searchFormName: string;
    searchFormValues: { [parameter: string]: string };
  }>()
);

export const executeNavigationSearchSuccess = createAction(
  '[Search Nav] Executing Search Request Success',
  props<{
    searchFormName: string;
    searchResults: any;
  }>()
);

export const executeNavigationSearchFail = createAction(
  '[Search Nav] Executing Search Request Fail',
  props<{
    searchFormName: string;
    errors: any;
  }>()
);
