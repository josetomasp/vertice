import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClaimsService } from 'src/app/claims/claims.service';

import * as fromClaimViewAction from '../actions/claim-view.actions';
import { ClaimSearchRequest } from '../../../claims/store';
import { ClaimSearchResponse } from '@shared/store/models';

@Injectable()
export class ClaimViewEffects {
  public claimSearch$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromClaimViewAction.ActionType.CLAIM_VIEW_SEARCH_REQUEST),
      mergeMap(({ payload }: ClaimSearchRequest) =>
        this.claimsService.claimsSearch(payload).pipe(
          map(
            (claims: ClaimSearchResponse) =>
              new fromClaimViewAction.ClaimViewSearchSuccess(claims)
          ),
          catchError((err) => {
            return of(new fromClaimViewAction.ClaimViewSearchFail(err));
          })
        )
      )
    )
  );

  constructor(public actions$: Actions, public claimsService: ClaimsService) {}
}
