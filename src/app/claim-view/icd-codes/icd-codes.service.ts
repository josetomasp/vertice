import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '@shared/lib/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IcdCodeSet } from '../store/models/icd-codes.models';

@Injectable({
  providedIn: 'root'
})
export class IcdCodesService {
  constructor(private http: HttpClient) {}

  lookupIcdCodes(query: IcdCodeSet): Observable<IcdCodeSet> {
    if (environment.remote) {
      return this.http.post<IcdCodeSet>(getApiUrl('icdCodeLookup'), query);
    } else {
      return this.http.get<IcdCodeSet>(getApiUrl('icdCodeLookup'));
    }
  }
}
