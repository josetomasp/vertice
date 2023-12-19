import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl, hexEncode } from '@shared/lib/index';
import * as _moment from 'moment';
import { Observable, Observer, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ClaimSearchExport,
  SnoozeClaimActionsQuery,
  SnoozeClaimActionsResponse
} from './store/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ClaimSearchForm,
  ClaimSearchOptions,
  ClaimSearchResponse
} from '@shared/store/models';
import { apiUrls } from '../apiUrls';

const moment = _moment;

@Injectable({ providedIn: 'root' })
export class ClaimsService {
  /**
   *
   * A little note on error handling in this file...
   *
   * This class is meant to feed the effects in the store$ so the the errors are
   * handled at ClaimSearchEffects
   */

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  getClaimSearchOptions(): Observable<ClaimSearchOptions> {
    return this.http.get<ClaimSearchOptions>(getApiUrl('claimSearchOptions'));
  }

  generateClaimSearchParams(
    queryForm: ClaimSearchForm | ClaimSearchExport,
    params = new URLSearchParams()
  ) {
    if (!environment.remote) {
      return params;
    }
    /**
     * Check for claim number first
     */

    if (queryForm.claimNumber) {
      params.append('claimNumber', queryForm.claimNumber);

      if ((queryForm as ClaimSearchExport).exportType) {
        params.append(
          'exportType',
          (queryForm as ClaimSearchExport).exportType
        );
      }
    } else {
      Object.keys(queryForm).forEach((key) => {
        if (queryForm[key]) {
          /**
           * Date of injury will always be an object, even when the dates are
           * empty
           */
          if (key === 'dateOfInjury') {
            const dateRange = queryForm[key];
            const fromDate = moment(dateRange.fromDate);
            const toDate = moment(dateRange.toDate);
            /**
             * Ignore if one of the dates isn't valid
             */
            if (fromDate.isValid() && toDate.isValid()) {
              params.append(
                'doiStartDate',
                fromDate.format(environment.dateFormat)
              );
              params.append(
                'doiEndDate',
                toDate.format(environment.dateFormat)
              );
            } else {
              return throwError('One of the dates is invalid');
            }
          } else if (key === 'riskLevel' && queryForm[key] === 'Unidentified') {
            params.append(key, 'none');
          } else {
            params.append(key, queryForm[key]);
          }
        }
      });
    }
    return params;
  }

  claimsSearch(queryForm: ClaimSearchForm): Observable<ClaimSearchResponse> {
    let params = this.generateClaimSearchParams(queryForm);
    return this.http.get<ClaimSearchResponse>(
      getApiUrl('claimsSearch', params)
    );
  }

  claimsSearchExport(queryForm: ClaimSearchExport): Observable<string> {
    let params = this.generateClaimSearchParams(queryForm);

    return Observable.create((observer: Observer<string>) => {
      const httpOptions = {
        observe: 'response' as 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'blob' as 'blob'
      };

      return this.http
        .get(getApiUrl('claimsSearchExport', params), httpOptions)
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

            let filename = 'ClaimSearch_';
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

  snoozeClaimRiskActions(
    query: SnoozeClaimActionsQuery
  ): Observable<SnoozeClaimActionsResponse> {
    return this.http.patch(
      `${apiUrls.snoozeRiskActions}/${hexEncode(query.claimNumber)}`,
      query
    );
  }

  showSnackBar(message: string, success: boolean) {
    if (true === success) {
      this.snackBar.open(message, null, {
        duration: 2000,
        panelClass: ['success', 'snackbar']
      });
    } else {
      this.snackBar.open(message, 'X', {
        panelClass: ['danger', 'snackbar']
      });
    }
  }
}
