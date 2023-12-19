import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { generateQueryParams, getApiUrl } from '@shared';
import { environment } from '../../../../environments/environment';
import { Prescriber } from '@shared/models/prescriber';

@Injectable({
  providedIn: 'root'
})
export class ListOfPrescribersModalService {
  constructor(private http: HttpClient) {}

  getPrescribersData(
    NPI: string,
    FirstName: string,
    LastName: string
  ): Observable<Array<Prescriber>> {
    return this.http.get<Array<Prescriber>>(
      `${getApiUrl(
        'cscListOfPrescribersData',
        generateQueryParams({
          firstName: FirstName,
          lastName: LastName,
          fromIndex: 0,
          maxRecords: 200
        })
      )}`
    );
  }

  getPrescriberById(NPI: string): Observable<Prescriber> {
    if (null != NPI && NPI.trim() !== '') {
      let url = getApiUrl('prescriberLookup');
      if (environment.remote) {
        url += '/' + NPI;
      }
      return this.http.get<Prescriber>(url);
    }
  }
}
