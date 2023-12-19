import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '@shared/lib/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IncidentsQuery,
  IncidentsResponse
} from '../store/models/incidents-tab.model';
import { VerticeResponse } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  constructor(private http: HttpClient) {}

  getIncidents(
    request: IncidentsQuery
  ): Observable<VerticeResponse<IncidentsResponse>> {
    let requestUrl: string = getApiUrl('incidents');
    if (environment.remote) {
      requestUrl += '?claimNumber=' + request.claimNumber;
      requestUrl += '&customerId=' + request.customerId;
    }

    return this.http.get<VerticeResponse<IncidentsResponse>>(requestUrl);
  }
}
