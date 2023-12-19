import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  StatusCode,
  StatusDescription,
  TherapeuticAlertAuthorization
} from './ta-authorization.external-models';
import { delay, map } from 'rxjs/operators';
import { generateQueryParams, getApiUrl } from '@shared';

@Injectable({ providedIn: 'root' })
export class TaAuthorizationService {
  constructor(public http: HttpClient) {}
  getTaAuthorization(
    taAuthorizationId: string
  ): Observable<HttpResponse<TherapeuticAlertAuthorization>> {
    return this.http.get<TherapeuticAlertAuthorization>(
      getApiUrl('taLetter', generateQueryParams({ taAuthorizationId })),
      { observe: 'response' }
    );
  }
  getDenialReasons(): Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(getApiUrl('taLetterDenialReasons'), {
      observe: 'response'
    });
  }
  getExParteMessage(
    taAuthorizationId: string
  ): Observable<HttpResponse<string>> {
    return this.http.get<string>(
      getApiUrl('taLetterExParte', generateQueryParams({ taAuthorizationId })),
      { observe: 'response' }
    );
  }
}
