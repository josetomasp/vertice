import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { RealTimeRejectsQueueResultRow } from './real-time-rejects-queue-root/real-time-rejects-queue-root.component';
import { VerticeResponse } from '@shared';
import { getApiUrl } from '@shared/lib/http';

@Injectable({
  providedIn: 'root'
})
export class RealTimeRejectsQueueService {
  constructor(private http: HttpClient) {}

  getRealTimeRejectsQueueData(): Observable<
    VerticeResponse<RealTimeRejectsQueueResultRow[]>
  > {
    return this.http.get<VerticeResponse<RealTimeRejectsQueueResultRow[]>>(
      getApiUrl('cscRealTimeRejectsQueueData')
    );
  }
}
