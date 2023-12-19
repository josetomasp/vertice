import { ApplicationRef, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import {
  catchError,
  flatMap,
  map,
  mergeMap,
  tap,
  switchMap
} from 'rxjs/operators';
import { FusionAuthorizationService } from '../../../referralId/referral-authorization/fusion/fusion-authorization.service';
import {
  loadFusionAuthReasons,
  loadFusionAuthReasonsFail,
  loadFusionAuthReasonsSuccess,
  loadFusionDiagnosticsAuthorizations,
  loadFusionDiagnosticsReferralAuthorizationsFail,
  loadFusionDiagnosticsReferralAuthorizationsSuccess,
  loadFusionDmeAuthorizations,
  loadFusionDmeReferralAuthorizationsFail,
  loadFusionDmeReferralAuthorizationsSuccess,
  loadFusionHomeHealthAuthorizations,
  loadFusionHomeHealthReferralAuthorizationsFail,
  loadFusionHomeHealthReferralAuthorizationsSuccess,
  loadFusionLanguageAuthorizations,
  loadFusionLanguageReferralAuthorizationsFail,
  loadFusionLanguageReferralAuthorizationsSuccess,
  loadFusionPhysicalMedicineAuthorizations,
  loadFusionPhysicalMedicineReferralAuthorizationsFail,
  loadFusionPhysicalMedicineReferralAuthorizationsSuccess,
  loadFusionReferralDocuments,
  loadFusionReferralDocumentsFail,
  loadFusionReferralDocumentsSuccess,
  lockFusionAuthorization,
  lockFusionAuthorizationFail,
  lockFusionAuthorizationSuccess,
  submitFusionAuthCancellation,
  submitFusionAuthCancellationFail,
  submitFusionAuthCancellationSuccessAndRefetch,
  submitFusionAuthorizationFail,
  submitFusionAuthorizations,
  submitFusionAuthorizationSuccess,
  submitFusionPMExtension,
  submitFusionPMExtensionFail,
  submitFusionPMExtensionSuccess,
  unlockFusionAuthorization,
  unlockFusionAuthorizationFail,
  unlockFusionAuthorizationSuccess
} from '../../actions/fusion/fusion-authorization.actions';
import {
  AuthorizationDetailReasonGroupCodes,
  AuthorizationHeaderReasonGroupCodes,
  AuthorizationReasons,
  AuthorizationReasonsResponse
} from '../../models/fusion/fusion-authorizations.models';
import { MatDialog } from '@angular/material/dialog';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { RequestReferralOverview } from '../../actions/referral-id.actions';
import { hexEncode } from '@shared';
import { RequestReferralCurrentActivity } from '../../actions/referral-activity.actions';
import { AuthorizationInformationService } from '../../../referralId/referral-authorization/authorization-information.service';

@Injectable({ providedIn: 'root' })
export class FusionAuthorizationsEffects {
  loadFusionReferralLanguageAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionLanguageAuthorizations),
      switchMap(
        ({ encodedClaimNumber, encodedCustomerId, encodedReferralId }) =>
          this.fusionAuthorizationService
            .loadFusionLanguageReferralAuthorizations({
              encodedClaimNumber,
              encodedCustomerId,
              encodedReferralId
            })
            .pipe(
              map((response) =>
                loadFusionLanguageReferralAuthorizationsSuccess(response)
              ),
              catchError((err) =>
                of(
                  loadFusionLanguageReferralAuthorizationsFail({
                    errors: [err]
                  })
                )
              )
            )
      )
    )
  );

  loadFusionReferralDiagnosticsAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionDiagnosticsAuthorizations),
      switchMap(
        ({ encodedClaimNumber, encodedCustomerId, encodedReferralId }) =>
          this.fusionAuthorizationService
            .loadFusionDiagnosticsReferralAuthorizations({
              encodedClaimNumber,
              encodedCustomerId,
              encodedReferralId
            })
            .pipe(
              map((response) =>
                loadFusionDiagnosticsReferralAuthorizationsSuccess(response)
              ),
              catchError((err) =>
                of(
                  loadFusionDiagnosticsReferralAuthorizationsFail({
                    errors: [err]
                  })
                )
              )
            )
      )
    )
  );

  loadFusionReferralPhysicalMedicineAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionPhysicalMedicineAuthorizations),
      switchMap(
        ({ encodedClaimNumber, encodedCustomerId, encodedReferralId }) =>
          this.fusionAuthorizationService
            .loadFusionPhysicalMedicineReferralAuthorizations({
              encodedClaimNumber,
              encodedCustomerId,
              encodedReferralId
            })
            .pipe(
              map((response) =>
                loadFusionPhysicalMedicineReferralAuthorizationsSuccess(
                  response
                )
              ),
              catchError((err) =>
                of(
                  loadFusionPhysicalMedicineReferralAuthorizationsFail({
                    errors: [err]
                  })
                )
              )
            )
      )
    )
  );

  loadFusionReferralHomeHealthAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionHomeHealthAuthorizations),
      switchMap(
        ({ encodedClaimNumber, encodedCustomerId, encodedReferralId }) =>
          this.fusionAuthorizationService
            .loadFusionHomeHealthReferralAuthorizations({
              encodedClaimNumber,
              encodedCustomerId,
              encodedReferralId
            })
            .pipe(
              map((response) =>
                loadFusionHomeHealthReferralAuthorizationsSuccess(response)
              ),
              catchError((err) =>
                of(
                  loadFusionHomeHealthReferralAuthorizationsFail({
                    errors: [err]
                  })
                )
              )
            )
      )
    )
  );

  // DME
  loadFusionReferralDmeAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionDmeAuthorizations),
      switchMap(
        ({ encodedClaimNumber, encodedCustomerId, encodedReferralId }) =>
          this.fusionAuthorizationService
            .loadFusionDmeReferralAuthorizations({
              encodedClaimNumber,
              encodedCustomerId,
              encodedReferralId
            })
            .pipe(
              map((response) =>
                loadFusionDmeReferralAuthorizationsSuccess(response)
              ),
              catchError((err) =>
                of(
                  loadFusionDmeReferralAuthorizationsFail({
                    errors: [err]
                  })
                )
              )
            )
      )
    )
  );

  loadFusionAuthorizationReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionAuthReasons),
      switchMap(({ encodedCustomerId }) =>
        this.fusionAuthorizationService
          .loadFusionAuthorizationReasons({
            encodedCustomerId
          })
          .pipe(
            map((response: AuthorizationReasonsResponse) => {
              let reasons: AuthorizationReasons = {
                approvalHeaderReasons: response.detailActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                    AuthorizationHeaderReasonGroupCodes.APPROVAL
                ),
                approvalLineItemReasons: response.detailActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                    AuthorizationDetailReasonGroupCodes.APPROVAL
                ),
                denialHeaderReasons: response.detailActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                    AuthorizationHeaderReasonGroupCodes.DENY
                ),
                denialLineItemReasons: response.detailActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                    AuthorizationDetailReasonGroupCodes.DENY
                ),
                pendHeaderReasons: response.headerActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PEND ||
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PENDINT ||
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PENDVEND
                ),
                pendLineItemReasons: response.headerActions.filter(
                  (f) =>
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PEND ||
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PENDINT ||
                    f.actionGroupCode.trim() ===
                      AuthorizationHeaderReasonGroupCodes.PENDVEND
                )
              };
              return loadFusionAuthReasonsSuccess({ reasons: reasons });
            }),
            catchError((err) =>
              of(loadFusionAuthReasonsFail({ errors: [err] }))
            )
          )
      )
    )
  );

  loadFusionReferralDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionReferralDocuments),
      switchMap(({ customerCode, referralId }) =>
        this.fusionAuthorizationService
          .loadFusionReferralDocuments({
            customerCode,
            referralId
          })
          .pipe(
            map((response) => loadFusionReferralDocumentsSuccess(response)),
            catchError((err) =>
              of(loadFusionReferralDocumentsFail({ errors: [err] }))
            )
          )
      )
    )
  );

  submitFusionAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitFusionAuthorizations),
      mergeMap(({ submitMessage }) =>
        this.fusionAuthorizationService
          .submitFusionAuthorizations(submitMessage)
          .pipe(
            map((response) => {
              if (!response.successful) {
                return submitFusionAuthorizationFail({
                  status: response.status ? response.status : null,
                  errorResponse: response.errors
                });
              }
              return submitFusionAuthorizationSuccess({
                successResponseFusion: response
              });
            }),
            catchError((catchErrorResponse) => {
              return of(
                submitFusionAuthorizationFail({
                  status: catchErrorResponse.status,
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

  submitFusionPMExtension$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitFusionPMExtension),
      mergeMap(({ submitMessage }) =>
        this.fusionAuthorizationService
          .submitFusionPMExtension(submitMessage)
          .pipe(
            map((response) => {
              if (response) {
                this.snackBarService.showSuccess(
                  'You have successfully extended the authorization.'
                );
                return submitFusionPMExtensionSuccess({
                  successResponseFusion: response
                });
              } else {
                const err =
                  'There was a problem extending the authorization, please try again later.';
                this.snackBarService.showError([err]);
                console.error(err);
                const errorResponse: string[] = [];
                errorResponse.push('Server returned false.');
                return submitFusionPMExtensionFail({ errorResponse });
              }
            }),
            catchError((err) => {
              console.error(err);
              const errorResponse: string[] = [];
              const errorMessage =
                'Error submitting PM extensions, please try again later.';
              errorResponse.push(errorMessage);
              this.snackBarService.showError([errorMessage]);
              return of(submitFusionPMExtensionFail({ errorResponse }));
            })
          )
      ),
      tap(() => {
        this.applicationRef.tick();
        this.matDialog.closeAll();
      })
    )
  );

  // Submit an Authorization Cancelation
  submitFusionAuthCancelation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitFusionAuthCancellation),
      mergeMap(({ submitMessage, submitParameters }) =>
        this.fusionAuthorizationService
          .submitAuthorizationCancelation(submitMessage, {
            encodedCustomerId: submitParameters.encodedCustomerId
          })
          .pipe(
            map((response) => {
              if (response) {
                this.snackBarService.showSuccess(
                  'Referral(s) has/have been successfully canceled.'
                );
                this.authorizationInformationService.dispatchGetReferralAuthorization(
                  submitParameters.archeType,
                  hexEncode(submitMessage.referralId),
                  submitParameters.encodedCustomerId,
                  submitParameters.encodedClaimNumber
                );
                return submitFusionAuthCancellationSuccessAndRefetch({
                  submitMessage,
                  submitParameters
                });
              } else {
                const err =
                  'Vertice is experiencing problems. Please try again later.';
                this.snackBarService.showError([err]);
                console.error(err);
                return submitFusionAuthCancellationFail();
              }
            }),
            catchError((err) => {
              console.error(err);
              const errorMessage =
                'Vertice is experiencing problems. Please try again later.';
              this.snackBarService.showError([errorMessage]);
              return of(submitFusionAuthCancellationFail());
            })
          )
      ),
      tap(() => {
        this.applicationRef.tick();
        this.matDialog.closeAll();
      })
    )
  );

  // Process the cancelation success and refetch:
  // Referall Overview banner
  // Referral Activity table
  submitFusionAuthCancelationSuccessAndReFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitFusionAuthCancellationSuccessAndRefetch),
      flatMap((data) => [
        new RequestReferralOverview({
          customerId: data.submitParameters.encodedCustomerId,
          claimNumber: data.submitParameters.encodedClaimNumber,
          referralId: hexEncode(data.submitMessage.referralId),
          archType: data.submitParameters.archeType
        }),
        new RequestReferralCurrentActivity({
          claimNumber: data.submitParameters.encodedClaimNumber,
          customerId: data.submitParameters.encodedCustomerId,
          referralId: hexEncode(data.submitMessage.referralId),
          archType: data.submitParameters.archeType
        })
      ])
    )
  );

  lockFusionAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lockFusionAuthorization),
      mergeMap(({ encodedReferralId }) =>
        this.fusionAuthorizationService
          .lockFusionAuthorization(encodedReferralId)
          .pipe(
            map((response) =>
              lockFusionAuthorizationSuccess({ isLocked: response.isLocked })
            ),
            catchError((response) => {
              return of(
                lockFusionAuthorizationFail({ errors: response.error.errors })
              );
            })
          )
      )
    )
  );

  unlockFusionAuthorizations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlockFusionAuthorization),
      mergeMap(({ encodedReferralId }) =>
        this.fusionAuthorizationService
          .unlockFusionAuthorization(encodedReferralId)
          .pipe(
            map((response) =>
              unlockFusionAuthorizationSuccess({
                isLocked: !response as boolean
              })
            ),
            catchError((err) => {
              return of(
                unlockFusionAuthorizationFail({ isLocked: !err as boolean })
              );
            })
          )
      )
    )
  );

  constructor(
    public actions$: Actions,
    public fusionAuthorizationService: FusionAuthorizationService,
    public matDialog: MatDialog,
    private applicationRef: ApplicationRef,
    public snackBarService: HealtheSnackBarService,
    private authorizationInformationService: AuthorizationInformationService
  ) {}
}
