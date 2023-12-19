import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConfirmationModalData,
  generateQueryParams,
  getApiUrl,
  VerticeResponse
} from '@shared';
import {
  AuthorizationQuery
} from './store/models/pbm-authorization.models';
import {
  AuthorizationDetails,
  PbmAuthSubmitMessage,
  PbmAuthSubmitResponse,
  PbmPaperAuthorizationSubmitMessage,
  PbmPosAuthorizationSaveRequest,
  RxAuthorizationInformationQuery,
  PbmPaperAuthorizationPrepareMessage,
  PbmPreparePaperAuthorizationResponse,
  PbmPaperAuthorizationSaveMessage
} from './store/models/pbm-authorization-information.model';
import { Observable, of } from 'rxjs';
import {
  PbmAuthSearchClaimRequest,
  PbmAuthSearchClaimResponse,
  PbmAuthSubmitClaimRequest
} from './store/models/pbm-authorization-reassignment.model';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import { RtrPromotionComponent } from './rtr-promotion/rtr-promotion.component';
import { filter, first, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  loadPaperAuthInfo,
  loadRxAuthInfo
} from './store/actions/pbm-authorization-information.actions';
import { select, Store } from '@ngrx/store';
import {
  getEncodedAuthorizationId,
  getPbmServiceType
} from '../../../store/selectors/router.selectors';
import { RootState } from '../../../store/models/root.models';
import { clearPrescriptionHistory } from '@shared/store/actions/prescriptionHistory.actions';
import { clearClinicalHistory } from '@shared/store/actions/clinicalHistory.actions';
import { PbmAuthorizationNote } from './store/models/pbm-authorization-information/pbm-authorization-note.models';
import {
  PbmAuthorizationServiceType
} from './store/models/pbm-authorization-service-type.models';

