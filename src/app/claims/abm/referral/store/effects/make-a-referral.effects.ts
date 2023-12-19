import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  concatAll,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';

import { RootState } from '../../../../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import {
  ERROR_MESSAGES
} from '@shared/constants/form-field-validation-error-messages';
import {
  AncilliaryServiceCode
} from '../../make-a-referral/make-a-referral-shared';
import {
  MakeAReferralService
} from '../../make-a-referral/make-a-referral.service';
import { ReferralService } from '../../referral.service';
import {
  ActionType,
  addTransportationLocation,
  addTransportationLocationFailure,
  addTransportationLocationSuccess,
  GetServiceSelectionValuesFailure,
  GetServiceSelectionValuesSuccess,
  GetTransportationOptionsFailure,
  GetTransportationOptionsSuccess,
  GetTransportationTypesFailure,
  GetTransportationTypesSuccess,
  requestRequestorInformationOptions,
  requestRequestorInformationOptionsFail,
  requestRequestorInformationOptionsSuccess,
  SetSectionStatus,
  SetSelectedServiceDetailTypes,
  submitTransportationReferralSuccess,
  uploadTransportationDocument,
  uploadTransportationDocumentFail,
  uploadTransportationDocumentSuccess
} from '../actions/make-a-referral.actions';
import {
  DocumentTableItem,
  ReferralLocationCreateRequest
} from '../models/make-a-referral.models';
import { getFormStateByName } from '../selectors/makeReferral.selectors';
import {
  loadTRPDraft,
  loadTRPDraftFail,
  loadTRPDraftSuccessful
} from '../actions/make-a-referral-draft.actions';
import { hexEncode } from '@shared';
import { Router } from '@angular/router';
import {
  MakeAReferralHelperService
} from '../../make-a-referral/make-a-referral-helper.service';

