import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { hexEncode } from '@shared';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { from, Observable, of } from 'rxjs';
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
import { RootState } from 'src/app/store/models/root.models';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';
import { ClaimsService } from '../../../../../claims.service';
import { MakeAReferralHelperService } from '../../../make-a-referral/make-a-referral-helper.service';
import {
  AncilliaryServiceCode,
  buildLocationAddressDisplayTextStrings
} from '../../../make-a-referral/make-a-referral-shared';
import { MakeAReferralService } from '../../../make-a-referral/make-a-referral.service';
import { ReferralService } from '../../../referral.service';
import * as fromFusionActions from '../../actions/fusion/fusion-make-a-referral.actions';
import {
  addFusionLocation,
  addFusionLocationFail,
  addFusionLocationSuccess,
  fusionSaveAsDraftFail,
  fusionSaveAsDraftSuccess,
  fusionSubmitReferralFail,
  fusionSubmitReferralSuccess,
  loadDiagnosticsCustomerServiceConfigurations,
  loadDiagnosticsCustomerServiceConfigurationsFail,
  loadDiagnosticsCustomerServiceConfigurationsSuccess,
  loadDMECustomerServiceConfigurations,
  loadDMECustomerServiceConfigurationsFail,
  loadDMECustomerServiceConfigurationsSuccess,
  loadFusionApprovedLocations,
  loadFusionApprovedLocationsFail,
  loadFusionApprovedLocationsSuccess,
  loadFusionBodyParts,
  loadFusionBodyPartsFail,
  loadFusionBodyPartsSuccess,
  loadFusionICDCodes,
  loadFusionLanguageFail,
  loadFusionLanguages,
  loadFusionLanguageSuccess,
  loadFusionVendorAllocations,
  loadFusionVendorAllocationsFail,
  loadFusionVendorAllocationsSuccess,
  loadHomeHealthCustomerServiceConfigurations,
  loadHomeHealthCustomerServiceConfigurationsFail,
  loadHomeHealthCustomerServiceConfigurationsSuccess,
  loadLanguageCustomerServiceConfigurations,
  loadLanguageCustomerServiceConfigurationsFail,
  loadLanguageCustomerServiceConfigurationsSuccess,
  loadLocationTypes,
  loadLocationTypesFail,
  loadPhysicalMedicineCustomerServiceConfigurations,
  loadPhysicalMedicineCustomerServiceConfigurationsFail,
  loadPhysicalMedicineCustomerServiceConfigurationsSuccess,
  uploadFusionDocument,
  uploadFusionDocumentFail,
  uploadFusionDocumentSuccess
} from '../../actions/fusion/fusion-make-a-referral.actions';
import {
  loadDiagnosticsDraft,
  loadDiagnosticsDraftFail,
  loadDiagnosticsDraftSuccessful,
  loadDMEDraft,
  loadDMEDraftFail,
  loadDMEDraftSuccessful,
  loadHomeHealthDraft,
  loadHomeHealthDraftFail,
  loadHomeHealthDraftSuccessful,
  loadLanguageDraft,
  loadLanguageDraftFail,
  loadLanguageDraftSuccessful,
  loadPhysicalMedicineDraft,
  loadPhysicalMedicineDraftFail,
  loadPhysicalMedicineDraftSuccessful
} from '../../actions/make-a-referral-draft.actions';
import {
  SetSectionStatus,
  SetSelectedServiceDetailTypes
} from '../../actions/make-a-referral.actions';
import {
  FusionAddLocationRequest,
  FusionICDCode
} from '../../models/fusion/fusion-make-a-referral.models';
import {
  ClaimLocation,
  ReferralLocationCreateRequest
} from '../../models/make-a-referral.models';
import { getFormStateByName } from '../../selectors/makeReferral.selectors';
import { Router } from '@angular/router';

