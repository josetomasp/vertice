import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  generateQueryParams,
  getApiUrl,
  HealtheSelectOption,
  VerticeResponse
} from '@shared';
import { Observable } from 'rxjs';
import { NavReferral } from './store/models/nav-referral.model';
import {
  ALL_AUTHORIZATION_SEARCH_NAME,
  CLAIM_RESOLUTION_AUTHORIZATION_SEARCH_NAME,
  CLINICAL_AUTHORIZATION_SEARCH_NAME,
  DRAFT_REFERRALS_SEARCH_NAME,
  EPAQ_AUTHORIZATION_SEARCH_NAME,
  MAIL_ORDER_AUTHORIZATION_SEARCH_NAME,
  PAPER_AUTHORIZATION_SEARCH_NAME,
  POS_AUTHORIZATION_SEARCH_NAME,
  REFERRAL_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from './store/models/search-options.model';
import { PendingAuthorizationsGraphDataByAdjuster } from '../dashboard/store/models/dashboard.models';


@Injectable({ providedIn: 'root' })
export class SearchNavService {
  constructor(private http: HttpClient) {}

  getDraftReferrals(form: any): Observable<NavReferral[]> {
    return this.http.get<NavReferral[]>(
      `${getApiUrl(
        'searchNavReferrals',
        generateQueryParams({
          referralId: form.referralId,
          claimNumber: form.claimNumber,
          claimantLastName: form.claimantLastName,
          claimantFirstName: form.claimantFirstName,
          doiStartDate: form.doiStartDate,
          doiEndDate: form.doiEndDate,
          assignedTo: form.assignedTo,
          status: form.status,
          serviceType: form.serviceType,
          includeRfsResults: true
        })
      )}`
    );
  }

  getPendingReferrals(form: any): Observable<NavReferral[]> {
    return this.http.get<NavReferral[]>(
      `${getApiUrl(
        'searchNavReferrals',
        generateQueryParams({
          referralId: form.referralId,
          claimNumber: form.claimNumber,
          claimantLastName: form.claimantLastName,
          claimantFirstName: form.claimantFirstName,
          doiStartDate: form.doiStartDate,
          doiEndDate: form.doiEndDate,
          assignedTo: form.assignedTo,
          customerId: form.customerId,
          status: form.status,
          serviceType: form.serviceType,
          includeRfsResults: false
        })
      )}`
    );
  }

  getReferralActivities(form: any): Observable<NavReferral[]> {
    return this.http.get<NavReferral[]>(
      `${getApiUrl(
        'searchNavReferrals',
        generateQueryParams({
          referralId: form.referralId,
          claimNumber: form.claimNumber,
          claimantLastName: form.claimantLastName,
          claimantFirstName: form.claimantFirstName,
          doiStartDate: form.doiStartDate,
          doiEndDate: form.doiEndDate,
          assignedTo: form.assignedTo,
          customerId: form.customerId,
          status: form.status,
          serviceType: form.serviceType,
          displayLimit: form.displayLimit,
          includeRfsResults: true
        })
      )}`
    );
  }

  getSearchOptions(): Observable<SearchOptions> {
    return this.http.get<SearchOptions>(`${getApiUrl('searchNavOptions')}`);
  }

  getActiveAdjustersByCustomer(
    encodedCustomerId: string
  ): Observable<HealtheSelectOption<string>[]> {
    return this.http.get<HealtheSelectOption<string>[]>(
      getApiUrl('activeAdjusters', generateQueryParams({ encodedCustomerId }))
    );
  }

  getSearchResults(
    searchFormName: string,
    parameters: {
      [parameter: string]: string;
    }
  ): Observable<VerticeResponse<any>> {
    switch (searchFormName) {
      case ALL_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchAllAuthorizations')}`,
          parameters
        );
      case EPAQ_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchEpaqAuthorizations')}`,
          parameters
        );
      case PAPER_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchPaperAuthorizations')}`,
          parameters
        );
      case CLINICAL_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchClinicalAuthorizations')}`,
          parameters
        );
      case REFERRAL_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchReferralAuthorizations')}`,
          parameters
        );
      case MAIL_ORDER_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchMailOrderAuthorizations')}`,
          parameters
        );
      case CLAIM_RESOLUTION_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchClaimResolutionAuthorizations')}`,
          parameters
        );

      case DRAFT_REFERRALS_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchDraftReferrals')}`,
          parameters
        );

      case POS_AUTHORIZATION_SEARCH_NAME:
        return this.http.post<VerticeResponse<any>>(
          `${getApiUrl('searchPosAuthorizations')}`,
          parameters
        );

      default:
        console.error(
          searchFormName +
            ` not supported for getSearchResults(${searchFormName}, ${parameters})`
        );
        break;
    }
  }

  getPendingAuthorizationsDashboardData(
    assignedAdjuster: string
  ): Observable<PendingAuthorizationsGraphDataByAdjuster[]> {
    return this.http.get<PendingAuthorizationsGraphDataByAdjuster[]>(
      `${getApiUrl(
        'pendingAuthorizationDashboard',
        generateQueryParams({ assignedAdjuster: assignedAdjuster })
      )}`
    );
  }
}
