import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { FeatureFlagService } from '../../../../../customer-configs/feature-flag.service';
import { ReferralSubmitError } from '../../store/models/fusion/fusion-make-a-referral.models';
import {
  ActionReasonSelectSet,
  AuthApprovalState,
  ReferralAuthorizationAction,
  ReferralAuthorizationArchetype,
  ReferralAuthorizationOptions,
  ReferralAuthorizationSet
} from './referral-authorization.models';
import { RootState } from 'src/app/store/models/root.models';
import { Store } from '@ngrx/store';
import { loadReferralAuthorizationSet } from '../../store/actions/referral-authorization.actions';
import {
  loadFusionDiagnosticsAuthorizations,
  loadFusionDmeAuthorizations,
  loadFusionHomeHealthAuthorizations,
  loadFusionLanguageAuthorizations,
  loadFusionPhysicalMedicineAuthorizations
} from '../../store/actions/fusion/fusion-authorization.actions';
import { apiUrls } from '../../../../../apiUrls';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

export interface AuthorizationActionSetStatus {
  authApprovalState: AuthApprovalState;
  reason: string;
}

export interface AuthActionEvent {
  didUserChangeAuthStateOrReason: boolean;
  actionFromFooter: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationInformationService {
  public setApproval = new Subject<AuthorizationActionSetStatus>();
  public showValidationErrors = new Subject();
  public reloadActivityData = new Subject();
  public resetFormEvent = new Subject();
  public didUserChangeAuthStateOrReason = new BehaviorSubject<AuthActionEvent>({
    didUserChangeAuthStateOrReason: false,
    actionFromFooter: false
  });
  public isAuthInformationValid = new BehaviorSubject<boolean>(false);

  // It is currently unknown what the real range will be or where this range will come from.
  public numberOfTravelersOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public denialReasonSelectSet: ActionReasonSelectSet = {
    selectReasons: [],
    selectLabel: '*DR* Reason',
    selectPlaceholder: 'Select *DR* Explanation',
    errorMessage: 'Select a *DR* reason'
  };
  public pendingReasonSelectSet: ActionReasonSelectSet = {
    selectReasons: [],
    selectLabel: 'Pend Type',
    selectPlaceholder: 'Select Pend Type',
    errorMessage: 'Select a pend type'
  };


  // ABM Authorization Parent FormGroup
  abmAuthorizationFormGroup: FormGroup = this.formBuilder.group({
    abmFusionFormGroup: this.formBuilder.group({
      abmLanguageAuthorizationFormGroup: this.formBuilder.group({
      }),
      notesFormControl: this.formBuilder.control([]),
      fusionFormArray: this.formBuilder.array([])
    }),
  });



  private uniqueId = 0;

  constructor(
    public http: HttpClient,
    private featureFlagService: FeatureFlagService,
    private store$: Store<RootState>,
    private formBuilder: FormBuilder,
  ) {
    const Denial: string = this.featureFlagService.labelChange(
      'Denial',
      'denial'
    );
    const denial = Denial.toLowerCase();

    this.denialReasonSelectSet.selectLabel = this.denialReasonSelectSet.selectLabel.replace(
      '*DR*',
      Denial
    );
    this.denialReasonSelectSet.selectPlaceholder = this.denialReasonSelectSet.selectPlaceholder.replace(
      '*DR*',
      Denial
    );
    this.denialReasonSelectSet.errorMessage = this.denialReasonSelectSet.errorMessage.replace(
      '*DR*',
      denial
    );
  }

  // ABM Fusion FormGroup
  get abmFusionFormGroup(): FormGroup {
    return this.abmAuthorizationFormGroup.get('abmFusionFormGroup') as FormGroup;
  }

  get abmLanguageAuthorizationFormGroup(): FormGroup {
    return this.abmFusionFormGroup
    .get('abmLanguageAuthorizationFormGroup') as FormGroup;
  }

  get fusionFormArray(): FormArray {
    return this.abmFusionFormGroup
    .get('fusionFormArray') as FormArray;
  }

  public init(encodedCustomerId: string) {
    this.getReferralAuthorizationOptions(encodedCustomerId).subscribe(
      (options) => {
        this.denialReasonSelectSet.selectReasons = options.denialReasons;
        this.pendingReasonSelectSet.selectReasons = options.pendingReasons;
      }
    );
  }

  getReferralManualAuthorizationItems(
    encodedCustomerId: string,
    encodedReferralId: string,
    encodedClaimNumber: string
  ): Observable<ReferralAuthorizationSet> {
    return this.http.get<ReferralAuthorizationSet>(
      this.getReferralApiUrl(
        'referralManualAuthorizationItems',
        generateQueryParams({
          encodedCustomerId,
          encodedReferralId,
          encodedClaimNumber
        })
      )
    );
  }

  getReferralCurrentAuthorizationItems(
    encodedCustomerId: string,
    encodedReferralId: string,
    encodedClaimNumber: string
  ): Observable<ReferralAuthorizationSet> {
    return this.http.get<ReferralAuthorizationSet>(
      this.getReferralApiUrl(
        'referralCurrentAuthorizationItems',
        generateQueryParams({
          encodedCustomerId,
          encodedReferralId,
          encodedClaimNumber
        })
      )
    );
  }

  getReferralAuthorizationActions(
    encodedCustomerId: string,
    encodedReferralId: string,
    encodedClaimNumber: string
  ): Observable<ReferralAuthorizationAction> {
    return this.http.get<ReferralAuthorizationAction>(
      this.getReferralApiUrl(
        'referralAuthorizationActions',
        generateQueryParams({
          encodedCustomerId,
          encodedReferralId,
          encodedClaimNumber
        })
      )
    );
  }

  postOpenTransportationAuthorizationModification(
    encodedReferralId: string,
    formValues: any
  ): Observable<VerticeResponse<any>> {
    const url = this.getReferralApiUrl(
      'openTransportationAuthorizationModification',
      generateQueryParams({
        encodedReferralId
      })
    );
    let requestBody = { ...formValues };
    this.nukeByObjectKey(requestBody, 'icon');

    delete requestBody.documents;
    requestBody.authItems[0].authorizationId =
      requestBody.authItems[0].authData.authorizationId;
    requestBody.authItems[0].authorizationTypeCode =
      requestBody.authItems[0].authData.authorizationTypeCode;
    requestBody.authItems[0].typeOfTransportation =
      requestBody.authItems[0].authData.typeOfTransportation;
    requestBody.authItems[0].wheelchairType =
      requestBody.authItems[0].authData.wheelchairType;

    return this.http.post(url, requestBody) as Observable<VerticeResponse<any>>;
  }

  postOpenTransportationAuthorization(
    encodedCustomerId: string,
    encodedReferralId: string,
    formValues: any
  ): Observable<ReferralSubmitError> {
    const url = this.getReferralApiUrl(
      'openTransportationAuthorization',
      generateQueryParams({
        encodedCustomerId,
        encodedReferralId
      })
    );
    let requestBody = { ...formValues };
    this.nukeByObjectKey(requestBody, 'icon');

    delete requestBody.documents;
    requestBody.authItems[0].authorizationId =
      requestBody.authItems[0].authData.authorizationId;
    requestBody.authItems[0].authorizationTypeCode =
      requestBody.authItems[0].authData.authorizationTypeCode;
    requestBody.authItems[0].typeOfTransportation =
      requestBody.authItems[0].authData.typeOfTransportation;
    requestBody.authItems[0].wheelchairType =
      requestBody.authItems[0].authData.wheelchairType;

    return this.http.post(url, requestBody) as Observable<ReferralSubmitError>;
  }

  postDetailedTransportationAuthorization(
    encodedCustomerId: string,
    encodedReferralId: string,
    formValues: any
  ): Observable<ReferralSubmitError> {
    const url = this.getReferralApiUrl(
      'detailedTransportationAuthorization',
      generateQueryParams({
        encodedCustomerId,
        encodedReferralId
      })
    );
    let requestBody = { ...formValues };
    // There are a bunch of junk icon objects stored for some reason which make it difficult to debug
    this.nukeByObjectKey(requestBody, 'icon');
    requestBody.authItems.forEach((authItem) => {
      authItem.authorizationId = authItem.authData.authorizationId;
      authItem.authorizationTypeCode = authItem.authData.authorizationTypeCode;

      // I think the following appointment kluge only applies to flight/lodging
      authItem.appointments = authItem.authData.appointments;

      if (!authItem.authorizationId || authItem.appointments === null) {
        authItem.appointments = [
          {
            appointmentDate: authItem.authData.appointmentDate,
            appointmentTime: authItem.authData.appointmentTime,
            appointmentType: authItem.authData.appointmentType
          }
        ];
      }
    });

    return this.http.post(url, requestBody) as Observable<ReferralSubmitError>;
  }

  // Someone stored some font awesome icon data in the form somewhere so it makes it difficult to debug when looking at the data
  // This method should just recursively look at an object and delete any fields named icon
  nukeByObjectKey(object, keyToDelete: string) {
    let itemsToDelete = [];
    Object.keys(object).forEach((key) => {
      if (
        key !== keyToDelete &&
        typeof object[key] === 'object' &&
        object[key] !== null
      ) {
        this.nukeByObjectKey(object[key], keyToDelete);
      } else {
        // delete object[key];
        if (key === keyToDelete) {
          itemsToDelete.push(object);
        }
      }
    });

    itemsToDelete.forEach((objectToDelete) => delete objectToDelete['icon']);
  }

  getReferralAuthorizationOptions(
    encodedCustomerId: string
  ): Observable<ReferralAuthorizationOptions> {
    return this.http.get<ReferralAuthorizationOptions>(
      `${getApiUrl('referralAuthorizationOptions')}/${encodedCustomerId}`
    );
  }

  dispatchGetReferralAuthorization(
    archeType: ReferralAuthorizationArchetype,
    encodedReferralId: string,
    encodedCustomerId: string,
    encodedClaimNumber: string,
    isManualAuthorizations: boolean = true
  ) {
    // Load different data depending on archetype
    switch (archeType) {
      case ReferralAuthorizationArchetype.Transportation:
        this.store$.dispatch(
          loadReferralAuthorizationSet({
            encodedCustomerId,
            encodedReferralId,
            encodedClaimNumber,
            isManualAuthorizations
          })
        );
        break;
      case ReferralAuthorizationArchetype.Language:
        this.store$.dispatch(
          loadFusionLanguageAuthorizations({
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        break;
      case ReferralAuthorizationArchetype.Diagnostics:
        this.store$.dispatch(
          loadFusionDiagnosticsAuthorizations({
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        break;
      case ReferralAuthorizationArchetype.PhysicalMedicine:
        this.store$.dispatch(
          loadFusionPhysicalMedicineAuthorizations({
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        break;
      case ReferralAuthorizationArchetype.HomeHealth:
        this.store$.dispatch(
          loadFusionHomeHealthAuthorizations({
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        break;
      case ReferralAuthorizationArchetype.Dme:
        this.store$.dispatch(
          loadFusionDmeAuthorizations({
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        break;
    }
  }

  public getUniqueId(): number {
    this.uniqueId += 1;
    return this.uniqueId;
  }

  getReferralApiUrl(endpoint: string, query: URLSearchParams) {
    if (environment.remote) {
      return `${apiUrls[endpoint]}?${query}`;
    } else {
      return `/api/${endpoint}/${query.get('encodedReferralId')}`;
    }
  }
}
