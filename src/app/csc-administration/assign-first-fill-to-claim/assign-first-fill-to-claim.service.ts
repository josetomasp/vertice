import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';
import { HttpClient } from '@angular/common/http';
import {
  FirstFillClaimSearchFormValues,
  FirstFillClaimSearchResult,
  FirstFillLineItemsToAssignResponseBody
} from './store/assign-first-fill-to-claim.reducer';

@Injectable({
  providedIn: 'root'
})
export class AssignFirstFillToClaimService {
  constructor(public http: HttpClient) {}

  getLineItemDetails(
    temporaryMemberId: string
  ): Observable<VerticeResponse<FirstFillLineItemsToAssignResponseBody>> {
    return this.http.get<
      VerticeResponse<FirstFillLineItemsToAssignResponseBody>
    >(
      getApiUrl(
        'firstFillLineItemDetails',
        generateQueryParams({ temporaryMemberId })
      )
    );
  }

  saveFirstFillWebUserNotes(
    temporaryMemberId: string,
    customerId: string,
    notes: string
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl(
        'firstFillSaveWebUserNotes',
        generateQueryParams({ temporaryMemberId, customerId })
      ),
      notes
    );
  }

  moveFirstFillToNextQueue(
    temporaryMemberId: string,
    customerId: string
  ): Observable<VerticeResponse<void>> {
    return this.http.get<VerticeResponse<void>>(
      getApiUrl(
        'firstFillMoveToNextQueue',
        generateQueryParams({ temporaryMemberId, customerId })
      )
    );
  }

  saveFirstFillWebUserNotesAndMoveToNextQueue(
    temporaryMemberId: string,
    customerId: string,
    notes: string
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl(
        'firstFillSaveWebUserNotesAndMoveToNextQueue',
        generateQueryParams({ temporaryMemberId, customerId })
      ),
      notes
    );
  }

  assignFirstFillToNewClaim(
    tempID: string,
    oldcustomerID: string,
    newcustomerID: string,
    claimNumber: string
  ): Observable<VerticeResponse<void>> {
    return this.http.post<VerticeResponse<void>>(
      getApiUrl('firstFillAssignToNewClaim'),
      {
        tempID,
        newcustomerID,
        oldcustomerID,
        claimNumber
      }
    );
  }

  getClaimSearchResults(
    claimSearchFormValues: FirstFillClaimSearchFormValues
  ): Observable<VerticeResponse<FirstFillClaimSearchResult[]>> {
    return this.http.get<VerticeResponse<FirstFillClaimSearchResult[]>>(
      getApiUrl(
        'firstFillClaimSearch',
        generateQueryParams(claimSearchFormValues)
      )
    );
  }
}
