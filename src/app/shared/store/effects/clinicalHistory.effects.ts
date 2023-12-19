import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';

import * as clinicalActions from '../actions/clinicalHistory.actions';
import { ActivityResponse } from '@shared/models/claim-activity-data';
import { ClinicalHistoryService } from '@shared/components/clinical-history/clinical-history.service';

@Injectable()
export class ClinicalHistoryEffects {
  public fetchClinicalHistory$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(clinicalActions.loadClinicalHistory),
      mergeMap((action) => {
        return this.clinicalHistoryService
          .getClinicalHistory(action.range)
          .pipe(
            map((response: ActivityResponse) =>
              clinicalActions.loadClinicalHistorySuccess({
                data: response.activities
              })
            ),
            catchError((error) => {
              console.error(error);
              return of(clinicalActions.loadClinicalHistoryFail());
            })
          );
      })
    )
  );

  public exportClinicalHistory$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clinicalActions.exportClinicalHistory),
        tap((action) => {
          this.clinicalHistoryService
            .clinicalHistoryExport(action.exportParams)
            .subscribe({ error: (err) => console.error(err) });
        })
      ),
    { dispatch: false }
  );

  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public clinicalHistoryService: ClinicalHistoryService
  ) {}
}
