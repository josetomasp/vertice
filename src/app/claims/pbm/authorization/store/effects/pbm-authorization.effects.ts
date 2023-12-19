import { ApplicationRef, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import {
  loadPaperAuthInfo,
  loadPaperAuthInfoFail,
  loadPaperAuthInfoSuccess,
  loadRxAuthInfo,
  loadRxAuthInfoFail,
  loadRxAuthInfoSuccess,
  postInternalNote,
  postInternalNoteFail,
  postInternalNoteSuccess,
  saveDecision,
  saveDecisionFail,
  saveDecisionSuccess,
  savePaperAuthorization,
  savePaperAuthorizationFail,
  savePaperAuthorizationSuccess,
  saveRxAuthLineItemNote,
  saveRxAuthLineItemNoteFail,
  saveRxAuthLineItemNoteSuccess,
  searchRxAuthClaimForReassignment,
  searchRxAuthClaimForReassignmentFail,
  searchRxAuthClaimForReassignmentSuccess,
  submitByPassPriorAuthLoad,
  submitByPassPriorAuthLoadFail,
  submitByPassPriorAuthLoadSuccess,
  submitPaperAuthorization,
  submitPriorAuthLoad,
  submitPriorAuthLoadFail,
  submitPriorAuthLoadSuccess,
  submitRxAuthClaimReassignment,
  submitRxAuthClaimReassignmentFail,
  submitRxAuthClaimReassignmentSuccess,
  submitRxAuthorization,
  submitRxAuthorizationFail,
  submitRxAuthorizationSuccess,
  submitSamaritanDose,
  submitSamaritanDoseFail,
  submitSamaritanDoseSuccess,
  unlockRxAuthorization,
  unlockRxAuthorizationFail,
  unlockRxAuthorizationSuccess,
  submitPaperAuthClaimReassignmentSuccess,
  submitPaperAuthClaimReassignmentFail,
  submitPaperAuthClaimReassignment,
  preparePaperAuthorization,
  preparePaperAuthorizationFail,
  preparePaperAuthorizationSuccess,
  submitPaperAuthorizationFail,
  submitPaperAuthorizationSuccess,
  unlockPaperRxAuthorization,
  resetRxAuthorizationState
} from '../actions/pbm-authorization-information.actions';
import {
  AuthorizationDetails,
  PbmAuthSubmitResponse,
  PbmPreparePaperAuthorizationResponse
} from '../models/pbm-authorization-information.model';
import {
  submitCreateLOMN,
  submitCreateLOMNFail,
  submitCreateLOMNSuccess
} from '../actions/create-lomn.actions';
import { LomnWizardService } from '../../lomn-wizard/lomn-wizard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  PbmAuthSearchClaimResponse,
  PbmAuthSubmitClaimRequest
} from '../models/pbm-authorization-reassignment.model';
import { VerticeResponse } from '@shared';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { select, Store } from '@ngrx/store';
import { isUserInternal } from '../../../../../user/store/selectors/user.selectors';
import { RootState } from '../../../../../store/models/root.models';
import { PbmTimePeriodModalService } from '../../authorization-information/pbm-time-period-modal/pbm-time-period-modal.service';
import { PbmSuccessfulSubmissionModalService } from '../../authorization-information/pbm-successful-submission-modal/pbm-successful-submission-modal.service';
import { PbmAuthorizationNote } from '../models/pbm-authorization-information/pbm-authorization-note.models';