@Injectable()
export class MakeAReferralEffects {
  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));

  processSelectableServices$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.GET_SERVICE_SELECTION_VALUES),
      mergeMap(() => {
        return combineLatest([
          this.encodedCustomerId$,
          this.encodedClaimNumber$
        ]).pipe(
          first(),
          mergeMap(([encodedCustomerId, encodedClaimNumber]) => {
            return this.referralService
              .getMakeReferralServices(encodedCustomerId, encodedClaimNumber)
              .pipe(
                map((response) => {
                  return new GetServiceSelectionValuesSuccess(
                    response.sort((a, b) =>
                      a.serviceType.localeCompare(b.serviceType))
                  );
                }),
                catchError((error) => {
                  return of(new GetServiceSelectionValuesFailure(error));
                })
              );
          })
        );
      })
    )
  );

  getServiceOptions$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.GET_TRANSPORTATION_OPTIONS),
      mergeMap(() => {
        return this.makeAReferralService
          .getMakeReferralOptions(AncilliaryServiceCode.TRP)
          .pipe(
            map((response) => {
              return new GetTransportationOptionsSuccess(response);
            }),
            catchError((error) => {
              return of(new GetTransportationOptionsFailure(error));
            })
          );
      })
    )
  );

  getTransportationTypes$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.GET_TRANSPORTATION_TYPES),
      mergeMap(() => {
        return this.makeAReferralService.getReferralTransportationTypes().pipe(
          map((response) => {
            return new GetTransportationTypesSuccess(response);
          }),
          catchError((error) => {
            return of(new GetTransportationTypesFailure(error));
          })
        );
      })
    )
  );

  newClaimLocationRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTransportationLocation),
      mergeMap((action) => {
        let location: ReferralLocationCreateRequest = action['newLocation'];
        return this.makeAReferralService.addNewClaimLocation(location).pipe(
          map((responseId) => {
            location.id = responseId;
            return addTransportationLocationSuccess({
              newLocation: location
            });
          }),
          catchError((error: HttpErrorResponse) => {
            switch (error.status) {
              case 409:
                this.snackBarService.showError([
                  ERROR_MESSAGES.duplicateAddClaimLocation
                ]);
                return of(addTransportationLocationFailure());
              default:
                this.snackBarService.showError([
                  ERROR_MESSAGES.otherAddClaimLocation
                ]);
                return of(addTransportationLocationFailure());
            }
          })
        );
      })
    )
  );

  transportationUploadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitTransportationReferralSuccess),
      map((action) => {
        let referralIds: number[] = [];
        const formValues = action['referralData'].formValues;

        Object.keys(formValues).forEach((formName) => {
          // skip the formStates that don't have referralIds (vendors, documents, etc.)
          if (formValues[formName].referralId) {
            referralIds.push(formValues[formName].referralId);
          }
        });

        this.referralService.clearFailedDocuments();

        // Trim duplicate referralIds if a transportation mar wizard generated a
        // single referral with multiple services on it (i.e. sedan and flight)
        referralIds = Array.from(new Set(referralIds));

        return referralIds;
      }),
      switchMap((referralIds) => {
        return this.store$.pipe(
          first(),
          select(
            getFormStateByName({
              formStateChild: 'transportation-documents',
              useReturnedValues: false
            })
          ),
          map((state) => state.documents),
          filter((documents: DocumentTableItem[]) => documents.length > 0),
          map((documents) => {
            return documents.map(({ file: document }) =>
              uploadTransportationDocument({ referralIds, document })
            );
          }),
          concatAll()
        );
      })
    )
  );

  uploadTransportationDocument = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadTransportationDocument),
      mergeMap(({ referralIds, document }) =>
        this.makeAReferralService
          .uploadFileToReferral(referralIds, document)
          .pipe(
            map(() => {
              return uploadTransportationDocumentSuccess();
            }),
            catchError(() => {
              this.referralService.addFailedDocument(
                document.name,
                'transportation'
              );
              return of(
                uploadTransportationDocumentFail({
                  errors: ['Failed to upload ' + document.name]
                })
              );
            })
          )
      )
    )
  );

  getRequestorInformationOptions = createEffect(() =>
    this.actions$.pipe(
      ofType(requestRequestorInformationOptions),
      mergeMap(() => {
        return this.makeAReferralService.getRequestorInformationOptions().pipe(
          map((response) =>
            requestRequestorInformationOptionsSuccess({
              requestorInformationOptions: response
            })
          ),
          catchError((error: any) => {
            console.log('TODO: Finish error handling', error);
            // Probably open a modal and stop navigation... route guard on having no errors?
            return of(
              requestRequestorInformationOptionsFail({
                errors: ['Something went wrong']
              })
            );
          })
        );
      })
    )
  );

  loadTRPDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTRPDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getTRPDraft(hexEncode(action.referralId))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadTRPDraftSuccessful(response);
            }),
            catchError((error) => of(loadTRPDraftFail({ errors: [error] })))
          )
      )
    )
  );

  getTRPDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTRPDraftSuccessful),
      tap(({ claimNumber, customerId }) => {
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ]);
      }),
      switchMap((action) => {
        const subServiceTypes = Object.keys(action.formValues).filter(
          (subType) => {
            const segs = subType.split('-');
            return segs[1] !== 'vendors' && segs[1] !== 'documents';
          }
        );
        const { customerId, claimNumber } = action;
        const encodedClaimNumber = hexEncode(claimNumber);
        const encodedCustomerId = hexEncode(customerId);
        return [
          ...this.makeAReferralHelperService.getPrepareServiceActions(
            ['Transportation'],
            encodedCustomerId,
            encodedClaimNumber
          ),
          new SetSectionStatus({ Transportation: 'wizard' }),
          new SetSelectedServiceDetailTypes({
            Transportation: subServiceTypes
          })
        ];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private referralService: ReferralService,
    private makeAReferralService: MakeAReferralService,
    private store$: Store<RootState>,
    private snackBarService: HealtheSnackBarService,
    private router: Router,
    private makeAReferralHelperService: MakeAReferralHelperService
  ) {
  }
}
