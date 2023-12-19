import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  ConfirmationModalData,
  generateQueryParams,
  getApiUrl,
  VerticeResponse
} from '@shared';
import {
  AddLineItemPosAuthRequestBody,
  CreatePosAuthPrimaryRejectCode,
  CreatePosAuthRequestBody,
  PbmPrescriptionHistory
} from './create-new-pos-auth.models';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';

import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { CreatePosAuthorizationComponent } from '../../create-pos-authorization.component';
import { catchError, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateNewPosAuthService
  implements CanDeactivate<CreatePosAuthorizationComponent> {
  confirmModalData: ConfirmationModalData = {
    titleString: 'Cancel Authorization',
    bodyHtml:
      'Do you want to cancel the creation of this authorization? You will lose the data by cancelling and this is not reversible. Please press "Continue" to confirm cancellation.',
    affirmString: 'CONTINUE',
    denyString: 'CANCEL'
  };

  constructor(
    private http: HttpClient,
    public confirmationModalService: ConfirmationModalService
  ) {}

  getPosAuthRxHistoryRowData(
    memberId: string
  ): Observable<VerticeResponse<PbmPrescriptionHistory[]>> {
    return this.http
      .get<VerticeResponse<PbmPrescriptionHistory[]>>(
        getApiUrl(
          'cscCreatePosAuthRxHistory',
          generateQueryParams({ memberId })
        )
      )
      .pipe(
        first(),
        catchError((error) => {
          let returnValue: VerticeResponse<PbmPrescriptionHistory[]> = {
            responseBody: [],
            errors: [
              'Unexpected error while getting prescription history by member ID'
            ],
            httpStatusCode: 500
          };
          console.error(error);
          return of(returnValue);
        })
      );
  }

  createPosAuthorization(
    requestBody: CreatePosAuthRequestBody
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('cscCreatePosAuthorization'),
      requestBody
    );
  }

  addExistingLine(
    requestBody: AddLineItemPosAuthRequestBody
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('cscAddLineItemsToRxAuthorization'),
      requestBody
    );
  }

  getRejectCodeOptions(): Observable<
    VerticeResponse<CreatePosAuthPrimaryRejectCode[]>
  > {
    return this.http.get<VerticeResponse<CreatePosAuthPrimaryRejectCode[]>>(
      getApiUrl('getRejectCodeOptions')
    );
  }

  canDeactivate(
    component: CreatePosAuthorizationComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.disableDeactivateGuard) {
      return true;
    }

    return this.confirmationModalService
      .displayModal(this.confirmModalData)
      .afterClosed();
  }
}
