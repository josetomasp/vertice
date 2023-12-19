import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';

import { map } from 'rxjs/operators';

export interface ClaimantInviteRequest {
  email: string;
  phoneNumber: string;
  phiMemberId: string;
  customerCode: string;
}

export interface MobileInvitationHistory {
  eventDateTime: string;
  sentTo: string;
  sentBy: string;
  description: string;
}

export interface MobileInviteHelpPDF {
  file: string;
  filename: string;
}

@Injectable({
  providedIn: 'root'
})
export class MobileInviteService {
  constructor(public http: HttpClient) {}

  public submitMobileInviteRequest(
    request: ClaimantInviteRequest
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('mobileInvites'),
      request
    );
  }

  public customerMobileProgramEnabled(
    customerCode: string
  ): Observable<VerticeResponse<{ isMobilePatientProgramEnabled: boolean, jarvisSSOLink?: string }>> {
    return this.http.get<
      VerticeResponse<{ isMobilePatientProgramEnabled: boolean }>
    >(
      getApiUrl(
        'customerMobileProgramEnabled',
        generateQueryParams({ customerCode })
      )
    );
  }

  public getMobileInvitationHistory(
    phiMemberId: String
  ): Observable<VerticeResponse<MobileInvitationHistory[]>> {
    return this.http.get<VerticeResponse<MobileInvitationHistory[]>>(
      getApiUrl('mobileInvitationHistory', generateQueryParams({ phiMemberId }))
    );
  }

  public downloadHelpPDF(): Observable<MobileInviteHelpPDF> {
    return this.http.get<MobileInviteHelpPDF>(
      getApiUrl('getMobileInviteHelpPdf')
    );
  }
}
