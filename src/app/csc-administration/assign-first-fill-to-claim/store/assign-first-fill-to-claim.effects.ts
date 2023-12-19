import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  tap
} from 'rxjs/operators';
import { of } from 'rxjs';
import {
  assignFirstFillToNewClaim,
  assignFirstFillToNewClaimFailure,
  assignFirstFillToNewClaimSuccess,
  confirmAssignFirstFillToNewClaim,
  loadClaimSearchResults,
  loadClaimSearchResultsFailure,
  loadClaimSearchResultsSuccess,
  loadFirstFillsToAssign,
  loadFirstFillsToAssignFailure,
  loadFirstFillsToAssignSuccess,
  moveToNextQueue,
  moveToNextQueueFailure,
  moveToNextQueueSuccess,
  saveWebUserNotes,
  saveWebUserNotesAndMoveToNextQueue,
  saveWebUserNotesAndMoveToNextQueueFailure,
  saveWebUserNotesAndMoveToNextQueueSuccess,
  saveWebUserNotesFailure,
  saveWebUserNotesSuccess
} from './assign-first-fill-to-claim.actions';
import { AssignFirstFillToClaimService } from '../assign-first-fill-to-claim.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

@Injectable()
export class AssignFirstFillToClaimEffects {
  loadFirstFillsToAssign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFirstFillsToAssign),
      concatMap((payload) =>
        this.assignFirstFillToClaimService
          .getLineItemDetails(payload.temporaryMemberId)
          .pipe(
            map((verticeResponse) => {
              switch (verticeResponse.httpStatusCode) {
                case 200:
                  return loadFirstFillsToAssignSuccess({
                    firstFillLineItemsToAssign: verticeResponse.responseBody
                  });
                default:
                  return loadFirstFillsToAssignFailure({
                    errors: verticeResponse.errors
                  });
              }
            }),
            catchError(() =>
              of(
                loadFirstFillsToAssignFailure({
                  errors: [
                    'Something went wrong while fetching first fill line items to assign'
                  ]
                })
              )
            )
          )
      )
    )
  );

  saveWebUserNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveWebUserNotes),
      concatMap((payload) => {
        this.openSpinnerModal('Saving notes');
        return this.assignFirstFillToClaimService
          .saveFirstFillWebUserNotes(
            payload.temporaryMemberId,
            payload.customerId,
            payload.notes
          )
          .pipe(
            map((verticeResponse) => {
              // Close the spinning modal
              this.dialog.closeAll();
              switch (verticeResponse.httpStatusCode) {
                case 200:
                  return saveWebUserNotesSuccess({ notes: payload.notes });
                default:
                  return saveWebUserNotesFailure({
                    errors: verticeResponse.errors
                  });
              }
            }),
            catchError(() =>
              of(
                saveWebUserNotesFailure({
                  errors: [
                    'Something went wrong while saving the web user notes'
                  ]
                })
              )
            )
          );
      })
    )
  );

  saveWebUserNotesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveWebUserNotesSuccess),
        tap((payload) =>
          this.openConfirmationModal(
            'Notes Saved',
            'Comments saved as "'.concat(payload.notes).concat('".'),
            false
          )
        )
      ),
    { dispatch: false }
  );

  moveToNextQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveToNextQueue),
      concatMap((payload) => {
        this.openSpinnerModal('Moving to next queue');
        return this.assignFirstFillToClaimService
          .moveFirstFillToNextQueue(
            payload.temporaryMemberId,
            payload.customerId
          )
          .pipe(
            map((verticeResponse) => {
              // Close the spinning modal
              this.dialog.closeAll();
              switch (verticeResponse.httpStatusCode) {
                case 200:
                  return moveToNextQueueSuccess();
                default:
                  return moveToNextQueueFailure({
                    errors: verticeResponse.errors
                  });
              }
            }),
            catchError(() =>
              of(
                moveToNextQueueFailure({
                  errors: [
                    'Something went wrong while moving the first fill to the next queue'
                  ]
                })
              )
            )
          );
      })
    )
  );

  moveToNextQueueSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(moveToNextQueueSuccess),
        tap(() =>
          this.openConfirmationModal(
            'First Fill Moved',
            'Line items have been moved to the next queue, but notes were not updated.'
          )
        )
      ),
    { dispatch: false }
  );

  saveWebUserNotesAndMoveToNextQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveWebUserNotesAndMoveToNextQueue),
      concatMap((payload) => {
        this.openSpinnerModal('Saving notes and moving to next queue');
        return this.assignFirstFillToClaimService
          .saveFirstFillWebUserNotesAndMoveToNextQueue(
            payload.temporaryMemberId,
            payload.customerId,
            payload.notes
          )
          .pipe(
            map((verticeResponse) => {
              // Close the spinning modal
              this.dialog.closeAll();
              switch (verticeResponse.httpStatusCode) {
                case 200:
                  return saveWebUserNotesAndMoveToNextQueueSuccess({
                    notes: payload.notes
                  });
                default:
                  return saveWebUserNotesAndMoveToNextQueueFailure({
                    errors: verticeResponse.errors
                  });
              }
            }),
            catchError(() =>
              of(
                saveWebUserNotesAndMoveToNextQueueFailure({
                  errors: [
                    'Something went wrong while moving the first fill to the next queue'
                  ]
                })
              )
            )
          );
      })
    )
  );

  saveWebUserNotesAndMoveToNextQueueSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveWebUserNotesAndMoveToNextQueueSuccess),
        tap((payload) =>
          this.openConfirmationModal(
            'Notes Saved and First Fill Moved',
            'Comments saved as "'
              .concat(payload.notes)
              .concat('" and line items have been moved to the next queue.')
          )
        )
      ),
    { dispatch: false }
  );

  loadClaimSearchResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClaimSearchResults),
      concatMap((payload) =>
        this.assignFirstFillToClaimService
          .getClaimSearchResults(payload.claimSearchFormValues)
          .pipe(
            map((verticeResponse) => {
              switch (verticeResponse.httpStatusCode) {
                case 200:
                  return loadClaimSearchResultsSuccess({
                    firstFillClaimSearchResults: verticeResponse.responseBody
                  });
                default:
                  return loadClaimSearchResultsFailure({
                    errors: verticeResponse.errors
                  });
              }
            }),
            catchError(() =>
              of(
                loadClaimSearchResultsFailure({
                  errors: [
                    'Something went wrong while fetching first fill claim search results'
                  ]
                })
              )
            )
          )
      )
    )
  );

  confirmAssignFirstFillToNewClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmAssignFirstFillToNewClaim),
      mergeMap(
        ({
          temporaryMemberId,
          currentCustomerId,
          selectedCustomerId,
          selectedClaimNumber
        }) => {
          return this.confirmationModalService
            .displayModal({
              titleString: 'Are you sure you want to apply this match?',
              bodyHtml: `Assigning Temp ID "${temporaryMemberId}" from customer "${currentCustomerId}" to claim "${selectedClaimNumber}" from customer "${selectedCustomerId}"`,
              affirmString: 'SUBMIT',
              denyString: 'CANCEL'
            })
            .afterClosed()
            .pipe(
              filter((confirmed) => confirmed),
              map(() =>
                assignFirstFillToNewClaim({
                  selectedCustomerId,
                  selectedClaimNumber,
                  currentCustomerId,
                  temporaryMemberId
                })
              )
            );
        }
      )
    )
  );

  assignFirstFillToNewClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignFirstFillToNewClaim),
      concatMap(
        ({
          temporaryMemberId,
          currentCustomerId,
          selectedCustomerId,
          selectedClaimNumber
        }) => {
          this.openSpinnerModal('Submitting Request...');
          return this.assignFirstFillToClaimService
            .assignFirstFillToNewClaim(
              temporaryMemberId,
              currentCustomerId,
              selectedCustomerId,
              selectedClaimNumber
            )
            .pipe(
              map((verticeResponse) => {
                // Close the spinning modal
                this.dialog.closeAll();
                switch (verticeResponse.httpStatusCode) {
                  case 200:
                    return assignFirstFillToNewClaimSuccess({
                      selectedClaimNumber: selectedClaimNumber
                    });
                  default:
                    return assignFirstFillToNewClaimFailure({
                      errors: verticeResponse.errors
                    });
                }
              }),
              catchError(() =>
                of(
                  assignFirstFillToNewClaimFailure({
                    errors: [
                      'Something went wrong while assigning the first fill to the new claim'
                    ]
                  })
                )
              )
            );
        }
      )
    )
  );

  assignFirstFillToNewClaimSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(assignFirstFillToNewClaimSuccess),
        tap((payload) =>
          this.openConfirmationModal(
            'First Fill Match Saved',
            'Match saved for Claim "'
              .concat(payload.selectedClaimNumber)
              .concat('".')
          )
        )
      ),
    { dispatch: false }
  );

  openSpinnerModal(spinnerText: string) {
    this.dialog.open(LoadingModalComponent, {
      width: '700px',
      data: spinnerText
    });
  }

  openConfirmationModal(
    titleString: string,
    bodyHtml: string,
    navigateAway: boolean = true
  ) {
    this.confirmationModalService
      .displayModal({
        titleString,
        bodyHtml,
        affirmString: 'OK'
      })
      .afterClosed()
      .subscribe(() => {
        if (navigateAway) {
          this.router.navigate(['/csc-administration/first-fills-queue']);
        }
      });
  }

  constructor(
    private actions$: Actions,
    private assignFirstFillToClaimService: AssignFirstFillToClaimService,
    private dialog: MatDialog,
    private router: Router,
    private confirmationModalService: ConfirmationModalService
  ) {}
}
