import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  ActionType,
  RequestReferralOverview,
  RequestReferralOverviewFail,
  RequestReferralOverviewSuccess,
  SaveReferralICDCodes,
  SaveReferralICDCodesFail,
  SaveReferralICDCodesSuccess
} from '../actions/referral-id.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReferralOverviewCardState } from '../models/referral-id.models';
import { ReferralIdService } from '../../referralId/referral-id.service';
import { ClaimsService } from '../../../../claims.service';
import { RequestReferralNotesSuccess } from '../actions/referral-notes.actions';

@Injectable()
export class ReferralIdEffects {
  requestReferralId$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_REFERRAL_OVERVIEW),
      mergeMap((action: RequestReferralOverview) => {
        return this.referralIdService.getReferralOverview(action.payload).pipe(
          map((referralOverview: ReferralOverviewCardState) => {
            referralOverview['isCore'] = action.payload.archType === 'transportation';
            return new RequestReferralOverviewSuccess(referralOverview);
          }),
          catchError((err) => of(new RequestReferralOverviewFail(err)))
        );
      })
    )
  );

  // This effect is to capture notes from the transportation overview and copy them
  // into the referral activity notes section.

  OverLoadSuccess: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_REFERRAL_OVERVIEW_SUCCESS),
      mergeMap((action: RequestReferralOverviewSuccess) => {
        if (action.payload['isCore']) {
          return of(new RequestReferralNotesSuccess(action.payload.notes));
        } else {
          return EMPTY;
        }
      })
    )
  );

  requestReferralNotes: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.SAVE_REFERRAL_ICDCODES),
      mergeMap((action: SaveReferralICDCodes) => {
        return this.referralIdService.referralSaveICDCodes(action.payload).pipe(
          map((x) => {
            this.claimsService.showSnackBar(
              'Diagnosis codes updated successfully',
              true
            );
            return new SaveReferralICDCodesSuccess(action.payload.icdCodeList);
          }),
          catchError((err) => {
            this.claimsService.showSnackBar(
              'Diagnosis codes update failed',
              false
            );
            return of(new SaveReferralICDCodesFail(err));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private referralIdService: ReferralIdService,
    public claimsService: ClaimsService
  ) {}
}
