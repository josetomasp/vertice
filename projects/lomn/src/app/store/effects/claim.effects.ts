import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  ActionType,
  RequestClaimV2,
  RequestClaimV2Fail,
  RequestClaimV2Success
} from '../actions/claim.actions';
import { ClaimV3 } from '../models/claim.models';
import { ClaimV3Service } from '../../claim-v3.service';

@Injectable({ providedIn: 'root' })
export class ClaimEffects {
  requestClaimV2$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2),
      mergeMap(({ payload }: RequestClaimV2) =>
        this.claimV2Service.getClaimV3(payload).pipe(
          catchError((err) => of(new RequestClaimV2Fail(err))),
          map((claim: ClaimV3) => new RequestClaimV2Success(claim))
        )
      )
    )
  );

  constructor(
    public actions$: Actions,
    public claimV2Service: ClaimV3Service
  ) {}
}
