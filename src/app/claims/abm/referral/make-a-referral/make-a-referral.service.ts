import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { generateQueryParams, getApiUrl, hexEncode } from '@shared';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { combineLatest, from, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  toArray,
  withLatestFrom
} from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { getUsername } from 'src/app/user/store/selectors/user.selectors';
import { environment } from 'src/environments/environment';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../store/selectors/router.selectors';
import {
  DocumentPickerModalComponent,
  DocumentPickerModalMode
} from '../components/document-picker-modal/document-picker-modal.component';
import {
  FusionAddLocationRequest,
  FusionApprovedLocation,
  FusionICDCode,
  FusionVendorAllocation,
  ReferralSubmitResponseBundle
} from '../store/models/fusion/fusion-make-a-referral.models';
import {
  CustomerServiceConfiguration,
  LocationType,
  MakeReferralOptions,
  ReferralBodyPart,
  ReferralLocationCreateRequest,
  ReferralManagementTransportationTypes,
  ReferralSubmitMessage,
  RequestorInformationOptions
} from '../store/models/make-a-referral.models';
import {
  AddLocationModalConfig
} from './components/add-location-modal/add-location-modal-config';
import {
  AddLocationModalComponent
} from './components/add-location-modal/add-location-modal.component';
import {
  UploadFilesProgressModalComponent
} from './components/upload-files-progress-modal/upload-files-progress-modal.component';
import { AncilliaryServiceCode } from './make-a-referral-shared';
import {
  ServiceSelectionModalComponent
} from './service-selection-modal/service-selection-modal.component';
import {
  AddNoteModalComponent
} from './transportation/components/add-note-modal/add-note-modal.component';
import { RemoveService } from '../store/actions/make-a-referral.actions';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  getSelectedServiceTypes
} from '../store/selectors/makeReferral.selectors';

