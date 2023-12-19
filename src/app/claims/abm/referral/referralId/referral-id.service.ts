import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl } from '@shared';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { IcdCodeSet } from '../../../../claim-view/store/models/icd-codes.models';
import {
  ICDCodeSaveRequest,
  ReferralOverviewCardState,
  ReferralOverviewQuery
} from '../store/models/referral-id.models';
import { apiUrls } from '../../../../apiUrls';
import { ReferralLocationResponse } from './referral-authorization/referral-authorization.models';

@Injectable({ providedIn: 'root' })
export class ReferralIdService {
  constructor(public http: HttpClient) {}

  getReferralOverview(
    referralOverviewQuery: ReferralOverviewQuery
  ): Observable<ReferralOverviewCardState> {
    const query = generateQueryParams(referralOverviewQuery);
    return this.http.get<ReferralOverviewCardState>(
      this.getReferralApiUrl('referralOverview', query)
    );
  }

  getReferralApiUrl(endpoint: string, query: URLSearchParams) {
    if (environment.remote) {
      return `${apiUrls[endpoint]}?${query}`;
    } else {
      return `/api/${endpoint}/${query.get('referralId')}`;
    }
  }

  icdCodeSearch(value: string): Observable<IcdCodeSet> {
    let url: string;
    if (environment.remote) {
      url = getApiUrl('icdCodeSearch') + '?icdCodeStartsWith=' + value;
    } else {
      url = getApiUrl('icdCodeSearch');
    }

    return this.http.get<IcdCodeSet>(url);
  }

  referralSaveICDCodes(request: ICDCodeSaveRequest): Observable<void> {
    if (environment.remote) {
      let url =
        getApiUrl('referralSaveICDCodes') +
        '/' +
        request.referralId +
        '/icdCodes';
      url += '?customerId=' + request.customerId + `&isCore=${request.isCore}`;
      return this.http.patch<void>(url, request.icdCodeList);
    } else {
      return this.getRandomSuccessOrFailObservable();
    }
  }

  referralUploadDocument(
    customerId: string,
    claimNumber: string,
    referralId: string,
    hesReferralDetailId: string,
    dateOfService: string,
    file: File,
    archType: string
  ): Observable<any> {
    if (environment.remote) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      const headers: HttpHeaders = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      return this.http.post<any>(
        `${getApiUrl('referralUploadDocument')}` +
          '?customerId=' +
          customerId +
          '&claimNumber=' +
          claimNumber +
          '&referralId=' +
          referralId +
          (hesReferralDetailId
            ? '&hesReferralDetailId=' + hesReferralDetailId
            : '') +
          '&dateOfService=' +
          dateOfService +
          '&archType=' +
          archType,
        formData,
        { headers: headers }
      );
    } else {
      return this.getRandomSuccessOrFailObservable();
    }
  }

  getReferralLocationsLanguage(
    encodedAuthorizationId: string
  ): Observable<ReferralLocationResponse> {
    let url: string;
    if (environment.remote) {
      url =
        getApiUrl('fusionLanguageReferrals') +
        '?encodedAuthorizationId=' +
        encodedAuthorizationId;
    } else {
      url = getApiUrl('fusionLanguageReferrals');
    }

    return this.http.get<ReferralLocationResponse>(url);
  }

  private getRandomSuccessOrFailObservable(): Observable<any> {
    return of(Math.floor(Math.random() * 2)).pipe(
      delay(2000),
      mergeMap((n) => {
        if (n === 1) {
          return of({});
        } else {
          return throwError(500);
        }
      })
    );
  }
}
