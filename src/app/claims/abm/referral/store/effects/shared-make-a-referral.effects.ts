import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatAll,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { RootState } from '../../../../../store/models/root.models';
import { MakeAReferralHelperService } from '../../make-a-referral/make-a-referral-helper.service';
import { MakeAReferralService } from '../../make-a-referral/make-a-referral.service';
import { ReferralService } from '../../referral.service';
import {
  fusionSaveAsDraft,
  fusionSaveAsDraftFail,
  fusionSaveAsDraftSuccess,
  fusionSubmitReferralSuccess
} from '../actions/fusion/fusion-make-a-referral.actions';
import {
  removeSuccessServicesFormState,
  saveAsDraft,
  saveAsDraftFail,
  saveAsDraftSuccess,
  submitTransportationReferralFailure,
  submitTransportationReferralSuccess
} from '../actions/make-a-referral.actions';
import {
  completeReferralSubmit,
  openDocumentUploadProgressModal,
  partialFail,
  resetUploadDocumentsMeta,
  submitReferralFail,
  submitReferrals,
  submitReferralsDone,
  submitReferralSuccess,
  SuccessSharedSubmitResponse
} from '../actions/shared-make-a-referral.actions';
import { ReferralSubmitResponseBundle } from '../models/fusion/fusion-make-a-referral.models';
import { ReferralSubmitMessage } from '../models/make-a-referral.models';
import { ReferralRoutes } from '../models/referral.models';
import { ErrorSharedMakeAReferral } from '../models/shared-make-a-referral.models';
import {
  getDocumentUploadMeta,
  getSuccessfulServices
} from '../selectors/shared-make-a-referral.selectors';

@Injectable({
  providedIn: 'root'
})
export class SharedMakeAReferralEffects {
  SERVICES = {
    homeHealth: 'Home Health',
    transportation: 'Transportation',
    diagnostics: 'Diagnostics',
    language: 'Language',
    physicalMedicine: 'Physical Medicine',
    dme: 'DME'
  };

  constructor(
    public store$: Store<RootState>,
    public router: Router,
    public makeAReferralService: MakeAReferralService,
    public actions$: Actions,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackBarService: HealtheSnackBarService,
    private referralService: ReferralService
  ) {}

  coreSaveAsDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveAsDraft),
      switchMap(({ submitMessage }) =>
        this.makeAReferralService
          .saveAsDraftTransportationReferral(submitMessage)
          .pipe(
            map((responseId) => {
              return saveAsDraftSuccess(responseId);
            }),
            catchError((error) => {
              return of(
                saveAsDraftFail({
                  errors: ['bad stuff happened']
                })
              );
            })
          )
      )
    )
  );

  fusionSaveAsDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fusionSaveAsDraft),
      switchMap(({ submitMessage }) =>
        this._handleSharedSubmit(
          submitMessage,
          fusionSaveAsDraftSuccess,
          fusionSaveAsDraftFail
        )
      )
    )
  );

  coreSaveAsDraftSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveAsDraftSuccess),
        tap(() => {
          this.snackBarService.showSuccess(
            'You have successfully saved this referral as a draft. Saving this referral as a draft will retain all information entered, however attachments will not be saved.'
          );
        })
      ),
    { dispatch: false }
  );

  submitReferrals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitReferrals),
      mergeMap(({ submitMessage }) => {
        const operations: Observable<Action>[] = [];
        operations.push(
          this._handleSharedSubmit(
            submitMessage,
            submitReferralSuccess,
            submitReferralFail
          )
        );

        if (this._hasDocuments(submitMessage.formValues)) {
          operations.push(of(openDocumentUploadProgressModal()));
        } else {
          operations.push(of(completeReferralSubmit()));
          operations.push(of(resetUploadDocumentsMeta()));
        }

        return operations;
      }),
      // This is so we complete them in series instead of parallel
      mergeAll(1)
    )
  );

  displayUploadProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openDocumentUploadProgressModal),
      mergeMap(() =>
        this.makeAReferralService
          .displayUploadProgressModal(
            this.store$.pipe(select(getDocumentUploadMeta))
          )
          .afterClosed()
          .pipe(
            map(() => [resetUploadDocumentsMeta(), completeReferralSubmit()]),
            concatAll()
          )
      )
    )
  );

  completeReferralSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(completeReferralSubmit),
        withLatestFrom(this.store$.select(getSuccessfulServices)),
        tap((latestState) => {
          // TODO: see what happens with failed document uploads
          this.referralService.showFailedDocuments();
        })
      ),
    { dispatch: false }
  );

  submitTransportationReferralFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitTransportationReferralFailure),
        tap((error) => {
          if (error.errors == null) {
            this.snackBarService.showError([
              'The referral submission has failed. Please try again later or contact Healthesystems for assistance.'
            ]);
          }
        })
      ),
    { dispatch: false }
  );

  setReturnedFormCoreFusion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitReferralSuccess),
      mergeMap((submitReferralForms) => {
        const operations: Observable<Action>[] = [];
        if (submitReferralForms.coreReferralData) {
          const formValues: any = submitReferralForms.coreReferralData;
          operations.push(
            of(
              submitTransportationReferralSuccess({
                referralData: formValues
              })
            )
          );
        }
        if (submitReferralForms.successResponseFusion) {
          operations.push(
            of(
              fusionSubmitReferralSuccess({
                claimNumber: submitReferralForms.claimNumber,
                customerId: submitReferralForms.customerId,
                successResponse: submitReferralForms.successResponseFusion
              })
            )
          );
        }

        if (
          submitReferralForms.errorResponse.length > 0 &&
          (submitReferralForms.coreReferralData ||
            submitReferralForms.successResponseFusion)
        ) {
          operations.push(
            of(
              removeSuccessServicesFormState({
                errorResponse: submitReferralForms.errorResponse
              })
            )
          );
          operations.push(of(partialFail()));
        }

        operations.push(of(submitReferralsDone()));
        return operations;
      }),
      mergeAll(1)
    )
  );

  setFailFormCoreFusion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitReferralFail),
      mergeMap((_) => {
        const operations: Observable<Action>[] = [];

        operations.push(of(submitReferralsDone()));
        operations.push(of(completeReferralSubmit()));
        return operations;
      }),
      mergeAll(1)
    )
  );

  private _hasDocuments(formState: { [key: string]: any }): boolean {
    const formKeys = Object.keys(formState);
    let hasDocuments = false;
    for (let i = 0; i < formKeys.length; i++) {
      const [, formName] = formKeys[i].split('-');
      if (
        formName === 'documents' &&
        !isEmpty(formState[formKeys[i]].documents)
      ) {
        hasDocuments = true;
        break;
      }
    }
    return hasDocuments;
  }

  private _handleSharedSubmit(
    submitMessage: ReferralSubmitMessage,
    successAction,
    failureAction
  ): Observable<Action> {
    return this.makeAReferralService.submitFusionReferral(submitMessage).pipe(
      map((response: ReferralSubmitResponseBundle) => {
        let services = [];
        let errorResponse = [];
        let coreReferralData = {};
        let successResponseFusion: SuccessSharedSubmitResponse = {};
        let serviceCount = 0;
        Object.keys(response).forEach((service) => {
          if (response[service] != null) {
            serviceCount++;
            if (response[service].error) {
              errorResponse.push({
                error: response[service].error,
                service: service,
                serviceLabel: this.SERVICES[service]
              });
            } else {
              services.push(this.SERVICES[service]);
              const { referralId, postSubmitData, isCore } = response[service];

              if (isCore) {
                coreReferralData = postSubmitData;
              } else {
                successResponseFusion[service] = {
                  referralId,
                  postSubmitData
                };
              }
            }
          }
        });

        // These are necessary to avoid sending a new state
        if (Object.keys(coreReferralData).length === 0) {
          coreReferralData = null;
        }
        if (Object.keys(successResponseFusion).length === 0) {
          successResponseFusion = null;
        }

        return successAction({
          claimNumber: submitMessage.claimNumber,
          customerId: submitMessage.customerId,
          coreReferralData,
          successResponseFusion,
          errorResponse: errorResponse,
          showSuccessBanner: !(errorResponse.length === serviceCount),
          successfulServices: services
        });
      }),
      catchError((err) => {
        const errorResponse: ErrorSharedMakeAReferral[] = [];
        errorResponse.push({
          service: err.statusText,
          error: {
            messages: [
              'Error in make a referral process, please try again later.'
            ],
            statusCode: err.status
          }
        });
        return of(failureAction({ errorResponse }));
      })
    );
  }
}