@Injectable()
export class FusionMakeAReferralEffects {
  getFusionLanguageOptions$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionLanguages),
      mergeMap(({ encodedCustomerId }) => {
        return this.makeAReferralService
          .getReferralFusionLanguages(encodedCustomerId)
          .pipe(
            map((languages) => loadFusionLanguageSuccess({ languages })),
            catchError((errors) => of(loadFusionLanguageFail({ errors })))
          );
      })
    )
  );

  getLanguageCustomerServiceConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanguageCustomerServiceConfigurations),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getCustomerServiceConfiguration(
            AncilliaryServiceCode.LAN,
            encodedCustomerId
          )
          .pipe(
            map((customerServiceConfigurations) =>
              loadLanguageCustomerServiceConfigurationsSuccess({
                customerServiceConfigurations
              })
            ),
            catchError((errors) =>
              of(
                loadLanguageCustomerServiceConfigurationsFail({
                  errors
                })
              )
            )
          )
      )
    )
  );

  loadLanguageDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanguageDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getLanguageDraft(hexEncode(action.referralId + ''))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadLanguageDraftSuccessful(response);
            }),
            catchError((error) =>
              of(loadLanguageDraftFail({ errors: [error] }))
            )
          )
      )
    )
  );

  getLanguageDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanguageDraftSuccessful),
      tap(({ claimNumber, customerId }) =>
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ])
      ),
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
            ['Language'],
            encodedCustomerId,
            encodedClaimNumber
          ),

          new SetSectionStatus({ Language: 'wizard' }),
          new SetSelectedServiceDetailTypes({ Language: subServiceTypes }),
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.LAN,
            encodedCustomerId,
            encodedClaimNumber
          }),
          loadLocationTypes({ encodedCustomerId }),
          loadFusionLanguages({ encodedCustomerId })
        ];
      })
    )
  );

  loadPhysicalMedicineDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPhysicalMedicineDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getPhysicalMedicineDraft(hexEncode(action.referralId + ''))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadPhysicalMedicineDraftSuccessful(response);
            }),
            catchError((error) =>
              of(loadPhysicalMedicineDraftFail({ errors: [error] }))
            )
          )
      )
    )
  );

  getPhysicalMedicineDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPhysicalMedicineDraftSuccessful),
      tap(({ claimNumber, customerId }) =>
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ])
      ),
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
            ['Physical Medicine'],
            encodedCustomerId,
            encodedClaimNumber
          ),

          new SetSectionStatus({ 'Physical Medicine': 'wizard' }),
          new SetSelectedServiceDetailTypes({
            'Physical Medicine': subServiceTypes
          }),
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.PM,
            encodedCustomerId,
            encodedClaimNumber
          }),
          loadFusionBodyParts({ encodedClaimNumber, encodedCustomerId }),
          loadLocationTypes({ encodedCustomerId }),
          loadFusionLanguages({ encodedCustomerId })
        ];
      })
    )
  );

  loadDiagnosticsDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDiagnosticsDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getDiagnosticsDraft(hexEncode(action.referralId + ''))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadDiagnosticsDraftSuccessful(response);
            }),
            catchError((error) =>
              of(loadDiagnosticsDraftFail({ errors: [error] }))
            )
          )
      )
    )
  );

  getDiagnosticsDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDiagnosticsDraftSuccessful),
      tap(({ claimNumber, customerId }) =>
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ])
      ),
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
            ['Diagnostics'],
            encodedCustomerId,
            encodedClaimNumber
          ),

          new SetSectionStatus({ Diagnostics: 'wizard' }),
          new SetSelectedServiceDetailTypes({ Diagnostics: subServiceTypes }),
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.DX,
            encodedCustomerId,
            encodedClaimNumber
          }),
          loadFusionBodyParts({ encodedClaimNumber, encodedCustomerId }),
          loadLocationTypes({ encodedCustomerId })
        ];
      })
    )
  );

  loadHomeHealthDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHomeHealthDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getHomeHealthDraft(hexEncode(action.referralId + ''))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadHomeHealthDraftSuccessful(response);
            }),
            catchError((error) =>
              of(loadHomeHealthDraftFail({ errors: [error] }))
            )
          )
      )
    )
  );

  getHomeHealthDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHomeHealthDraftSuccessful),
      tap(({ claimNumber, customerId }) =>
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ])
      ),
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
            ['Home Health'],
            encodedCustomerId,
            encodedClaimNumber
          ),

          new SetSectionStatus({ 'Home Health': 'wizard' }),
          new SetSelectedServiceDetailTypes({
            'Home Health': subServiceTypes
          }),
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.HH,
            encodedCustomerId,
            encodedClaimNumber
          }),
          loadLocationTypes({ encodedCustomerId })
        ];
      })
    )
  );

  loadDMEDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDMEDraft),
      mergeMap((action) =>
        this.makeAReferralService
          .getDMEDraft(hexEncode(action.referralId + ''))
          .pipe(
            map((response) => {
              response.referralId = action.referralId;
              return loadDMEDraftSuccessful(response);
            }),
            catchError((error) => of(loadDMEDraftFail({ errors: [error] })))
          )
      )
    )
  );

  getDMEDraftMARSetup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDMEDraftSuccessful),
      tap(({ claimNumber, customerId }) =>
        this.router.navigate([
          `/claims/${hexEncode(customerId)}/${hexEncode(
            claimNumber
          )}/referral/create`
        ])
      ),
      switchMap((action) => {
        Object.keys(action.formValues).filter((subType) => {
          const segs = subType.split('-');
          return segs[1] !== 'vendors' && segs[1] !== 'documents';
        });
        const { customerId, claimNumber } = action;
        const encodedClaimNumber = hexEncode(claimNumber);
        const encodedCustomerId = hexEncode(customerId);
        return [
          ...this.makeAReferralHelperService.getPrepareServiceActions(
            ['DME'],
            encodedCustomerId,
            encodedClaimNumber
          ),
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.DME,
            encodedCustomerId,
            encodedClaimNumber
          })
        ];
      })
    )
  );

  getDiagnosticsCustomerServiceConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDiagnosticsCustomerServiceConfigurations),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getCustomerServiceConfiguration(
            AncilliaryServiceCode.DX,
            encodedCustomerId
          )
          .pipe(
            map((customerServiceConfigurations) =>
              loadDiagnosticsCustomerServiceConfigurationsSuccess({
                customerServiceConfigurations
              })
            ),
            catchError((errors) =>
              of(
                loadDiagnosticsCustomerServiceConfigurationsFail({
                  errors
                })
              )
            )
          )
      )
    )
  );

  getPhysicalMedicineCustomerServiceConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPhysicalMedicineCustomerServiceConfigurations),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getCustomerServiceConfiguration(
            AncilliaryServiceCode.PM,
            encodedCustomerId
          )
          .pipe(
            map((customerServiceConfigurations) =>
              loadPhysicalMedicineCustomerServiceConfigurationsSuccess({
                customerServiceConfigurations
              })
            ),
            catchError((errors) =>
              of(
                loadPhysicalMedicineCustomerServiceConfigurationsFail({
                  errors
                })
              )
            )
          )
      )
    )
  );

  // Home Health Configuration
  getHomeHealthCustomerServiceConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHomeHealthCustomerServiceConfigurations),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getCustomerServiceConfiguration(
            AncilliaryServiceCode.HH,
            encodedCustomerId
          )
          .pipe(
            map((customerServiceConfigurations) =>
              loadHomeHealthCustomerServiceConfigurationsSuccess({
                customerServiceConfigurations
              })
            ),
            catchError((errors) =>
              of(
                loadHomeHealthCustomerServiceConfigurationsFail({
                  errors
                })
              )
            )
          )
      )
    )
  );

  // DME Configuration
  getDMECustomerServiceConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDMECustomerServiceConfigurations),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getCustomerServiceConfiguration(
            AncilliaryServiceCode.DME,
            encodedCustomerId
          )
          .pipe(
            map((customerServiceConfigurations) =>
              loadDMECustomerServiceConfigurationsSuccess({
                customerServiceConfigurations
              })
            ),
            catchError((errors) =>
              of(
                loadDMECustomerServiceConfigurationsFail({
                  errors
                })
              )
            )
          )
      )
    )
  );

  // Locations
  getFusionLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionApprovedLocations, addFusionLocationSuccess),
      mergeMap(({ serviceCode, encodedClaimNumber, encodedCustomerId }) =>
        this.makeAReferralService
          .getFusionLocations(
            serviceCode,
            encodedClaimNumber,
            encodedCustomerId
          )
          .pipe(
            map((payload) => {
              // Mapping from the Fusion specific location object
              // and the component shared object.
              const refLocations: ClaimLocation[] = [];
              payload.forEach((entry) =>
                refLocations.push({
                  id: entry.claimInfoAddressId,
                  address: buildLocationAddressDisplayTextStrings(
                    entry.streetAddress1,
                    entry.streetAddress2,
                    entry.city,
                    entry.state,
                    entry.zipCode,
                    null
                  ),
                  name: entry.name,
                  type: entry.locationTypeDescription
                })
              );
              let locations = {
                referralLocations: {}
              };
              locations.referralLocations[serviceCode] = refLocations;
              return loadFusionApprovedLocationsSuccess(locations);
            }),
            catchError((err) =>
              of(loadFusionApprovedLocationsFail({ errors: [err] }))
            )
          )
      )
    )
  );

  // Get ICD Codes
  getFusionICDCodes$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionICDCodes),
      mergeMap(() => {
        return this.makeAReferralService.getReferralFusionICDCodes().pipe(
          map((codes) =>
            fromFusionActions.loadFusionICDCodesSuccess({
              icdCodes: codes.map((icdCode: FusionICDCode) => {
                return {
                  ...icdCode,
                  isNew: false,
                  isDeleted: false,
                  displayText: icdCode.code.concat(' - ', icdCode.desc)
                };
              })
            })
          ),
          catchError((errors) =>
            of(fromFusionActions.loadFusionICDCodesFail({ errors }))
          )
        );
      })
    )
  );

  // Location Types
  getFusionLocationTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocationTypes),
      mergeMap(({ encodedCustomerId }) =>
        this.makeAReferralService
          .getReferralFusionLocationTypes(encodedCustomerId)
          .pipe(
            map((payload) =>
              fromFusionActions.loadLocationTypesSuccess({
                locationTypes: payload
              })
            ),
            catchError((err) => of(loadLocationTypesFail({ errors: [err] })))
          )
      )
    )
  );

  // Fusion Vendor Allocation
  getFusionVendorAllocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionVendorAllocations),
      mergeMap(
        ({
          ancillaryServiceCode,
          encodedClaimNumber,
          encodedCustomerId,
          serviceProductTypeId,
          serviceProductSubTypeId
        }) =>
          this.makeAReferralService
            .getFusionVendorAllocation(
              ancillaryServiceCode,
              encodedCustomerId,
              encodedClaimNumber,
              serviceProductTypeId,
              serviceProductSubTypeId
            )
            .pipe(
              map((payload) => {
                payload.serviceType = this.makeAReferralHelperService.parseAncilliaryServiceCodeToServiceType(
                  ancillaryServiceCode
                );
                return loadFusionVendorAllocationsSuccess({
                  vendorAllocation: payload
                });
              }),
              catchError((err) =>
                of(loadFusionVendorAllocationsFail({ errors: [err] }))
              )
            )
      )
    )
  );

  // Get Fusion Body Parts
  getFusionBodyPartsForClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFusionBodyParts),
      mergeMap(({ encodedClaimNumber, encodedCustomerId }) =>
        this.makeAReferralService
          .getFusionBodyPartsForClaim(encodedCustomerId, encodedClaimNumber)
          .pipe(
            map((payload) =>
              loadFusionBodyPartsSuccess({
                bodyParts: payload
              })
            ),
            catchError((err) => of(loadFusionBodyPartsFail({ errors: [err] })))
          )
      )
    )
  );

  // Add Location
  newFusionClaimLocationRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addFusionLocation),
        mergeMap((action) => {
          const { encodedCustomerId, encodedClaimNumber, serviceCode } = action;
          let location: ReferralLocationCreateRequest = action.newLocation;
          let fusionLocation: FusionAddLocationRequest = {
            locationRequest: {
              name: location.locationName,
              phone: location.locationPhone,
              type: location.type,
              typeDescription: location.typeDescription,
              address: location.address
            }
          };
          return this.makeAReferralService
            .addNewFusionClaimLocation(fusionLocation)
            .pipe(
              map(({ httpStatus, locationId }) => {
                switch (httpStatus) {
                  // Duplicated address
                  case 409: {
                    const message = ERROR_MESSAGES.duplicateAddClaimLocation;
                    this.snackBarService.showError([message]);
                    return addFusionLocationFail({
                      error: message
                    });
                  }
                  // ABM Fusion Management Server Error
                  case 500: {
                    const message = ERROR_MESSAGES.otherAddClaimLocation;
                    this.snackBarService.showError([message]);
                    return addFusionLocationFail({
                      error: message
                    });
                  }
                  // Created
                  case 201: {
                    location.id = parseInt(locationId, 10);
                    return addFusionLocationSuccess({
                      status: httpStatus,
                      newLocation: location,
                      encodedCustomerId,
                      encodedClaimNumber,
                      serviceCode
                    });
                  }
                }
              }),
              catchError((error) => {
                this.snackBarService.showError([
                  'Failed to add a new location, please try again.'
                ]);
                return of(
                  addFusionLocationFail({
                    error: error
                  })
                );
              })
            );
        })
      ),
    { useEffectsErrorHandler: true }
  );

  fusionUploadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fusionSubmitReferralSuccess),
      switchMap(({ successResponse, claimNumber, customerId }) => {
        const submittedServices = Object.keys(successResponse);
        return from(submittedServices).pipe(
          switchMap((serviceName) =>
            this.store$.pipe(
              first(),
              select(
                getFormStateByName({
                  formStateChild: `${serviceName}-documents`,
                  useReturnedValues: false
                })
              ),
              filter((state) => {
                if (Object.keys(state).length > 0) {
                  return state.documents.length > 0;
                }
              }),
              map(
                (documentsFormState): Action[] => {
                  const { referralId } = successResponse[serviceName];
                  return documentsFormState.documents.map(
                    ({ file: document }) =>
                      uploadFusionDocument({
                        claimNumber,
                        customerId,
                        referralId,
                        document,
                        serviceName
                      })
                  );
                }
              ),
              concatAll()
            )
          )
        );
      })
    )
  );

  uploadFusionDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadFusionDocument),
      mergeMap(
        ({
          referralId,
          document,
          serviceName,
          claimNumber,
          customerId,
          isForPmExtension,
          hesReferralDetailId
        }) =>
          this.makeAReferralService
            .fusionUploadFileToReferral(
              referralId,
              document,
              claimNumber,
              customerId,
              isForPmExtension,
              hesReferralDetailId
            )
            .pipe(
              map((response) => {
                return uploadFusionDocumentSuccess();
              }),
              catchError((error) => {
                this.referralService.addFailedDocument(
                  document.name,
                  serviceName
                );
                return of(
                  uploadFusionDocumentFail({
                    errors: ['Failed to upload ' + document.name]
                  })
                );
              })
            )
      )
    )
  );

  saveAsDraftSuccessFeedback$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fusionSaveAsDraftSuccess),
        tap(() => {
          this.snackBarService.showSuccess(
            'You have successfully saved this referral as a draft.'
          );
        })
      ),
    { dispatch: false }
  );

  saveAsDraftFailFeedback$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fusionSaveAsDraftFail),
        tap(({ errors }) => {
          this.snackBarService.showError([
            'Some thing went wrong saving this referral as draft.',
            ...errors
          ]);
        })
      ),
    { dispatch: false }
  );

  failureFeedback$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fusionSubmitReferralFail),
        tap(({ errors }) => {
          this.snackBarService.showError(errors);
        })
      ),
    { dispatch: false }
  );

  constructor(
    public actions$: Actions,
    public router: Router,
    public store$: Store<RootState>,
    public snackBarService: HealtheSnackBarService,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public makeAReferralService: MakeAReferralService,
    public claimsService: ClaimsService,
    private referralService: ReferralService
  ) {}
}
