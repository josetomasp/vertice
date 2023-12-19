import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CreateLomnService } from '../../create-lomn.service';
import {
  loadExparteCopiesRequired,
  loadExparteCopiesRequiredFail,
  loadExparteCopiesRequiredSuccess,
  loadLetterTypes,
  loadLetterTypesFail,
  loadLetterTypesSuccess,
  previewLOMN,
  submitCreateLOMN,
  submitCreateLOMNFail,
  submitCreateLOMNSuccess
} from '../actions/create-lomn.actions';
import { loadRxAuthInfoSuccess } from '../actions/pbm-authorization-information.actions';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class CreateLomnEffects {
  previewLomn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(previewLOMN),
        tap((action) => this.createLomnService.previewLomn(action))
      ),
    { dispatch: false }
  );

  exparteCopiesRequired$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExparteCopiesRequired),
      mergeMap(({ encodedCustomerId, encodedClaimNumber }) =>
        this.createLomnService
          .getExparteCopiesRequired(encodedCustomerId, encodedClaimNumber)
          .pipe(
            map((response) => loadExparteCopiesRequiredSuccess(response)),
            catchError((error) =>
              of(loadExparteCopiesRequiredFail({ errors: [error] }))
            )
          )
      )
    )
  );

  submitCreateLOMN$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitCreateLOMN),
      mergeMap(({ submitMessage }) =>
        this.createLomnService.createLOMN(submitMessage).pipe(
          map((response) => {
            if (response.errors && response.errors.length > 0) {
              return submitCreateLOMNFail({
                errorResponse: response.errors
              });
            }
            return submitCreateLOMNSuccess({
              successful: response.successful
            });
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitCreateLOMNFail({
                errorResponse: catchErrorResponse.error.errors
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
      })
    )
  );

  letterTypesFromAuthSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRxAuthInfoSuccess),
      map((authorization) => {
        const ndcs = authorization.authorizationLineItems.map(
          (lineItem) => lineItem.ndc
        );
        return loadLetterTypes({ ndcs });
      })
    )
  );

  loadLetterTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLetterTypes),
      mergeMap(({ ndcs }) =>
        this.createLomnService.getLetterTypes(ndcs).pipe(
          map((letterTypes) => loadLetterTypesSuccess({ letterTypes })),
          catchError((error) => of(loadLetterTypesFail({ errors: [error] })))
        )
      )
    )
  );

  constructor(
    public actions$: Actions,
    public createLomnService: CreateLomnService,
    public matDialog: MatDialog
  ) {}
}
