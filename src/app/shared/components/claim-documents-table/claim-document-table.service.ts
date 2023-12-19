import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsApiResults } from '../../store/models/claim-documents-table.models';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared/lib';

@Injectable({
  providedIn: 'root'
})
export class ClaimDocumentTableService {
  constructor(private http: HttpClient) {}

  getDocuments(
    claimNumber: string,
    customerId: string
  ): Observable<VerticeResponse<DocumentsApiResults>> {
    let requestUrl: string = getApiUrl(
      'documents',
      generateQueryParams({ claimNumber, customerId })
    );

    return this.http.get<VerticeResponse<DocumentsApiResults>>(requestUrl);
  }
}
