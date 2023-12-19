import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { generateQueryParams, VerticeResponse } from '@shared';
import { getApiUrl } from '@shared/lib/http';
import { environment } from '../../../../../environments/environment';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { MatMenu } from '@angular/material/menu';
import { first, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

export interface CscViewLogDataItem {
  lastModified: string;
  modifiedBy: string;
  memberId: string;
  ndc: string;
  authStatus: string;
  authStatusQueue: string;
  healtheComments: string;
  adjusterComments: string;
}

@Component({
  selector: 'healthe-view-log-modal',
  templateUrl: './view-log-modal.component.html',
  styleUrls: ['./view-log-modal.component.scss']
})
export class ViewLogModalComponent implements OnInit {
  tableRows: CscViewLogDataItem[] = [];
  tableColumns: string[] = [
    'lastModified',
    'modifiedBy',
    'memberId',
    'ndc',
    'authStatus',
    'authStatusQueue',
    'healtheComments',
    'adjusterComments'
  ];

  isLoading = true;
  exportDropdownOptions = ['PDF', 'EXCEL'];
  exportMenuIcon = faChevronDown;

  constructor(
    @Inject(MAT_DIALOG_DATA) public authorizationId: string,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getLogData(this.authorizationId).subscribe((response) => {
      this.isLoading = false;

      if (response.httpStatusCode === 200) {
        this.tableRows = response.responseBody;
      }
    });
  }

  getLogData(
    authId: string
  ): Observable<VerticeResponse<CscViewLogDataItem[]>> {
    let url = getApiUrl(
      'cscViewLogData',
      generateQueryParams({ authorizationId: authId })
    );

    return this.http.get<VerticeResponse<CscViewLogDataItem[]>>(url);
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  doExport(exportOption: string) {
    if (environment.remote === false) {
      return;
    }
    const httpOptions = {
      observe: 'response' as 'response',
      responseType: 'blob' as 'blob'
    };

    const url = getApiUrl(
      'cscViewLogDataExport',
      generateQueryParams({
        authorizationId: this.authorizationId,
        documentType: exportOption
      })
    );

    this.http
      .get(url, httpOptions)
      .pipe(
        map((req: HttpResponse<any>) => {
          req.body.statusCode = req.status;
          return req.body;
        })
      )
      .subscribe(
        (response) => {
          let filename =
            'AuthorizationId_' + this.authorizationId + '__AuthorizationLog_';
          filename += this.datePipe.transform(new Date(), 'MM-dd-yyyy');

          switch (exportOption) {
            case 'PDF':
              filename += '.pdf';
              break;

            default:
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

        },
        () => {}
      );
  }
}
