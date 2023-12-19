import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateQueryParams, getApiUrl, hexDecode, hexEncode } from '@shared';
import { Observable } from 'rxjs/internal/Observable';
import {
  ClinicalHistoryExport,
  UIFusionClinicalHistory
} from '../../store/models/fusion/fusion-clinical-history.models';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FusionClinicalHistoryService {
  constructor(public http: HttpClient, private datePipe: DatePipe) {}
  getClinicalHistory(referralId: string): Observable<UIFusionClinicalHistory> {
    return this.http.get<UIFusionClinicalHistory>(
      getApiUrl(
        'fusionClinicalHistory',
        generateQueryParams({
          encodedReferralId: hexEncode(referralId)
        })
      )
    );
  }

  exportClinicalHistory(docExport: ClinicalHistoryExport) {
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'blob' as 'blob'
    };
    return this.http
      .post(getApiUrl('fusionClinicalHistoryExport'), docExport, httpOptions)
      .pipe(
        map((req: HttpResponse<any>) => {
          req.body.statusCode = req.status;
          return req.body;
        })
      )
      .subscribe((response) => {
        let filename = 'Clinical_History_Referral_'
          .concat(hexDecode(docExport.encodedReferralId))
          .concat('_');
        filename += this.getTimeStamp();
        switch (docExport.exportType) {
          case 'PDF':
            filename += '.pdf';
            break;

          case 'EXCEL':
            filename += '.xlsx';
            break;
        }

        let fileURL;
        try {
          fileURL = URL.createObjectURL(response);
        } catch (e) {
          throwError(e);
        }

        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = fileURL;
        a.target = '_blank';
        a.download = filename;
        a.click();
        a.remove();

      });
  }

  getTimeStamp(): string {
    const date: Date = new Date();
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }
}
