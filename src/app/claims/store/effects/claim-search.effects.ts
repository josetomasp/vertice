import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { RootState } from '../../../store/models/root.models';
import { CLAIM_SEARCH_LABELS } from '../../../verbiage.service';
import { ClaimsService } from '../../claims.service';
import {
  ClaimSearchFail,
  ClaimSearchOptionsFail,
  ClaimSearchOptionsSuccess,
  ClaimSearchRequest,
  ClaimSearchSuccess
} from '../actions';
import * as ClaimSearch from '../actions/claim-search.actions';

const moment = _moment;

@Injectable()
export class ClaimSearchEffects {
  public getClaimSearchOptions$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimSearch.ActionType.CLAIM_SEARCH_OPTIONS_REQUEST),
      mergeMap(() => {
        return this.claimsService.getClaimSearchOptions().pipe(
          map((res) => new ClaimSearchOptionsSuccess(res)),
          catchError((err) => {
            return of(new ClaimSearchOptionsFail(err));
          })
        );
      })
    )
  );

  public claimSearch$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimSearch.ActionType.CLAIM_SEARCH_REQUEST),
      mergeMap(({ payload }: ClaimSearch.ClaimSearchRequest) =>
        this.claimsService.claimsSearch(payload).pipe(
          map((claims) => new ClaimSearchSuccess(claims)),
          catchError((err) => {
            return of(new ClaimSearchFail(err));
          })
        )
      )
    )
  );

  public claimSearchExport$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimSearch.ActionType.CLAIM_SEARCH_EXPORT_REQUEST),
      mergeMap(({ payload }: ClaimSearch.ClaimSearchExportRequest) =>
        this.claimsService.claimsSearchExport(payload).pipe(
          map((claims) => new ClaimSearch.ClaimSearchExportSuccess(claims)),
          catchError((err) => {
            return of(new ClaimSearch.ClaimSearchExportFail(err));
          })
        )
      )
    )
  );

  public generateFilterSummary$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ClaimSearch.ActionType.CLAIM_SEARCH_REQUEST),
      mergeMap((action: ClaimSearchRequest) => {
        return of(action.payload).pipe(
          map((form) => {
            let filterSummary = '';

            for (let key of Object.keys(form)) {
              const value = form[key];
              if (value) {
                if (key !== 'dateOfInjury') {
                  filterSummary += `${CLAIM_SEARCH_LABELS[key]} (${
                    form[key]
                  }), `;
                } else {
                  const range = form[key];
                  const fromFormatted = moment(range.fromDate).format(
                    environment.dateFormat
                  );
                  const toFormatted = moment(range.toDate).format(
                    environment.dateFormat
                  );
                  filterSummary += `${
                    CLAIM_SEARCH_LABELS[key]
                  } (${fromFormatted} - ${toFormatted}), `;
                }
              }
            }
            /**
             * This strips off the ', ' on the end of the last summary string
             */
            return filterSummary.slice(0, -2);
          }),
          map(
            (filterSummary) =>
              new ClaimSearch.UpdateFilterSummary(filterSummary)
          )
        );
      })
    )
  );

  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public claimsService: ClaimsService
  ) {}
}
