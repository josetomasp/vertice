import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl } from '@shared/lib';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { Observable } from 'rxjs';
import { ClaimQuery } from '../../store/models/claimQuery';

@Injectable({ providedIn: 'root' })
export class ClaimV3Service {
  constructor(private http: HttpClient) {}

  getClaimV3(query: ClaimQuery): Observable<ClaimV3> {
    const params = generateQueryParams(query);
    return this.http.get<ClaimV3>(`${getApiUrl('eligibilityV3')}?${params}`);
  }
}