@Injectable()
export class PbmAuthorizationEffects {
  loadRxAuthInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRxAuthInfo),
      mergeMap(({ authorizationId, isRTR }) =>
        this.authorizationService
          .getRxAuthorizationInformation({ authorizationId, isRTR })
          .pipe(
            map((payload: VerticeResponse<AuthorizationDetails>) => {
              if (payload.httpStatusCode < 300) {
                return loadRxAuthInfoSuccess(payload.responseBody);
              } else {
                return loadRxAuthInfoFail({ errors: payload.errors });
              }
            }),
            catchError((error) => {
              return of(
                loadRxAuthInfoFail({
                  errors: ['The System Returned Unexpected Data']
                })
              );
            })
          )
      )
    )
  );

  loadPaperAuthInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPaperAuthInfo),
      mergeMap(({ authorizationId }) =>
        this.authorizationService
          .getPaperAuthorizationInformation({ authorizationId })
          .pipe(
            map((payload: AuthorizationDetails) => {
              return loadPaperAuthInfoSuccess(payload);
            }),
            catchError((error) => {
              return of(loadPaperAuthInfoFail({ errors: [error] }));
            })
          )
      )
    )
  );

  saveRxAuthLineItemNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveRxAuthLineItemNote),
      mergeMap(({ note, authorizationId }) =>
        this.authorizationService
          .saveRxAuthorizationLineItemNote(note, { authorizationId })
          .pipe(
            map((payload: PbmAuthorizationNote[]) => {
              return saveRxAuthLineItemNoteSuccess({
                notes: payload,
                lineItemKey: note.parentId
              });
            }),
            catchError((error) => {
              return of(saveRxAuthLineItemNoteFail({ errors: [error] }));
            })
          )
      )
    )
  );

  searchRxAuthClaimForReassignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchRxAuthClaimForReassignment),
      mergeMap(({ searchRequest }) =>
        this.authorizationService
          .searchClaimForRxAuthorizationReassignment(searchRequest)
          .pipe(
            map(
              (
                searchResultWrapper: VerticeResponse<
                  PbmAuthSearchClaimResponse[]
                >
              ) => {
                let claims: PbmAuthSearchClaimResponse[] = [];
                if (searchResultWrapper.httpStatusCode === 200) {
                  // Found
                  claims = searchResultWrapper.responseBody;
                } else if (searchResultWrapper.errors.length > 0) {
                  // Error
                  return searchRxAuthClaimForReassignmentFail({
                    errors: searchResultWrapper.errors
                  });
                } // Else not found
                return searchRxAuthClaimForReassignmentSuccess({
                  searchResult: claims
                });
              }
            ),
            catchError((error) => {
              return of(
                searchRxAuthClaimForReassignmentFail({ errors: [error] })
              );
            })
          )
      )
    )
  );

  submitRxAuthClaimReassignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitRxAuthClaimReassignment),
      mergeMap((submitRequest: PbmAuthSubmitClaimRequest) =>
        this.authorizationService
          .submitClaimRxAuthorizationReassignment(submitRequest)
          .pipe(
            map((response) => {
              if (response.errors && response.errors.length > 0) {
                this.snackBarService.showError([
                  'Unable to reassign to new claim. Please choose another claim or try again later.'
                ]);
                return submitRxAuthClaimReassignmentFail({
                  errors: response.errors
                });
              }
              this.snackBarService.showSuccess(
                'The Claim has been successfully reassigned.'
              );

              return submitRxAuthClaimReassignmentSuccess(
                response.responseBody
              );
            }),
            catchError((catchErrorResponse) => {
              this.snackBarService.showError([
                'Unable to reassign to new claim. Please choose another claim or try again later.'
              ]);
              return of(
                submitRxAuthClaimReassignmentFail({
                  errors: catchErrorResponse.error.errors
                })
              );
            })
          )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitPaperAuthClaimReassignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitPaperAuthClaimReassignment),
      mergeMap((submitRequest: PbmAuthSubmitClaimRequest) =>
        this.authorizationService
          .submitClaimPaperAuthorizationReassignment(submitRequest)
          .pipe(
            map((response: VerticeResponse<string>) => {
              if (response.errors && response.errors.length > 0) {
                return submitPaperAuthClaimReassignmentFail(response);
              }
              return submitPaperAuthClaimReassignmentSuccess(response);
            }),
            catchError((catchErrorResponse) => {
              const response: VerticeResponse<string> = {
                responseBody: undefined,
                errors: [],
                httpStatusCode: 500
              };
              if (
                catchErrorResponse.error.errors &&
                catchErrorResponse.error.errors.length > 0
              ) {
                response.errors = catchErrorResponse.error.errors;
              } else {
                response.errors = [
                  'Paper (Retro) Bill cannot be reassigned at this time. Please try again later.'
                ];
              }
              return of(submitPaperAuthClaimReassignmentFail(response));
            })
          )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  saveRxAuthUnlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlockRxAuthorization),
      mergeMap(({ authorizationId }) =>
        this.authorizationService.unlockAuthorization(authorizationId).pipe(
          map((response: Boolean) => {
            this.store$.dispatch(resetRxAuthorizationState());
            return unlockRxAuthorizationSuccess({
              isLocked: !response
            });
          }),
          catchError((error) => {
            return of(unlockRxAuthorizationFail({ errors: [error] }));
          })
        )
      )
    )
  );
  saveRxPaperAuthUnlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlockPaperRxAuthorization),
      mergeMap(({ authorizationId }) =>
        this.authorizationService.unlockPaperAuthorization(authorizationId).pipe(
          map((response: boolean) => {
            return unlockRxAuthorizationSuccess({
              isLocked: !response
            });
          }),
          catchError((error) => {
            return of(unlockRxAuthorizationFail({ errors: [error] }));
          })
        )
      )
    )
  );

  submitCreateLOMN$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitCreateLOMN),
      mergeMap(({ submitMessage }) =>
        this.lomnService.createLOMN(submitMessage).pipe(
          map((response) => {
            if (response.errors && response.errors.length > 0) {
              return submitCreateLOMNFail({
                errorResponse: response.errors
              });
            }
            return submitCreateLOMNSuccess({
              successful: response.successful
            });
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitCreateLOMNFail({
                errorResponse: catchErrorResponse.error.errors
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitRxAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitRxAuthorization),
      mergeMap(({ submitMessage, isLastDecisionSave }) =>
        this.authorizationService.submitRxAuthorization(submitMessage).pipe(
          map((response: PbmAuthSubmitResponse) => {
            if (response.errors && response.errors.length > 0) {
              return submitRxAuthorizationFail({
                errorResponse: response.errors
              });
            }
            return submitRxAuthorizationSuccess({
              successResponse: response,
              isLastDecisionSave
            });
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitRxAuthorizationFail({
                errorResponse: catchErrorResponse.error.errors
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitRxAuthSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitRxAuthorizationSuccess),
        mergeMap(() => this.store$.pipe(select(isUserInternal), first())),
        filter((isInternal) => !isInternal),
        tap(() => {
          this.pbmSuccessfulSubmissionModalService.showModal();
        })
      ),
    { dispatch: false }
  );

  postInternalNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postInternalNote),
      switchMap(({ note, encodedAuthId }) =>
        this.authorizationService.saveInternalNote(note, encodedAuthId).pipe(
          map(({ httpStatusCode, responseBody, errors }) => {
            if (httpStatusCode === 200) {
              return postInternalNoteSuccess({ notes: responseBody });
            } else {
              this.snackbar.open('Internal note failed to save', null, {
                duration: 3000,
                panelClass: ['danger', 'snackbar']
              });

              return postInternalNoteFail({ errors });
            }
          })
        )
      )
    )
  );

  savePaperAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savePaperAuthorization),
      mergeMap(({ saveRequestBody, authorizationId }) =>
        this.authorizationService
          .savePaperAuthorizationInformation(saveRequestBody, {
            authorizationId
          })
          .pipe(
            map((response: VerticeResponse<void>) => {
              if (response.errors && response.errors.length > 0) {
                return savePaperAuthorizationFail({
                  errorResponse: response
                });
              }
              return savePaperAuthorizationSuccess({
                successResponse: response
              });
            }),
            catchError((catchErrorResponse) => {
              console.error(catchErrorResponse.message);
              return of(
                savePaperAuthorizationFail({
                  errorResponse: {
                    errors: [
                      'Paper (Retro) Bill cannot be saved at this time. Please try again later.'
                    ],
                    httpStatusCode: catchErrorResponse.status,
                    responseBody: undefined
                  }
                })
              );
            })
          )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitPaperAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitPaperAuthorization),
      mergeMap(({ submitMessage, authorizationId }) =>
        this.authorizationService
          .submitPaperAuthorizationInformation(submitMessage, {
            authorizationId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationDetails>) => {
              if (response.errors && response.errors.length > 0) {
                return submitPaperAuthorizationFail({
                  errorResponse: response.errors
                });
              }
              return submitPaperAuthorizationSuccess({
                successResponse: {
                  response: response.responseBody,
                  successful: true
                }
              });
            }),
            catchError((catchErrorResponse) => {
              console.error(catchErrorResponse.message);
              return of(
                submitPaperAuthorizationFail({
                  errorResponse: [
                    'A server error has occurred while attempting to submit the request. Please contact Healthesystems and/or try again.'
                  ]
                })
              );
            })
          )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitPaperAuthSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitPaperAuthorizationSuccess),
        mergeMap(() => this.store$.pipe(select(isUserInternal), first())),
        filter((isInternal) => !isInternal),
        tap(() => {
          this.pbmSuccessfulSubmissionModalService.showModal();
        })
      ),
    { dispatch: false }
  );

  submitSamaritanDose$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitSamaritanDose),
      mergeMap(({ submit }) =>
        this.authorizationService.loadSamaritanDose(submit).pipe(
          map((response: PbmAuthSubmitResponse) => {
            if (response.errors && response.errors.length > 0) {
              return submitSamaritanDoseFail({
                response: {
                  responseBody: response.response,
                  errors: response.errors,
                  httpStatusCode: 200
                }
              });
            }
            return submitSamaritanDoseSuccess({
              response: {
                responseBody: response.response,
                errors: response.errors,
                httpStatusCode: 200
              }
            });
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitSamaritanDoseFail({
                response: {
                  responseBody: null,
                  errors: [
                    'Samaritan Dose cannot be Submitted at this time. Please try again later.'
                  ],
                  httpStatusCode: 500
                }
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitByPassPriorAuthLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitByPassPriorAuthLoad),
      mergeMap(({ submit, authorizationDetails }) =>
        this.authorizationService.submitByPassPriorAuthLoad(submit).pipe(
          map((response: PbmAuthSubmitResponse) => {
            if (response.errors && response.errors.length > 0) {
              return submitByPassPriorAuthLoadFail({
                errorResponse: response.errors
              });
            } else {
              const lineItemId = submit.authorizationLineItems[0].lineItemId;
              response.response.authorizationLineItems.map((lineItem) => {
                const line = authorizationDetails.authorizationLineItems.find(
                  (x) => x.posLineItemKey === lineItem.posLineItemKey
                );
                if (line.posLineItemKey !== lineItemId) {
                  lineItem.permissibleActionsForCurrentUser =
                    line.permissibleActionsForCurrentUser;
                }
              });
              return submitByPassPriorAuthLoadSuccess(response.response);
            }
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitByPassPriorAuthLoadFail({
                errorResponse: [
                  'ByPass Prior Auth Load cannot be Submitted at this time. Please try again later.'
                ]
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  submitPriorAuthLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitPriorAuthLoad),
      mergeMap(({ submit, authorizationDetails }) =>
        this.authorizationService.submitRxPriorAuthLoad(submit).pipe(
          map((response: PbmAuthSubmitResponse) => {
            if (response.errors && response.errors.length > 0) {
              return submitPriorAuthLoadFail({
                errorResponse: response.errors
              });
            } else {
              return submitPriorAuthLoadSuccess(response.response);
            }
          }),
          catchError((catchErrorResponse) => {
            return of(
              submitPriorAuthLoadFail({
                errorResponse: [
                  'Prior Auth Load cannot be Submitted at this time. Please try again later.'
                ]
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  saveDecision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveDecision),
      mergeMap(({ submitMessage, isLastDecisionSave, successSubject }) =>
        this.authorizationService.submitRxAuthorization(submitMessage).pipe(
          map((response: PbmAuthSubmitResponse) => {
            if (response.errors && response.errors.length > 0) {
              return saveDecisionFail({
                errorResponse: response.errors
              });
            } else {
              if (null != successSubject) {
                successSubject.next();
              }
              return saveDecisionSuccess({
                successResponse: response,
                isLastDecisionSave
              });
            }
          }),
          catchError((catchErrorResponse) => {
            return of(
              saveDecisionFail({
                errorResponse: catchErrorResponse.error.errors
              })
            );
          })
        )
      ),
      tap(() => {
        this.matDialog.closeAll();
        this.applicationRef.tick();
      })
    )
  );

  preparePaperAuthorization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(preparePaperAuthorization),
      mergeMap(({ submitMessage, authorizationId }) =>
        this.authorizationService
          .preparePaperAuthorization(submitMessage, {
            authorizationId
          })
          .pipe(
            map(
              (
                response: VerticeResponse<PbmPreparePaperAuthorizationResponse>
              ) => {
                if (response.errors && response.errors.length > 0) {
                  return preparePaperAuthorizationFail({
                    errorResponse: response
                  });
                } else {
                  if (
                    response.responseBody.positiveDoctors.priorAuthlimits
                      .length > 0 ||
                    response.responseBody.negativeDoctors.priorAuthlimits
                      .length > 0 ||
                    response.responseBody.positiveDrugs.priorAuthlimits.length >
                      0 ||
                    response.responseBody.negativeDrugs.priorAuthlimits.length >
                      0
                  ) {
                    this.pbmTimePeriodModalService.showModal({
                      encodedAuthorizationId: authorizationId,
                      request: submitMessage,
                      data: response.responseBody
                    });
                  } else {
                    this.matDialog.closeAll();
                    this.applicationRef.tick();
                    this.pbmTimePeriodModalService.submitPaperAuthorization(
                      submitMessage,
                      authorizationId
                    );
                  }

                  return preparePaperAuthorizationSuccess({
                    successResponse: response,
                    successful: true
                  });
                }
              }
            ),
            catchError((catchErrorResponse) => {
              console.error(catchErrorResponse.message);
              return of(
                preparePaperAuthorizationFail({
                  errorResponse: {
                    errors: [
                      'Paper (Retro) Bill cannot be Submitted at this time. Please try again later.'
                    ],
                    responseBody: undefined,
                    httpStatusCode: 500
                  }
                })
              );
            })
          )
      )
    )
  );

  constructor(
    public snackbar: MatSnackBar,
    public authorizationService: PbmAuthorizationService,
    public lomnService: LomnWizardService,
    public matDialog: MatDialog,
    private applicationRef: ApplicationRef,
    public actions$: Actions,
    public store$: Store<RootState>,
    public pbmSuccessfulSubmissionModalService: PbmSuccessfulSubmissionModalService,
    public pbmTimePeriodModalService: PbmTimePeriodModalService,
    public snackBarService: HealtheSnackBarService
  ) {}
}
