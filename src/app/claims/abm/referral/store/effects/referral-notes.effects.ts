import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReferralActivityService } from '../../referralId/referral-activity/referral-activity.service';
import {
  ActionType,
  PostReferralNoteRequest,
  PostReferralNoteRequestFail,
  PostReferralNoteRequestSuccess,
  RequestReferralNotes,
  RequestReferralNotesFail,
  RequestReferralNotesSuccess
} from '../actions/referral-notes.actions';
import { ReferralNote } from '../models';
import { ClaimsService } from '../../../../claims.service';

@Injectable()
export class ReferralNotesEffects {
  requestReferralNotes$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_REFERRAL_NOTES),
      mergeMap((action: RequestReferralNotes) => {
        return this.referralActivityService
          .getReferralNotes(action.payload)
          .pipe(
            catchError((err) => of(new RequestReferralNotesFail(err))),
            map(
              (notes: ReferralNote[]) => new RequestReferralNotesSuccess(notes)
            )
          );
      })
    )
  );

  postReferralNoteRequest$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.POST_REFERRAL_NOTES_REQUEST),
      mergeMap((action: PostReferralNoteRequest) =>
        this.referralActivityService.postReferralNote(action.payload).pipe(
          map(
            (noopResponse) => new PostReferralNoteRequestSuccess(action.payload)
          ),
          catchError((error) => of(new PostReferralNoteRequestFail(error))) // effectively noop catchError? - no reducer to pick it up
        )
      )
    )
  );

  handlePostReferralNoteResponse$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ActionType.POST_REFERRAL_NOTES_REQUEST_FAIL,
        ActionType.POST_REFERRAL_NOTES_REQUEST_SUCCESS
      ),
      map((action: any) => {
        if (action.type === ActionType.POST_REFERRAL_NOTES_REQUEST_SUCCESS) {
          this.claimsService.showSnackBar(
            'New note added to current referral',
            true
          );
        } else {
          this.claimsService.showSnackBar(
            'Failed to add the note, please try again.',
            false
          );
        }
        return { type: 'NONE' };
      })
    )
  );

  constructor(
    public actions$: Actions,
    public referralActivityService: ReferralActivityService,
    public claimsService: ClaimsService,
    public http: HttpClient,
    public snackbar: MatSnackBar
  ) {}
}
