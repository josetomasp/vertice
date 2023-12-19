import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { getApiUrl } from '@shared/lib/http';
import { LomnQR } from './report-returned-lomn-models';

@Injectable({
  providedIn: 'root'
})
export class ReportReturnedLomnService {
  constructor(private http: HttpClient) {}

  lomnQRValidationByLomnId(lomnId: number): Observable<LomnQR> {
    let url = getApiUrl('lomnQRValidation');
    if (environment.remote) {
      url += '?lomnId=' + lomnId;
    }
    return this.http.get<LomnQR>(url);
  }

  resolveUnrecognizedLomn(file: File, qrCode: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('qrCode', qrCode.toString());
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('responseType', 'text');
    let url = getApiUrl('resolveUnrecognizedLomn');
    return this.http.post(url, formData, {
      headers: headers,
      responseType: 'text'
    });
  }
}
