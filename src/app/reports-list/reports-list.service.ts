import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportAPIReponse } from './reports-list.component';
import { getApiUrl } from '@shared/lib/http';

@Injectable()
export class ReportsListService {
  constructor(public http: HttpClient) {}

  public getReportsList(): Observable<ReportAPIReponse> {
    return this.http.get<ReportAPIReponse>(getApiUrl('reportsList'));
  }
}
