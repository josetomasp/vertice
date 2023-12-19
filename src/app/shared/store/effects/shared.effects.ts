import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SharedService } from '@shared/shared.service';
import * as fromSharedActions from '../actions/trending-risk-modal.actions';
import {
  ActionType,
  SnoozeClaimRiskActionsRequest,
  SnoozeClaimRiskActionsRequestFail,
  SnoozeClaimRiskActionsRequestSuccess
} from '../actions/shared.actions';
import { ClaimsService } from 'src/app/claims/claims.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClaimSearchResponse, TrendingRiskModalState } from '../models';

@Injectable()
export class SharedEffects {
  public getTrendingRiskModalData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromSharedActions.ActionType.TRENDING_RISK_MODAL_DATA_REQUEST),
      mergeMap((action: fromSharedActions.TrendingRiskModalDataRequest) => {
        return zip(
          this.claimsService.claimsSearch({
            claimNumber: action.payload.claimNumber
          }),
          this.sharedService.getTrendingRiskModalData(
            action.payload.claimNumber
          )
        ).pipe(
          map(([claimSearchResponse, trendingRiskModalState]) => {
            return new fromSharedActions.TrendingRiskModalDataRequestSuccess(
              this.finishTrendingRiskModalState(
                claimSearchResponse,
                trendingRiskModalState
              )
            );
          })
        );
      })
    )
  );

  public openTrendingRiskModal$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromSharedActions.ActionType.TRENDING_RISK_MODAL_DATA_REQUEST_SUCCESS
      ),
      map((action: fromSharedActions.TrendingRiskModalDataRequestSuccess) => {
        this.sharedService.openTrendingRiskModal(action.payload);
        return { type: 'NONE' };
      })
    )
  );

  snoozeClaimRiskActions$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST),
      mergeMap((action: SnoozeClaimRiskActionsRequest) =>
        this.claimsService.snoozeClaimRiskActions(action.payload).pipe(
          map((res) => new SnoozeClaimRiskActionsRequestSuccess(res)),
          catchError((err) => of(new SnoozeClaimRiskActionsRequestFail(err)))
        )
      )
    )
  );

  displaySnoozeMessage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_FAIL,
        ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_SUCCESS
      ),
      map((action: SnoozeClaimRiskActionsRequest) => {
        if (
          action.type === ActionType.SNOOZE_CLAIM_RISK_ACTIONS_REQUEST_SUCCESS
        ) {
          this.snackbar.open(
            'The claim was set to be re-evaluated in 30 days',
            'OK',
            { panelClass: ['snackbar', 'success'], duration: 8000 }
          );
        } else {
          this.snackbar.open(
            'The claim was unable to be re-evaluated... Please try again later.',
            'OK',
            { panelClass: ['snackbar', 'danger'], duration: 8000 }
          );
        }
        return { type: 'NONE' };
      })
    )
  );

  finishTrendingRiskModalState(
    claimSearchResponse: ClaimSearchResponse,
    trendingRiskModalState: TrendingRiskModalState
  ): TrendingRiskModalState {
    const {
      claimNumber,
      riskLevel,
      riskLevelNumber,
      interventions,
      riskIncreased,
      daysSinceRiskLevelChange
    } = claimSearchResponse.claims[0];

    trendingRiskModalState.claimantInformation.riskLevel = {
      riskIncreased: riskIncreased,
      trendScoreDuration: daysSinceRiskLevelChange
    };
    return {
      ...trendingRiskModalState,
      claimNumber,
      riskLevel,
      riskLevelNumber,
      interventions
    };
  }

  constructor(
    public actions$: Actions,
    public sharedService: SharedService,
    public claimsService: ClaimsService,
    public snackbar: MatSnackBar
  ) {}
}
