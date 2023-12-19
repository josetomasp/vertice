import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl } from '@shared';
import { Observable } from 'rxjs';
import { ClaimResult } from '../../../claims/abm/referral/store/models/claimResult.model';

@Injectable({
  providedIn: 'root'
})
export class MakeAReferralSearchService {
  constructor(private http: HttpClient) {}

  getClaimSearchResults(form: any): Observable<ClaimResult[]> {
    return this.http.get<ClaimResult[]>(
      `${getApiUrl(
        'makeAReferralSearchClaims',
        generateQueryParams({
          customerCode: form.customerCode,
          claimNumber: form.claimNumber,
          claimantLastName: form.claimantLastName,
          claimantFirstName: form.claimantFirstName,
          doiStartDate: form.doiStartDate,
          doiEndDate: form.doiEndDate,
          stateOfVenue: form.stateOfVenue,
          ssn: form.ssn,
          officeCode: form.officeCode,
          employer: form.employer
        })
      )}`
    );
  }
}
