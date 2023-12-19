import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import {
  generateQueryParams,
  getApiUrl,
  hexDecode,
  VerticeResponse
} from '@shared';
import { combineLatest, Observable, Observer, of, throwError } from 'rxjs';
import { delay, first, map, mergeMap } from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { RootState } from '../../../../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../store/selectors/router.selectors';
import { RequestReferralCurrentActivity } from '../../store/actions/referral-activity.actions';
import {
  PostReferralNoteRequestObject,
  ReferralCurrentActivity,
  ReferralNote,
  ReferralTableDocumentExportRequest
} from '../../store/models';
import { ReferralGenericQuery } from '../../store/models/referral-id.models';
import { apiUrls } from '../../../../../apiUrls';

@Injectable({ providedIn: 'root' })
export class ReferralActivityService {
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  constructor(
    public http: HttpClient,
    private store$: Store<RootState>,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  getReferralApiUrl(endpoint: string, query: URLSearchParams) {
    if (environment.remote) {
      return `${apiUrls[endpoint]}?${query}`;
    } else {
      return `/api/${endpoint}/${query.get('referralId')}`;
    }
  }

  requestForInformation(
    encodedReferralId: string,
    vendorCode: string,
    requestType: string,
    serviceDate: string,
    encodedCustomerId: string
  ): Observable<any> {
    let body = {
      vendorCode: vendorCode,
      referralId: encodedReferralId,
      requestType: requestType,
      dateOfService: serviceDate
    };
    if (environment.remote) {
      return this.http.post<any>(
        `${getApiUrl('referralRequestForInformation')}` +
          '/referral/' +
          encodedReferralId +
          '?customerId=' +
          encodedCustomerId,
        body
      );
    } else {
      return this.getRandomSuccessOrFailObservable();
    }
  }

  getReferralNotes(request: ReferralGenericQuery): Observable<ReferralNote[]> {
    return this.http.get<ReferralNote[]>(
      getApiUrl('referralNotes', generateQueryParams(request))
    );
  }

  postReferralNote({
    referralId,
    note,
    archType
  }: PostReferralNoteRequestObject): Observable<string> {
    return this.http.post(
      `${getApiUrl(
        'referralNotes',
        generateQueryParams({
          referralId
        })
      )}&archType=${archType}`,
      note,
      {
        responseType: 'text'
      }
    );
  }

  reloadCurrentReferralActivity(): void {
    combineLatest([
      this.encodedCustomerId$,
      this.encodedClaimNumber$,
      this.encodedReferralId$
    ])
      .pipe(
        first(),
        map(([customerId, claimNumber, referralId]) => ({
          customerId,
          claimNumber,
          referralId
        }))
      )
      .subscribe((query) => {
        this.store$.dispatch(new RequestReferralCurrentActivity(query));
      });
  }

  public referralTableExport(
    queryForm: ReferralTableDocumentExportRequest
  ): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
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
        .post(
          getApiUrl('referralCurrentActivityExport'),
          queryForm,
          httpOptions
        )
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
              'ReferralActivity_Claim_' +
              hexDecode(queryForm.encodedClaimNumber) +
              '_Referral_' +
              hexDecode(queryForm.encodedReferralId) +
              '_';
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

  getCurrentActivity(genericQuery: ReferralGenericQuery) {
    const query = generateQueryParams(genericQuery);
    return this.http.get<VerticeResponse<ReferralCurrentActivity>>(
      this.getReferralApiUrl('referralCurrentActivity', query)
    );
  }

  getTimeStamp(): string {
    const date: Date = new Date();
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }

  private getRandomSuccessOrFailObservable(): Observable<any> {
    return of(Math.floor(Math.random() * 2)).pipe(
      delay(2000),
      mergeMap((n) => {
        if (n === 1) {
          return of({});
        } else {
          return throwError(500);
        }
      })
    );
  }
}
