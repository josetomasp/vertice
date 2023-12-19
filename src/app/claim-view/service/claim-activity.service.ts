import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Range } from '@healthe/vertice-library';
import { generateQueryParams, getApiUrl } from '@shared';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DocumentExporterService } from '../../../common/documentExporter/document-exporter.service';
import { DocumentExportDTO } from '../../../common/documentExporter/documentExportDTO';
import { environment } from '../../../environments/environment';
import { ClaimActivityDTO } from '../store/models/activity-tab.models';

const moment = _moment;

@Injectable()
export class ClaimActivityService {
  constructor(
    private http: HttpClient,
    public documentExporterService: DocumentExporterService
  ) {}

  getClaimActivity(
    claimNumber: string,
    customerId: string,
    dateRange: Range
  ): Observable<HttpResponse<ClaimActivityDTO>> {
    const url = getApiUrl(
      'claimActivity',
      generateQueryParams({
        claimNumber,
        customerId,
        fromDate: moment(dateRange.fromDate).format(environment.dateFormat),
        toDate: moment(dateRange.toDate).format(environment.dateFormat)
      })
    );

    return this.http.get<ClaimActivityDTO>(url, {
      observe: 'response'
    });
  }

  exportDocument(docExport: DocumentExportDTO) {
    return this.documentExporterService.exportDocument(docExport);
  }

  getPendingActivity(claimNumber: string, customerId: string) {
    return this.http.get(
      getApiUrl(
        'pendingClaimActivity',
        generateQueryParams({
          claimNumber,
          customerId
        })
      )
    );
  }
}
