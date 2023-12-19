import { HttpClient, HttpResponse } from '@angular/common/http';
import { getApiUrl } from '@shared';
import { Observable } from 'rxjs';
import { ProblemDetails } from '../problem-details.model';
import { Injectable } from '@angular/core';
import {
  AllAuthorizations,
  AuthorizationTypes,
  DashboardAdjusterResponseMessage,
  DashboardDataRequestMessage
} from './fusion-abm-referral-management-models';
import {
  VerticeMediatedResponse
} from '@shared/models/vertice-mediated-response.model';

export type AllAuthorizationSearchAuthorizationTypeOptionsResponse =
  AuthorizationTypes
  | VerticeMediatedResponse
  | ProblemDetails;

export type AllAuthorizationSearchAssignedAdjusterOptionsResponse =
  DashboardAdjusterResponseMessage
  | VerticeMediatedResponse
  | ProblemDetails;

export type AllAuthorizationSearchResponse =
  AllAuthorizations
  | VerticeMediatedResponse
  | ProblemDetails;

@Injectable({
  providedIn: 'root'
})
export class FusionAbmReferralManagementService {
  constructor(public http: HttpClient) {
  }

  getAuthorizationTypes(): Observable<HttpResponse<AllAuthorizationSearchAuthorizationTypeOptionsResponse>> {
    return this.http.get<AllAuthorizationSearchAuthorizationTypeOptionsResponse>(
      `${getApiUrl('getFusionAbmReferralManagementAuthorizationsDashboardAuthorizationTypes')}`,
      { observe: 'response' }
    );
  }

  getAdjusters(): Observable<HttpResponse<AllAuthorizationSearchAssignedAdjusterOptionsResponse>> {
    return this.http.get<AllAuthorizationSearchAssignedAdjusterOptionsResponse>(
      `${getApiUrl('getFusionAbmReferralManagementAllAuthorizationsAdjusters')}`,
      { observe: 'response' }
    );
  }

  getAuthorizationsAwaitingAction(parameters: DashboardDataRequestMessage): Observable<HttpResponse<AllAuthorizationSearchResponse>> {
    return this.http.post<AllAuthorizationSearchResponse>(
      `${getApiUrl('postFusionAbmReferralManagementAllAuthorizationsSearch')}`,
      parameters,
      { observe: 'response' }
    );
  }
}
