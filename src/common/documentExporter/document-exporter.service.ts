import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DocumentExportDTO } from './documentExportDTO';
import { getApiUrl, hexDecode } from 'src/app/shared/lib';
import { FeatureFlagService } from 'src/app/customer-configs/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentExporterService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private featureFlagService: FeatureFlagService
  ) {}

  exportDocument(exportDoc: DocumentExportDTO): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      const httpOptions = {
        observe: 'response' as 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'blob' as 'blob'
      };

      return this.http
        .post(`${getApiUrl('claimActivityExport')}`, exportDoc, httpOptions)
        .pipe(
          map((req: HttpResponse<any>) => {
            req.body.statusCode = req.status;
            return req.body;
          }),
          catchError<any, Observable<any>>(
            this.handleError('exportDocument()', [])
          )
        )
        .subscribe((response) => {
          if (typeof response === 'string') {
            observer.next(response);
            observer.complete();
            return;
          }
          const capitilizedProductType =
            exportDoc.productType.charAt(0).toUpperCase() +
            exportDoc.productType.slice(1);
          let filename = 'ClaimActivity_';
          filename += hexDecode(exportDoc.claimNumber) + '_';

          let productTypeLabelNameMap = [
            { name: 'all', value: 'allActivityTab' },
            { name: 'pharmacy', value: 'pharmacyActivityTab' },
            { name: 'clinical', value: 'clinicalActivityTab' },
            { name: 'ancillary', value: 'ancillaryActivityTab' }
          ];

          let productTypeName = productTypeLabelNameMap.find(function(element) {
            return element.name === exportDoc.productType;
          }).value;

          let productTypeTabLabel = this.featureFlagService.labelChange(
            capitilizedProductType,
            productTypeName
          );

          filename += productTypeTabLabel + '_';
          filename += this.getTimeStamp();

          switch (exportDoc.exportType) {
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

        });
    });
  }

  getTimeStamp(): string {
    const date: Date = new Date();
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('Error calling: ' + operation);

      error = 'SERVICE ERROR - ' + operation;

      return of(error as T);
    };
  }
}
