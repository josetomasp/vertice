import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { combineLatest, Observable, Observer, throwError } from 'rxjs';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../store/selectors/router.selectors';
import { Range } from '@healthe/vertice-library';
import { ActivityResponse } from '@shared/models/claim-activity-data';
import { first, map, switchMap } from 'rxjs/operators';
import { generateQueryParams } from '@shared/lib/http/generateQueryParams';
import { environment } from '../../../../environments/environment';
import * as _moment from 'moment';
import { hexDecode } from '@shared/lib/formatters/hexDecode';
import { DatePipe } from '@angular/common';
import { SharedClaimHistoryExportParameters } from '@shared/store/models/sharedClaimHistory.models';
import { getApiUrl } from '@shared/lib/http';

const moment = _moment;

@Injectable({
  providedIn: 'root'
})
export class ClinicalHistoryService {
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  constructor(
    private http: HttpClient,
    public store$: Store<RootState>,
    private datePipe: DatePipe
  ) {}

  getClinicalHistory(dateRange: Range): Observable<ActivityResponse> {
    return combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$
    ]).pipe(
      first(),
      switchMap(([encodedClaimNumber, encodedCustomerId]) =>
        this.http.get<ActivityResponse>(
          getApiUrl(
            'clinicalHistory',
            generateQueryParams({
              claimNumber: encodedClaimNumber,
              customerId: encodedCustomerId,
              fromDate: moment(dateRange.fromDate).format(
                environment.dateFormat
              ),
              toDate: moment(dateRange.toDate).format(environment.dateFormat)
            })
          )
        )
      )
    );
  }

  public clinicalHistoryExport(
    queryForm: SharedClaimHistoryExportParameters
  ): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      if (environment.remote === false) {
        observer.next('No Remote');
        return;
      }

      const httpOptions = {
        observe: 'response' as 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'blob' as 'blob'
      };
      return this.http
        .post(getApiUrl('clinicalHistoryExport'), queryForm, httpOptions)
        .pipe(
          map((req: HttpResponse<any>) => {
            req.body.statusCode = req.status;
            return req.body;
          })
        )
        .subscribe(
          (response) => {
            if (typeof response === 'string') {
              observer.next(response);
              observer.complete();
              return;
            }

            let filename =
              'ClinicalHistory_' + hexDecode(queryForm.claimNumber) + '_';
            filename += this.getTimeStamp();

            switch (queryForm.exportType) {
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
            observer.next('OK');

          },
          () => {
            observer.error('Error');
          }
        );
    });
  }

  getTimeStamp(): string {
    const date: Date = new Date();
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }
}
