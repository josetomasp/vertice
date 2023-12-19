import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { getApiUrl } from '@shared/lib/http';
import { AuthorizationStatusQueueData } from './authorization-status-queue-root/authorization-status-queue-root.component';
import { VerticeResponse } from '@shared/models/VerticeResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationStatusQueueService {
  constructor(private http: HttpClient) {}

  getAuthorizationStatusQueueData(): Observable<
    VerticeResponse<AuthorizationStatusQueueData>
  > {
    return this.http.get<VerticeResponse<AuthorizationStatusQueueData>>(
      getApiUrl('cscAuthorizationQueueData')
    );
  }
}
