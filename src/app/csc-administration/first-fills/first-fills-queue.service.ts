import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirstFillsQueueResultRow } from './first-fills-queue-root/first-fills-queue-root.component';
import { getApiUrl } from '@shared/lib/http';
import { Observable } from 'rxjs/internal/Observable';
import { VerticeResponse } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class FirstFillsQueueService {
  constructor(private http: HttpClient) {}

  getFirstFillsQueueData(): Observable<
    VerticeResponse<FirstFillsQueueResultRow[]>
  > {
    return this.http.get<VerticeResponse<FirstFillsQueueResultRow[]>>(
      getApiUrl('firstFillsQueueData')
    );
  }
}
