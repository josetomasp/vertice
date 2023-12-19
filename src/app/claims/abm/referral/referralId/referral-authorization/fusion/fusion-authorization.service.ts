import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import {
  DocumentPickerModalComponent,
  DocumentPickerModalMode
} from '../../../components/document-picker-modal/document-picker-modal.component';
import {
  AuthorizationHistoryResponse,
  DiagnosticsHistoryItem,
  DmeHistoryItem,
  HomeHealthHistoryItem,
  LanguageHistoryItem,
  LegacyTransportationHistoryItem,
  PhysicalMedicineHistoryItem
} from '../../../store/models/authorization-history.models';
import {
  AuthorizationFusionSubmitMessage,
  AuthorizationReasonCombined,
  AuthorizationReasons,
  AuthorizationReasonsResponse,
  DocumentFusionTableItem,
  DocumentsFusionFormState,
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  FusionAuthorizationCancelSubmit,
  FusionAuthorizationResponse,
  FusionAuthorizationSubmitResponse,
  FusionPMExtensionSubmitMessage,
  FusionReferralAuthorizationLockedResponse
} from '../../../store/models/fusion/fusion-authorizations.models';
import { ReferralBodyPart } from '../../../store/models/make-a-referral.models';
import {
  ViewDocumentsModalComponent
} from '../components/view-documents-modal/view-documents-modal.component';
import {
  ReferralAuthorizationArchetype
} from '../referral-authorization.models';
import {
  BodyPartsModalComponent
} from './components/auth-body-parts/body-parts-modal/body-parts-modal.component';
import {
  PmAuthorizationExtensionModalComponent
} from './components/pm-authorization-extension-modal/pm-authorization-extension-modal.component';
import {
  AuthorizationCancelModalComponent
} from './components/authorization-cancel-modal/authorization-cancel-modal.component';
import { apiUrls } from '../../../../../../apiUrls';

@Injectable()
export class FusionAuthorizationService {
  constructor(public http: HttpClient, public dialog: MatDialog) {
  }

  private authReasonSubject = new Subject<AuthorizationReasonCombined>();

  private authReasonsIsDetailSelectedSubject = new Subject<string>();

  submitFusionAuthorizations(
    submitMessage: AuthorizationFusionSubmitMessage
  ): Observable<FusionAuthorizationSubmitResponse> {
    return this.http.post<FusionAuthorizationSubmitResponse>(
      getApiUrl(
        this.getFusionAuthorizationSubmitURLKey(submitMessage.archeType)
      ),
      submitMessage
    );
  }