@Injectable({ providedIn: 'root' })
export class MakeAReferralService {
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getDecodedClaimNumber)
  );
  decodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getDecodedCustomerId)
  );
  username$: Observable<string> = this.store$.pipe(select(getUsername));
  claimV2$: Observable<ClaimV3> = this.store$.pipe(select(getClaimV3));
  selectedServiceTypes$ = this.store$.pipe(select(getSelectedServiceTypes));

  constructor(
    private dialog: MatDialog,
    public router: Router,
    private confirmationModalService: ConfirmationModalService,
    public http: HttpClient,
    private store$: Store<RootState>
  ) {
  }

  getLanguageDraft(
    encodedReferralId: string
  ): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'languageDraft',
        generateQueryParams({ referralId: encodedReferralId })
      )
    );
  }

  getDiagnosticsDraft(
    encodedReferralId: string
  ): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'diagnosticsDraft',
        generateQueryParams({ referralId: encodedReferralId })
      )
    );
  }

  getDMEDraft(encodedReferralId: string): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'dmeDraft',
        generateQueryParams({ referralId: encodedReferralId })
      )
    );
  }

  getHomeHealthDraft(
    encodedReferralId: string
  ): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'homeHealthDraft',
        generateQueryParams({ referralId: encodedReferralId })
      )
    );
  }

  getPhysicalMedicineDraft(
    encodedReferralId: string
  ): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'physicalMedicineDraft',
        generateQueryParams({ referralId: encodedReferralId })
      )
    );
  }

  getTRPDraft(encodedReferralId: string): Observable<ReferralSubmitMessage> {
    return this.http.get<ReferralSubmitMessage>(
      getApiUrl(
        'trpDraft',
        generateQueryParams({ referralDraftId: encodedReferralId })
      )
    );
  }

  // Endpoint used for MAR (RFS), but is also being enhanced to support pm extension (referral)
  fusionUploadFileToReferral(
    referralId: number,
    file: File,
    claimNumber: string,
    insurancePayer: string,
    isForPmExtension: boolean = false,
    hesReferralDetailId?: number,
    archType?: string
  ) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append(
      'attachmentMetadata',
      JSON.stringify({
        claimNumber,
        insurancePayer,
        hesReferralId: referralId,
        hesReferralDetailId,
        archType
      })
    );
    formData.append('referralId', referralId.toString());
    formData.append('isForPmExtension', isForPmExtension.toString());
    return this.http.post(getApiUrl('fusionUploadFileToReferral'), formData);
  }

  uploadFileToReferral(referralIds: number[], file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('referralIds', referralIds.toString());
    return this.http.post(getApiUrl('uploadFileToReferral'), formData);
  }

  getMakeReferralOptions(serviceCode: string): Observable<MakeReferralOptions> {
    return combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$,
      this.claimV2$
    ]).pipe(
      first(),
      switchMap(([encodedClaimNumber, encodedCustomerId, claimV2]) =>
        this.http.get<MakeReferralOptions>(
          getApiUrl(
            'makeReferralOptions',
            generateQueryParams({
              serviceCode: serviceCode,
              claimNumber: encodedClaimNumber,
              customerId: encodedCustomerId,
              stateOfVenue: claimV2.stateOfVenue
            })
          )
        )
      )
    );
  }

  getReferralTransportationTypes(): Observable<ReferralManagementTransportationTypes> {
    return this.encodedCustomerId$.pipe(
      first(),
      switchMap((encodedCustomerId) =>
        this.http.get<ReferralManagementTransportationTypes>(
          getApiUrl(
            'referralTransportationTypes',
            generateQueryParams({ insurancePayer: encodedCustomerId })
          )
        )
      )
    );
  }

  public getFusionLocations(
    serviceCode: AncilliaryServiceCode,
    encodedClaimNumber: string,
    encodedCustomerId: string
  ): Observable<FusionApprovedLocation[]> {
    let hexServiceCode: String = null;
    if (serviceCode) {
      hexServiceCode = hexEncode(serviceCode);
    }

    return this.http.get<FusionApprovedLocation[]>(
      getApiUrl(
        'getLocationsForClaim',
        generateQueryParams({
          insurancePayer: encodedCustomerId,
          claimNumber: encodedClaimNumber,
          serviceCd: hexServiceCode
        })
      )
    );
  }

  public getCustomerServiceConfiguration(
    serviceCode: AncilliaryServiceCode,
    encodedCustomerId: string
  ): Observable<CustomerServiceConfiguration[]> {
    return this.http
      .get<CustomerServiceConfiguration[]>(
        getApiUrl('customerServiceConfiguration') +
        `/${serviceCode}?encodedCustomerId=${encodedCustomerId}`
      )
      .pipe(
        map((response: any) => {
          if (environment.remote) {
            return response;
          } else {
            return response.data;
          }
        })
      );
  }

  // Get Fusion Languages
  getReferralFusionLanguages(encodedCustomerId: string): Observable<string[]> {
    return this.http.get<string[]>(
      getApiUrl(
        'referralLanguages',
        generateQueryParams({ customerId: encodedCustomerId })
      )
    );
  }

  // Get Fusion ICD Codes
  getReferralFusionICDCodes(): Observable<FusionICDCode[]> {
    return combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$
    ]).pipe(
      first(),
      switchMap(([encodedClaimNumber, encodedCustomerId]) =>
        this.http.get<FusionICDCode[]>(
          getApiUrl(
            'fusionIcdCodes',
            generateQueryParams({
              claimNumber: encodedClaimNumber,
              customerId: encodedCustomerId
            })
          )
        )
      )
    );
  }

  // Get Fusion Location Types
  getReferralFusionLocationTypes(
    encodedCustomerId: string
  ): Observable<LocationType[]> {
    return this.http.get<LocationType[]>(
      getApiUrl(
        'locationTypes',
        generateQueryParams({ customerId: encodedCustomerId })
      )
    );
  }

  // Create Claim Location
  addNewClaimLocation(
    newLocation: ReferralLocationCreateRequest
  ): Observable<number> {
    return combineLatest([
      this.encodedCustomerId$,
      this.encodedClaimNumber$
    ]).pipe(
      first(),
      switchMap(([encodedCustomerId, encodedClaimNumber]) =>
        this.http.post<number>(
          getApiUrl(
            'makeReferralAddClaimLocation',
            generateQueryParams({
              claimNumber: encodedClaimNumber,
              customerId: encodedCustomerId
            })
          ),
          newLocation
        )
      )
    );
  }

  // Create Fusion Claim Location
  addNewFusionClaimLocation(
    newLocation: FusionAddLocationRequest
  ): Observable<{ httpStatus: number; locationId: string }> {
    return combineLatest([
      this.decodedCustomerId$,
      this.decodedClaimNumber$,
      this.username$
    ]).pipe(
      first(),
      switchMap(([customerId, claimNumber, username]) => {
        newLocation.claimNumber = claimNumber;
        newLocation.insurancePayer = customerId;
        newLocation.locationRequest.userCreated = username;
        return this.http
          .post<string>(getApiUrl('createLocationForClaim'), newLocation, {
            observe: 'response'
          })
          .pipe(
            map(({ status, body }) => ({
              httpStatus: status,
              locationId: body
            }))
          );
      })
    );
  }

  // Get Fusion Vendor Allocations
  getFusionVendorAllocation(
    serviceCode: AncilliaryServiceCode,
    encodedCustomerId: string,
    encodedClaimNumber: string,
    productTypeId?: number,
    productSubTypeId?: number
  ): Observable<FusionVendorAllocation> {
    return this.claimV2$.pipe(
      distinctUntilChanged(
        (claimV2, claimV22) => claimV22.stateOfVenue === claimV2.stateOfVenue
      ),
      switchMap((claimV2) => {
        return this.http.get<FusionVendorAllocation>(
          getApiUrl(
            'fusionVendorAllocations',
            generateQueryParams({
              serviceCode: serviceCode,
              claimNumber: encodedClaimNumber,
              customerId: encodedCustomerId,
              stateOfVenue: claimV2.stateOfVenue,
              productTypeId,
              productSubTypeId
            })
          )
        );
      })
    );
  }

  // Get Fusion Body Parts
  getFusionBodyPartsForClaim(
    encodedCustomerId: string,
    encodedClaimNumber: string
  ): Observable<ReferralBodyPart[]> {
    return this.http.get<ReferralBodyPart[]>(
      getApiUrl(
        'fusionBodyPartsForClaim',
        generateQueryParams({
          claimNumber: encodedClaimNumber,
          customerId: encodedCustomerId
        })
      )
    );
  }

  saveAsDraftTransportationReferral(
    formState: ReferralSubmitMessage
  ): Observable<any> {
    return this.http.post(
      getApiUrl('saveAsDraftTransportationReferral'),
      formState
    );
  }

  getRequestorInformationOptions(): Observable<RequestorInformationOptions> {
    return this.encodedCustomerId$.pipe(
      first(),
      switchMap((encodedCustomerId) =>
        this.http.get<RequestorInformationOptions>(
          getApiUrl(
            'requestorInformationOptions',
            generateQueryParams({
              encodedCustomerId: encodedCustomerId
            })
          )
        )
      )
    );
  }

  public displayAddLocationModal(
    config?: AddLocationModalConfig
  ): MatDialogRef<AddLocationModalComponent> {
    return this.dialog.open(AddLocationModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      data: config
    });
  }

  public displayUploadProgressModal(
    documentUploadMeta: Observable<{
      uploadedDocuments: number;
      totalDocuments: number;
    }>
  ): MatDialogRef<UploadFilesProgressModalComponent> {
    return this.dialog.open(UploadFilesProgressModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '300px',
      data: documentUploadMeta
    });
  }

  public displayAddDocumentsModal(
    formControl: FormControl,
    viewMode = DocumentPickerModalMode.ADD
  ): MatDialogRef<DocumentPickerModalComponent> {
    return this.dialog.open(DocumentPickerModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      height: '421px',
      data: { formControl, mode: viewMode }
    });
  }

  public displayAddServiceModal(): MatDialogRef<ServiceSelectionModalComponent> {
    return this.dialog.open(ServiceSelectionModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      height: '400px'
    });
  }

  public displayReferralNoteModal(
    editMessageText: string,
    notes: string,
    readOnly?: boolean
  ): MatDialogRef<AddNoteModalComponent> {
    return this.dialog.open(AddNoteModalComponent, {
      width: '50%',
      height: '460px',
      data: {
        editMessageText: editMessageText,
        notes: notes,
        readOnly: readOnly
      }
    });
  }

  public displayReferralNoteModalEditModeClosed(
    editMessageText: string,
    notes: string,
    readOnly?: boolean
  ) {
    return this.displayReferralNoteModal(editMessageText, notes, readOnly)
      .afterClosed()
      .pipe(filter((value) => typeof value === 'string' && !readOnly));
  }

  public removeService(type: string, activatedRoute: ActivatedRoute) {
    this.confirmationModalService
      .displayModal({
        titleString: 'Delete ' + type + ' Section?',
        bodyHtml: 'This section will be deleted.  Do you wish to continue?',
        affirmString: 'Yes',
        denyString: 'No'
      })
      .afterClosed()
      .pipe(withLatestFrom(this.selectedServiceTypes$), first())
      .subscribe(([isSure, selectedServices]) => {
        if (isSure) {
          this.store$.dispatch(new RemoveService(type));
          if (selectedServices.length === 1) {
            this.router.navigate(['../serviceSelection'], {
              relativeTo: activatedRoute
            });
          }
        }
      });
  }

  /**
   * Returns a response bundle with errors included with every
   * service type. If the error object is null, then the submit was successful
   * for that service typed referral
   * @example ``` javascript
   * {
   * // success
   *   language: {
   *     referralId: 1234,
   *     error: null
   *   },
   * // success
   *   diagnostics: {
   *     referralId: 52523,
   *     error: null
   *   },
   * // fail
   *   dme: {
   *     referralId: 0,
   *     error: {
   *       statusCode: 400,
   *       messages: ['One of the locations attached does not exist']
   *     }
   *   }
   * }
   *```
   */
  submitFusionReferral(
    formState: ReferralSubmitMessage
  ): Observable<ReferralSubmitResponseBundle> {
    return this.http.post<ReferralSubmitResponseBundle>(
      getApiUrl('fusionReferralSubmit'),
      formState
    );
  }

  fusionIcdCodeSearch(value: string): Observable<FusionICDCode[]> {
    let url: string;
    if (environment.remote) {
      url = getApiUrl('fusionIcdCodeSearch') + '?icdCode=' + value;
    } else {
      url = getApiUrl('fusionIcdCodeSearch');
    }

    return this.http.get<FusionICDCode[]>(url);
  }

  repairIcdCodes(incompleteIcdCodes: string[]): Observable<FusionICDCode[]> {
    return from(incompleteIcdCodes).pipe(
      mergeMap((icdCode) =>
        this.fusionIcdCodeSearch(icdCode).pipe(
          map((icds: FusionICDCode[]) => {
            if (icds && icds.length > 0) {
              const icdIndex = icds.findIndex((icd) => icd.code === icdCode);
              return icds[icdIndex] || null;
            } else {
              return null;
            }
          })
        )
      ),
      filter((icd) => icd !== null),
      map((icd) => ({ ...icd, displayText: icd.code.concat(' - ', icd.desc) })),
      toArray()
    );
  }
}
