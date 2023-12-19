import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClaimV3 } from './store/models/claim.models';
import { ClaimQuery } from './store/models/claimQuery';
import { generateQueryParams } from './generateQueryParams';
import { getApiUrl } from './getApiUrl';

@Injectable({ providedIn: 'root' })
export class ClaimV3Service {
  constructor(private http: HttpClient) {}

  getClaimV3(query: ClaimQuery): Observable<ClaimV3> {
    const params = generateQueryParams(query);
    return this.http.get<ClaimV3>(`${getApiUrl('eligibilityV3')}?${params}`);
  }
}
