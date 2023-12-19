import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { MakeAReferralSearchService } from '../../referrals/make-a-referral-search/make-a-referral-search.service';
import {
  loadClaimResults,
  loadClaimResultsFail,
  loadClaimResultsSuccess
} from '../actions/make-a-referral-search.actions';

@Injectable()
export class MakeAReferralSearchEffects {
  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public makeAReferralSearchService: MakeAReferralSearchService
  ) {}

  getClaimResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClaimResults),
      mergeMap(({ searchValues }) =>
        this.makeAReferralSearchService
          .getClaimSearchResults(searchValues)
          .pipe(
            map((payload) =>
              loadClaimResultsSuccess({
                claims: payload
              })
            ),
            catchError(() =>
              of(
                loadClaimResultsFail({
                  serverErrors: [
                    'Error getting claims for make a referral, please try again later.'
                  ]
                })
              )
            )
          )
      )
    )
  );
}
