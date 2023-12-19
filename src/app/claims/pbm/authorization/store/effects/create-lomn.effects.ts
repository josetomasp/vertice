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
  previewLOMN
} from '../actions/create-lomn.actions';

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
    public createLomnService: CreateLomnService
  ) {}
}
