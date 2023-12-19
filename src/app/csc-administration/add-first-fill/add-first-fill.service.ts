import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ConfirmationModalData, getApiUrl, VerticeResponse } from '@shared';
import {
  AddFirstFillComponent,
  AddFirstFillReferenceData
} from './add-first-fill.component';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

export interface AddFirstFillTempMemberIdRequest {
  customerId: string;
  dateOfBirth: string;
  dateOfInjury: string;
  ssn: string;
  unableToEnter15DigitId: boolean;
}

export interface SaveFirstFillRequest {
  customerId: string;
  memberId: string;
  tempMemberId: string;
  claimantGender: string;
  claimantLastname: string;
  claimantFirstname: string;
  claimantStreetAddr1: string;
  claimantStreetAddr2: string;
  claimantCity: string;
  claimantState: string;
  claimantZip: string;
  claimantDateOfBirth: string;
  claimantPhone: string;
  claimantSSN: string;
  employerName: string;
  employerStreetAddr1: string;
  employerStreetAddr2: string;
  employerCity: string;
  employer_state: string;
  employerZip: string;
  employerPhone: string;
  callerName: string;
  callerPhone: string;
  callerRelationship: string;
  callerAllowDateOfInjuryOverride: boolean;
  lob: string;
  employerState: string;
  dateOfInjury: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddFirstFillService
  implements CanDeactivate<AddFirstFillComponent> {
  confirmModalData: ConfirmationModalData = {
    titleString: 'Cancel First Fill',
    bodyHtml:
      'Do you want to cancel the entire First FIll?  You will lose the entire First Fill data by cancelling and this is not reversible.  Please press "Continue" to confirm cancellation.',
    affirmString: 'CONTINUE',
    denyString: 'CANCEL'
  };

  constructor(
    private http: HttpClient,
    public confirmationModalService: ConfirmationModalService
  ) {}

  getFirstFillReferenceData(): Observable<AddFirstFillReferenceData> {
    return this.http.get<AddFirstFillReferenceData>(
      getApiUrl('addFirstFillReferenceData')
    );
  }

  getFirstFillTempMemberId(
    request: AddFirstFillTempMemberIdRequest
  ): Observable<VerticeResponse<string>> {
    return this.http.post<VerticeResponse<string>>(
      getApiUrl('firstFillsTempMemberId'),
      request
    );
  }
  saveFirstFill(
    request: SaveFirstFillRequest
  ): Observable<VerticeResponse<string>> {
    return this.http.post<VerticeResponse<string>>(
      getApiUrl('saveFirstFill'),
      request
    );
  }

  canDeactivate(
    component: AddFirstFillComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    return this.confirmationModalService
      .displayModal(this.confirmModalData)
      .afterClosed();
  }
}
