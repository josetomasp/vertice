import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClaimActivityService } from '../../service/claim-activity.service';
import * as fromActivityTabAction from '../actions/activity-tab.actions';
import {
  ActionType,
  RequestAllActivity,
  RequestPendingActivity,
  RequestPendingActivityFail,
  RequestPendingActivitySuccess
} from '../actions/activity-tab.actions';
import {
  PendingActivityData,
  PendingActivityDTO
} from '../models/activity-tab.models';

@Injectable()
export class ActivityTabEffects {
  loadRequest$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActivityTabAction.ActionType.REQUEST_ALL_ACTIVITY),
      mergeMap((loadRequest: RequestAllActivity) => {
        const { claimNumber, customerId, dateRange } = loadRequest.payload;
        return this.claimViewService
          .getClaimActivity(claimNumber, customerId, dateRange)
          .pipe(
            map(
              (response) => ({
                type: ActionType.REQUEST_ALL_ACTIVITY_SUCCESS,
                payload: response
              }),
              // the operator 'of' creates a new observable with the arguments supplied
              catchError((err) =>
                of({ type: ActionType.REQUEST_ALL_ACTIVITY_FAIL, payload: err })
              )
            )
          );
      })
    )
  );

  processPendingActivity$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_PENDING_ACTIVITY_SUCCESS),
      mergeMap(
        (
          requestSuccess: fromActivityTabAction.RequestPendingActivitySuccess
        ) => {
          const activityData: Array<PendingActivityData> =
            requestSuccess.payload.activities;
          if (activityData) {
            return of(activityData).pipe(
              map((pendingActivity) => {
                const all = pendingActivity.length;
                const pharmacy = pendingActivity.filter(
                  (activity) => activity.productType === 'Pharmacy'
                ).length;
                const clinical = pendingActivity.filter(
                  (activity) => activity.productType === 'Clinical'
                ).length;
                const ancillary = pendingActivity.filter(
                  (activity) => activity.productType === 'Ancillary'
                ).length;

                return { all, pharmacy, clinical, ancillary };
              }),
              map(
                (totals) =>
                  new fromActivityTabAction.SetPendingActivityTotals(totals)
              )
            );
          } else {
            return of(
              new fromActivityTabAction.SetPendingActivityTotals({
                all: 0,
                pharmacy: 0,
                clinical: 0,
                ancillary: 0
              })
            );
          }
        }
      )
    )
  );

  requestPendingActivity$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_PENDING_ACTIVITY),
      mergeMap((action: RequestPendingActivity) => {
        return this.claimViewService
          .getPendingActivity(
            action.payload.claimNumber,
            action.payload.customerId
          )
          .pipe(
            map(
              (response: PendingActivityDTO) =>
                new RequestPendingActivitySuccess(response)
            ),
            catchError((err) => of(new RequestPendingActivityFail(err)))
          );
      })
    )
  );

  constructor(
    public actions$: Actions,
    public http: HttpClient,
    public claimViewService: ClaimActivityService
  ) {}
}
