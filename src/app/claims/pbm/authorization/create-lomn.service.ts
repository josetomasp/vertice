import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl, hexEncode } from '@shared';
import { Observable } from 'rxjs/internal/Observable';
import {
  LomnEligibility,
  LOMNSubmitMessage
} from './store/models/create-lomn.models';

@Injectable({ providedIn: 'root' })
export class CreateLomnService {
  constructor(public http: HttpClient) {}

  public getExparteCopiesRequired(
    customerId: string,
    claimNumber: string
  ): Observable<LomnEligibility> {
    return this.http.get<LomnEligibility>(
      getApiUrl(
        'exparteCopiesRequired',
        generateQueryParams({ customerId, claimNumber })
      )
    );
  }

  public getLetterTypes(ndcs: string[]): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(
      getApiUrl('letterTypes', generateQueryParams({ ndcs: ndcs.join(',') }))
    );
  }

  public previewLomn(submitMessage: LOMNSubmitMessage) {
    window.open(
      getApiUrl(
        'previewLomn',
        `requestLetter=${hexEncode(JSON.stringify(submitMessage))}`
      ),
      '_blank'
    );
  }
}
