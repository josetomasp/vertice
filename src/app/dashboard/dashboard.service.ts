import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskGraphRequest } from '../shared/components/risk-graph/risk-graph.models';
import { generateQueryParams, getApiUrl } from '../shared/lib';
import { RiskVolume } from './store/models/dashboard.models';

@Injectable()
export class DashboardService {
  constructor(public http: HttpClient) {}

  getRiskGraphData(params: RiskGraphRequest): Observable<RiskVolume> {
    return this.http.get<RiskVolume>(
      getApiUrl('riskGraphData', generateQueryParams(params))
    );
  }
}