@Injectable()
export class PbmAuthorizationService
  implements CanDeactivate<RtrPromotionComponent>
{
  confirmModalData: ConfirmationModalData = {
    titleString: 'Leaving Authorization',
    bodyHtml:
      'Are you sure you want to leave this authorization? You will lose any unsaved changes by navigating away from this screen. Please press “Continue” to confirm”.',
    affirmString: 'CONTINUE',
    denyString: 'CANCEL'
  };

  authorizationId$ = this.store$.pipe(select(getEncodedAuthorizationId));
  serviceType$ = this.store$.pipe(select(getPbmServiceType));

  constructor(
    public http: HttpClient,
    public confirmationModalService: ConfirmationModalService,
    public store$: Store<RootState>
  ) {}

  getAuthorization(query: AuthorizationQuery) {
    return this.http.get(
      getApiUrl('authorization', generateQueryParams(query))
    );
  }

  getRxAuthorizationInformation(
    query: RxAuthorizationInformationQuery
  ): Observable<VerticeResponse<AuthorizationDetails>> {
    if (query.isRTR) {
      return this.http.get<VerticeResponse<AuthorizationDetails>>(
        getApiUrl(
          'rtrRxAuthorizationInformation',
          generateQueryParams({ authorizationId: query.authorizationId })
        )
      );
    } else {
      return this.http.get<VerticeResponse<AuthorizationDetails>>(
        getApiUrl(
          'rxAuthorizationInformation',
          generateQueryParams({ authorizationId: query.authorizationId })
        )
      );
    }
  }

  getPaperAuthorizationInformation(
    query: RxAuthorizationInformationQuery
  ): Observable<AuthorizationDetails> {
    return this.http.get<AuthorizationDetails>(
      getApiUrl('paperAuthorizationInformation', generateQueryParams(query))
    );
  }

  savePaperAuthorizationInformation(
    requestBody: PbmPaperAuthorizationSaveMessage,
    query: { authorizationId: string }
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl(
        'paperSaveAuthorizationInformation',
        generateQueryParams(query)
      ),
      requestBody
    );
  }

  submitPaperAuthorizationInformation(
    requestBody: PbmPaperAuthorizationSubmitMessage,
    query: { authorizationId: string }
  ): Observable<VerticeResponse<AuthorizationDetails>> {
    return this.http.post<VerticeResponse<AuthorizationDetails>>(
      getApiUrl(
        'paperSubmitAuthorizationInformation',
        generateQueryParams(query)
      ),
      requestBody
    );
  }

  pbmAuthorizationSave(
    request: PbmPosAuthorizationSaveRequest,
    query: { authorizationId: string }
  ) {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('pbmAuthorizationSave', generateQueryParams(query)),
      request
    );
  }

  saveRxAuthorizationLineItemNote(
    note: PbmAuthorizationNote,
    query: { authorizationId: number }
  ) {
    return this.http.post(
      getApiUrl('rxAuthorizationSaveLineItemNote', generateQueryParams(query)),
      note
    );
  }

  unlockAuthorization(authorizationId: string): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('rxAuthorizationInformationUnlock'),
      authorizationId
    );
  }

  unlockPaperAuthorization(authorizationId: string): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('paperAuthorizationUnlock'),
      authorizationId
    );
  }

  submitRxAuthorization(
    submitMessage: PbmAuthSubmitMessage
  ): Observable<PbmAuthSubmitResponse> {
    return this.http.post<PbmAuthSubmitResponse>(
      getApiUrl('rxAuthorizationSubmit'),
      submitMessage
    );
  }

  submitRxPriorAuthLoad(
    submitMessage: PbmAuthSubmitMessage
  ): Observable<PbmAuthSubmitResponse> {
    return this.http.post<PbmAuthSubmitResponse>(
      getApiUrl('rxSubmitPriorAuthLoad'),
      submitMessage
    );
  }

  loadSamaritanDose(
    submitMessage: PbmAuthSubmitMessage
  ): Observable<PbmAuthSubmitResponse> {
    return this.http.post<PbmAuthSubmitResponse>(
      getApiUrl('rxLoadSamaritanDose'),
      submitMessage
    );
  }
  submitByPassPriorAuthLoad(
    submitMessage: PbmAuthSubmitMessage
  ): Observable<PbmAuthSubmitResponse> {
    return this.http.post<PbmAuthSubmitResponse>(
      getApiUrl('rxLoadByPassPriorAuth'),
      submitMessage
    );
  }

  searchClaimForRxAuthorizationReassignment(
    searchRequest: PbmAuthSearchClaimRequest
  ): Observable<VerticeResponse<PbmAuthSearchClaimResponse[]>> {
    return this.http.post<VerticeResponse<PbmAuthSearchClaimResponse[]>>(
      getApiUrl('rxAuthorizationSearchClaimForReassignment'),
      searchRequest
    );
  }

  submitClaimRxAuthorizationReassignment(
    request: PbmAuthSubmitClaimRequest
  ): Observable<VerticeResponse<AuthorizationDetails>> {
    return this.http.post<VerticeResponse<AuthorizationDetails>>(
      getApiUrl('rxAuthorizationClaimReassignment'),
      request
    );
  }

  submitClaimPaperAuthorizationReassignment(
    request: PbmAuthSubmitClaimRequest
  ): Observable<VerticeResponse<string>> {
    return this.http.post<VerticeResponse<string>>(
      getApiUrl('paperAuthorizationClaimReassignment'),
      request
    );
  }

  canDeactivate(
    component: RtrPromotionComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    if (component.canDeactivate) {
      return of(true);
    } else {
      return this.confirmationModalService
        .displayModal(this.confirmModalData)
        .afterClosed()
        .pipe(
          filter((confirm) => confirm),
          mergeMap(() => this.unlockAuthorization(component.decodedAuthId))
        );
    }
  }

  saveInternalNote(note: string, encodedAuthId: string) {
    return this.http.post<VerticeResponse<PbmAuthorizationNote[]>>(
      getApiUrl('rxAuthorizationSaveInternalNote') +
        '?authorizationId=' +
        encodedAuthId,
      note
    );
  }

  savePaperAuthNote(note: string, authorizationId: string) {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('savePaperAuthNote'),
      { note, authorizationId }
    );
  }

  dispatchLoadAuthData() {
    this.authorizationId$
      .pipe(
        first(),
        withLatestFrom(this.serviceType$),
        map(
          ([authorizationId, serviceType]: [
            string,
            PbmAuthorizationServiceType
          ]) => {
            switch (serviceType) {
              case PbmAuthorizationServiceType.POS:
                return loadRxAuthInfo({ authorizationId });
              case PbmAuthorizationServiceType.RTR:
                return loadRxAuthInfo({ authorizationId, isRTR: true });
              case PbmAuthorizationServiceType.PAPER:
                return loadPaperAuthInfo({ authorizationId });
            }
          }
        )
      )
      .subscribe((action) => {
        this.store$.dispatch(action);
        // Always clear the shared tables when loading a new auth.
        this.store$.dispatch(clearPrescriptionHistory());
        this.store$.dispatch(clearClinicalHistory());
      });
  }
  preparePaperAuthorization(
    requestBody: PbmPaperAuthorizationPrepareMessage,
    query: { authorizationId: string }
  ): Observable<VerticeResponse<PbmPreparePaperAuthorizationResponse>> {
    return this.http.post<VerticeResponse<PbmPreparePaperAuthorizationResponse>>(
      getApiUrl(
        'preparePaperAuthorization',
        generateQueryParams(query)
      ),
      requestBody
    );
  }
}
