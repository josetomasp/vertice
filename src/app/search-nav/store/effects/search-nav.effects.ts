import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';

import { SearchNavService } from '../../search-nav.service';
import * as NavSearchActions from '../actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EPAQ_AUTHORIZATION_SEARCH_NAME } from '../models/search-options.model';
import {
  loadAssignedAdjustersFail,
  loadAssignedAdjustersRequest,
  loadAssignedAdjustersSuccess
} from '../actions';

@Injectable()
export class SearchNavEffects {
  getSearchOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.loadSearchOptionsRequest),
      switchMap(() =>
        this.searchNavService.getSearchOptions().pipe(
          map((payload) =>
            NavSearchActions.loadSearchOptionsSuccess({
              searchOptions: payload
            })
          ),
          catchError((errors) =>
            of(NavSearchActions.loadSearchOptionsFail({ errors: [errors] }))
          )
        )
      )
    )
  );

  getAssignedAdjusters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.loadAssignedAdjustersRequest),
      switchMap((action) =>
        this.searchNavService
          .getActiveAdjustersByCustomer(action.encodedCustomerId)
          .pipe(
            map((payload) =>
              NavSearchActions.loadAssignedAdjustersSuccess({
                assignedAdjusters: payload
              })
            ),
            catchError((errors) =>
              of(
                NavSearchActions.loadAssignedAdjustersFail({ errors: [errors] })
              )
            )
          )
      )
    )
  );

  executeNaviationSearchRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.executeNavigationSearchRequest),
      switchMap((action) =>
        this.searchNavService
          .getSearchResults(action.searchFormName, action.searchFormValues)
          .pipe(
            map((payload) => {
              if (payload.httpStatusCode !== 200) {
                return NavSearchActions.executeNavigationSearchFail({
                  searchFormName: action.searchFormName,
                  errors: payload.errors
                });
              } else {
                return NavSearchActions.executeNavigationSearchSuccess({
                  searchFormName: action.searchFormName,
                  searchResults: payload
                });
              }
            }),
            catchError((errors: HttpErrorResponse) =>
              of(
                NavSearchActions.executeNavigationSearchFail({
                  searchFormName: action.searchFormName,
                  errors:
                    ['Failed to fetch search results. Please contact Healthesystems support or try again.']
                })
              )
            )
          )
      )
    )
  );

  getActivityReferrals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.loadActivityReferrals),
      switchMap(({ searchValues }) =>
        this.searchNavService.getReferralActivities(searchValues).pipe(
          map((payload) =>
            NavSearchActions.loadActivityReferralsSuccess({
              referrals: payload
            })
          ),
          catchError((err) =>
            of(
              NavSearchActions.loadActivityReferralsFail({
                errors: [err.statusText]
              })
            )
          )
        )
      )
    )
  );
  getPendingReferrals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.loadPendingReferrals),
      switchMap(({ searchValues }) =>
        this.searchNavService.getPendingReferrals(searchValues).pipe(
          map((payload) =>
            NavSearchActions.loadPendingReferralsSuccess({
              referrals: payload
            })
          ),
          catchError((err) =>
            of(
              NavSearchActions.loadPendingReferralsFail({
                errors: [err.statusText]
              })
            )
          )
        )
      )
    )
  );
  getDraftReferrals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavSearchActions.loadDraftReferrals),
      switchMap(({ searchValues }) =>
        this.searchNavService.getDraftReferrals(searchValues).pipe(
          map((payload) =>
            NavSearchActions.loadDraftReferralsSuccess({
              referrals: payload
            })
          ),
          catchError((err) =>
            of(NavSearchActions.loadDraftReferralsFail({ errors: [err] }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<RootState>,
    private searchNavService: SearchNavService
  ) {}
}
