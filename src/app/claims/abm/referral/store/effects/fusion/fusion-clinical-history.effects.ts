import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FusionClinicalHistoryService } from '../../../referralId/clinical-history/fusion-clinical-history.service';
import {
  loadFusionClinicalHistory,
  loadFusionClinicalHistoryFail,
  loadFusionClinicalHistorySuccess
} from '../../actions/fusion/fusion-clinical-history.actions';

@Injectable({ providedIn: 'root' })
export class FusionClinicalHistoryEffects {
  loadFusionClinicalHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionClinicalHistory),
      switchMap(({ referralId }) =>
        this.clinicalHistoryService.getClinicalHistory(referralId).pipe(
          map((clinicalHistory) =>
            loadFusionClinicalHistorySuccess(clinicalHistory)
          ),
          catchError((error: Error) =>
            of(loadFusionClinicalHistoryFail({ errors: [error.message] }))
          )
        )
      )
    )
  );

  constructor(
    public actions$: Actions,
    public clinicalHistoryService: FusionClinicalHistoryService
  ) {}
}
