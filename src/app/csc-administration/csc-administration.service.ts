import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VerticeResponse } from '@shared';
import { getApiUrl } from '@shared/lib/http';
import { Pharmacy } from '@shared/models/pharmacy';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { PbmExistingAuthorization } from './create-pos-authorization/components/create-new-pos-auth/create-new-pos-auth.models';

@Injectable({
  providedIn: 'root'
})
export class CscAdministrationService {
  posAuthorizationStatusQueueOptions: BehaviorSubject<
    VerticeResponse<string[]>
  > = new BehaviorSubject<VerticeResponse<string[]>>({
    errors: [],
    httpStatusCode: 0,
    responseBody: []
  });
  hasFetchedStatusQueueOptions: boolean = false;

  constructor(private http: HttpClient) {}

  getPharmacyData(nabp: string): Observable<VerticeResponse<Pharmacy>> {
    let url = getApiUrl('pharmacyLookup');
    if (environment.remote) {
      url += '/' + nabp;
    }
    return this.http.get<VerticeResponse<Pharmacy>>(url);
  }
  getAwaitingDecisionAuthSummariesByPhiMemberId(
    memberId: string
  ): Observable<VerticeResponse<PbmExistingAuthorization[]>> {
    let url = getApiUrl('cscGetAwaitingDecisionAuthSummariesByPhiMemberId');
    if (environment.remote) {
      url += '?phiMemberId=' + memberId;
    }
    return this.http.get<VerticeResponse<PbmExistingAuthorization[]>>(url);
  }
}
