import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '@shared/lib/http';

export interface PowerBIEmbedTokenDTO {
  reportId: string;
  dashboardId: string;
  groupId: string;
  embedToken: string;
  embedTokenId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PowerBIReportService {
  constructor(private http: HttpClient) {}

  getAccessToken(
    groupId: string,
    powerBiType: string,
    reportId: string
  ): Observable<PowerBIEmbedTokenDTO> {
    let url = getApiUrl('powerBiToken')
      .replace('${groupId}', groupId)
      .replace('${powerBiType}', powerBiType)
      .replace('${reportId}', reportId);
    return this.http.get<PowerBIEmbedTokenDTO>(url);
  }

  updateLoadMetrics(embeddedTokenId: string): Observable<void> {
    let url = getApiUrl('powerBiMetricUpdate')
        .replace('${embeddedTokenId}', embeddedTokenId)
        .replace('${action}', 'loaded');
    return this.http.get<void>(url);
  }

  updateRenderedMetrics(embeddedTokenId: string): Observable<void> {
    let url = getApiUrl('powerBiMetricUpdate')
        .replace('${embeddedTokenId}', embeddedTokenId)
        .replace('${action}', 'rendered');
    return this.http.get<void>(url);
  }

}
