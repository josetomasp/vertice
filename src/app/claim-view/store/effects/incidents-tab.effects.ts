import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { IncidentsService } from '../../incidents/incidents.service';
import * as fromIncidentsTab from '../actions/incidents-tab.actions';
import { IncidentsResponse } from '../models/incidents-tab.model';
import { VerticeResponse } from '@shared';

@Injectable()
export class IncidentsEffects {
  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public incidentsService: IncidentsService
  ) {}

  public fetchIcdCodesRequest$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromIncidentsTab.ActionType.INCIDENTS_REQUEST),
      mergeMap((action: fromIncidentsTab.IncidentsRequest) => {
        return this.incidentsService.getIncidents(action.payload).pipe(
          map((response: VerticeResponse<IncidentsResponse>) => {
            if (response.errors && response.errors.length > 0) {
              return new fromIncidentsTab.IncidentsRequestFail(response.errors);
            }
            return new fromIncidentsTab.IncidentsRequestSuccess(
              response.responseBody
            );
          }),
          catchError((catchErrorResponse) => {
            let errors = [];
            if (
              catchErrorResponse.error.errors &&
              catchErrorResponse.error.errors.length > 0
            ) {
              errors = catchErrorResponse.error.errors;
            } else {
              errors = [
                'Unable to get incidents information at this time. Please try again later.'
              ];
            }
            return of(new fromIncidentsTab.IncidentsRequestFail(errors));
          })
        );
      })
    )
  );
}
