import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Drug, DrugRequest } from '@shared/models/drug';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerticeResponse } from '@shared';
import { generateQueryParams, getApiUrl } from '@shared/lib/http';

export interface OtherMedicationSearchResult {
  ndc: string;
  prescriptionName: string;
  strength: string;
}

@Injectable({
  providedIn: 'root'
})
export class DrugLookupService {
  constructor(public http: HttpClient) {}

  getDrugInfoByNDC(request: DrugRequest) {
    let url = '';

    if (
      null != request.ndc &&
      request.ndc.trim() !== '' &&
      null != request.fromDate &&
      request.fromDate.trim() !== ''
    ) {
      if (environment.remote) {
        url = getApiUrl('drugsLookup');
        url += '?drugNDC=' + request.ndc;
        url += '&fromDate=' + request.fromDate;
        url += '&AWPQuantity=' + request.AWPQuantity;
      }
    }

    return this.http.get<Drug>(url);
  }

  getOtherMedications(
    drugNdc: string,
    drugName: string
  ): Observable<VerticeResponse<OtherMedicationSearchResult[]>> {
    return this.http.get<VerticeResponse<OtherMedicationSearchResult[]>>(
      getApiUrl(
        'otherMedicationSearch',
        generateQueryParams({ drugNdc, drugName })
      )
    );
  }
}
