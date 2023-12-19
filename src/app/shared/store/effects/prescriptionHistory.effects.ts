import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';

import { PrescriptionHistoryService } from '@shared/components/prescription-history/prescription-history.service';
import { ActivityResponse } from '@shared/models/claim-activity-data';
import * as prescriptionActions from '@shared/store/actions/prescriptionHistory.actions';

@Injectable()
export class PrescriptionHistoryEffects {
  public fetchPrescriptionHistory$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(prescriptionActions.loadPrescriptionHistory),
      mergeMap((action) => {
        return this.prescriptionHistoryService
          .getPrescriptionHistory(action.range)
          .pipe(
            map((response: ActivityResponse) =>
              prescriptionActions.loadPrescriptionHistorySuccess({
                data: response.activities
              })
            ),
            catchError((error) => {
              console.error(error);
              return of(prescriptionActions.loadPrescriptionHistoryFail());
            })
          );
      })
    )
  );

  public exportPrescriptionHistory$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(prescriptionActions.exportPrescriptionHistory),
        tap((action) => {
          this.prescriptionHistoryService
            .prescriptionHistoryExport(action.exportParams)
            .subscribe({ error: (err) => console.error(err) });
        })
      ),
    { dispatch: false }
  );

  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public prescriptionHistoryService: PrescriptionHistoryService
  ) {}
}