  submitFusionPMExtension(
    submitMessage: FusionPMExtensionSubmitMessage
  ): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('fusionPhysicalMedicineReferralExtensionSubmit'),
      submitMessage
    );
  }

  // Submit Cancelation
  submitAuthorizationCancelation(
    submitMessage: FusionAuthorizationCancelSubmit,
    params: {
      encodedCustomerId: string;
    }
  ): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('fusionAuthorizationCancelSubmit', generateQueryParams(params)),
      submitMessage
    );
  }

  loadFusionLanguageReferralAuthorizations(query: {
    encodedClaimNumber: string;
    encodedCustomerId: string;
    encodedReferralId: string;
  }): Observable<FusionAuthorizationResponse> {
    return this.http.get<FusionAuthorizationResponse>(
      this.getApiReferralIdUrl('fusionLanguageReferralAuthorization', query)
    );
  }

  loadFusionLanguageAuthorizationHistory(query: { encodedReferralId: string }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<LanguageHistoryItem>>>(
      this.getApiReferralIdUrl('fusionLanguageAuthorizationHistory', query)
    );
  }

  loadFusionDiagnosticsAuthorizationHistory(query: {
    encodedReferralId: string;
  }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<DiagnosticsHistoryItem>>>(
      this.getApiReferralIdUrl('fusionDiagnosticsAuthorizationHistory', query)
    );
  }

  loadFusionPhysicalMedicineAuthorizationHistory(query: {
    encodedCustomerCode: string;
    encodedReferralId: string;
  }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<PhysicalMedicineHistoryItem>>>(
      this.getApiReferralIdUrl(
        'fusionPhysicalMedicineAuthorizationHistory',
        query
      )
    );
  }

  // Home Health Get Authorization History
  loadFusionHomeHealthAuthorizationHistory(query: {
    encodedCustomerCode: any;
    encodedReferralId: any;
  }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<HomeHealthHistoryItem>>>(
      this.getApiReferralIdUrl('fusionHomeHealthAuthorizationHistory', query)
    );
  }

  // DME Get Authorization History
  loadFusionDmeAuthorizationHistory(query: {
    encodedCustomerCode: any;
    encodedReferralId: any;
  }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<DmeHistoryItem>>>(
      this.getApiReferralIdUrl('fusionDmeAuthorizationHistory', query)
    );
  }

  // Legacy Transportation Get Authorization History
  loadFusionLegacyTransportationAuthorizationHistory(query: {
    encodedCustomerCode: any;
    encodedReferralId: any;
  }) {
    return this.http.get<VerticeResponse<AuthorizationHistoryResponse<LegacyTransportationHistoryItem>>>(
      this.getApiReferralIdUrl(
        'fusionLegacyTransportationAuthorizationHistory',
        query
      )
    );
  }

  // Auth Reasons
  loadFusionAuthorizationReasons(query: {
    encodedCustomerId: string;
  }): Observable<AuthorizationReasonsResponse> {
    return this.http.get<AuthorizationReasonsResponse>(
      getApiUrl(
        'fusionAuthenticationReasonsForCustomer',
        generateQueryParams(query)
      )
    );
  }

  loadFusionDiagnosticsReferralAuthorizations(query: {
    encodedClaimNumber: string;
    encodedCustomerId: string;
    encodedReferralId: string;
  }): Observable<FusionAuthorizationResponse> {
    return this.http.get<FusionAuthorizationResponse>(
      this.getApiReferralIdUrl('fusionDiagnosticsReferralAuthorization', query)
    );
  }

  loadFusionPhysicalMedicineReferralAuthorizations(query: {
    encodedClaimNumber: string;
    encodedCustomerId: string;
    encodedReferralId: string;
  }): Observable<FusionAuthorizationResponse> {
    return this.http.get<FusionAuthorizationResponse>(
      this.getApiReferralIdUrl(
        'fusionPhysicalMedicineReferralAuthorization',
        query
      )
    );
  }

  loadFusionHomeHealthReferralAuthorizations(query: {
    encodedClaimNumber: string;
    encodedCustomerId: string;
    encodedReferralId: string;
  }): Observable<FusionAuthorizationResponse> {
    return this.http.get<FusionAuthorizationResponse>(
      this.getApiReferralIdUrl('fusionHomeHealthReferralAuthorization', query)
    );
  }
  loadFusionDmeReferralAuthorizations(query: {
    encodedClaimNumber: string;
    encodedCustomerId: string;
    encodedReferralId: string;
  }): Observable<FusionAuthorizationResponse> {
    return this.http.get<FusionAuthorizationResponse>(
      this.getApiReferralIdUrl('fusionDmeReferralAuthorization', query)
    );
  }

  loadFusionReferralDocuments(query: {
    customerCode: string;
    referralId: string;
  }): Observable<DocumentsFusionFormState> {
    return this.http.get<DocumentsFusionFormState>(
      getApiUrl('fusionDocumentsFromReferral', generateQueryParams(query))
    );
  }

  downloadFusionReferralDocument(query: {
    customerCode: string;
    attachmentURL: string;
  }): Observable<DocumentFusionTableItem> {
    return this.http.get<DocumentFusionTableItem>(
      getApiUrl(
        'fusionDownloadDocumentsFromReferral',
        generateQueryParams(query)
      )
    );
  }

  getApiReferralIdUrl(endpoint: string, query: { [key: string]: any }): string {
    if (environment.remote) {
      return apiUrls[endpoint] + '?' + generateQueryParams(query);
    } else {
      return '/api/' + endpoint + '/' + query.encodedReferralId;
    }
  }

  displayViewDocumentsModal(): MatDialogRef<ViewDocumentsModalComponent> {
    return this.dialog.open(ViewDocumentsModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      height: '421px',
      data: this
    });
  }

  // Fusion Auth Reasons Communication Service
  sendSelectedAuthHeaderReason(reason: AuthorizationReasonCombined) {
    this.authReasonSubject.next(reason);
  }

  getSelectedAuthHeaderReason(): Observable<AuthorizationReasonCombined> {
    return this.authReasonSubject.asObservable();
  }

  sendSelectedDetailAuthReason(reason: string) {
    this.authReasonsIsDetailSelectedSubject.next(reason);
  }

  getSelectedDetailAuthReason(): Observable<string> {
    return this.authReasonsIsDetailSelectedSubject.asObservable();
  }

  displayAddBodyPartModal(
    bodyParts: FusionAuthorizationBodyPart[],
    selectedBodyParts: ReferralBodyPart[]
  ): MatDialogRef<BodyPartsModalComponent> {
    return this.dialog.open(BodyPartsModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      height: '325px',
      data: {
        bodyParts: bodyParts,
        selectedBodyParts: selectedBodyParts
      }
    });
  }

  openPMExtensionModal(
    referralId: String
  ): MatDialogRef<PmAuthorizationExtensionModalComponent> {
    return this.dialog.open(PmAuthorizationExtensionModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '1200px',
      data: { referralId: referralId }
    });
  }

  // Cancelation Modal
  openAuthorizationCancelationModal(cancelParameters: {
    referralId: String;
    encodedCustomerId: string;
    encodedClaimNumber: string;
    fusionReferralAuthorizations: FusionAuthorization[];
    fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
    archeType: ReferralAuthorizationArchetype;
  }): MatDialogRef<AuthorizationCancelModalComponent> {
    return this.dialog.open(AuthorizationCancelModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '900px',
      data: cancelParameters
    });
  }

  // Documents modal
  public openDocumentsModal(
    formControl: FormControl,
    mode: DocumentPickerModalMode
  ): MatDialogRef<DocumentPickerModalComponent> {
    return this.dialog.open(DocumentPickerModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '750px',
      height: '421px',
      data: { formControl, mode }
    });
  }

  private getFusionAuthorizationSubmitURLKey(archeType: string): string {
    let urlKey = '';
    switch (archeType) {
      case ReferralAuthorizationArchetype.Language:
        urlKey = 'fusionLanguageReferralAuthorizationSubmit';
        break;
      case ReferralAuthorizationArchetype.Diagnostics:
        urlKey = 'fusionDiagnosticsReferralAuthorizationSubmit';
        break;
      case ReferralAuthorizationArchetype.HomeHealth:
        urlKey = 'fusionHomeHealthReferralAuthorizationSubmit';
        break;
      case ReferralAuthorizationArchetype.PhysicalMedicine:
        urlKey = 'fusionPhysicalMedicineReferralAuthorizationSubmit';
        break;
      case ReferralAuthorizationArchetype.Dme:
        urlKey = 'fusionDMEReferralAuthorizationSubmit';
        break;
      default:
        console.error('Arche Type not recognized for authorization submiting');
        break;
    }
    return urlKey;
  }

  public lockFusionAuthorization(
    encodedReferralId: string
  ): Observable<FusionReferralAuthorizationLockedResponse> {
    return this.http.post<FusionReferralAuthorizationLockedResponse>(
      getApiUrl('fusionLockAuthorization'),
      encodedReferralId
    );
  }

  public unlockFusionAuthorization(
    encodedReferralId: string
  ): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('fusionUnlockAuthorization'),
      encodedReferralId
    );
  }
}
