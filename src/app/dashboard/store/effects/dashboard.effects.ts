import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import {
  ActionType,
  RiskGraphDataFail,
  RiskGraphDataRequest,
  RiskGraphDataSuccess
} from '../actions/dashboard.actions';

@Injectable()
export class DashboardEffects {
  riskGraphDataRequest$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.RISK_GRAPH_DATA_REQUEST),
      mergeMap((action: RiskGraphDataRequest) => {
        return this.dashboardService.getRiskGraphData(action.payload).pipe(
          map((response) => new RiskGraphDataSuccess(response)),
          catchError((err) => {
            return of(new RiskGraphDataFail(err));
          })
        );
      })
    )
  );

  constructor(
    public actions$: Actions,
    public dashboardService: DashboardService
  ) {}
}
