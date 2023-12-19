import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  CreateLOMNSubmitMessage,
  LomnEligibility,
  LOMNSubmitMessage
} from './store/models/create-lomn.models';
import { getApiUrl } from './getApiUrl';
import { generateQueryParams } from './generateQueryParams';
import { hexEncode } from '../hexEncode';

@Injectable({ providedIn: 'root' })
export class CreateLomnService {
  constructor(public http: HttpClient) {}

  createLOMN(submitMessage: CreateLOMNSubmitMessage[]): Observable<any> {
    return this.http.post<any>(getApiUrl('createLOMN'), submitMessage);
  }

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
