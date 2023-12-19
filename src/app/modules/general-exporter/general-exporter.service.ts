import { Injectable } from '@angular/core';
import { GeneralExportRequest } from '@modules/general-exporter/general-exporter.models';
import { getApiUrl, HealtheTableColumnDef } from '@shared';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralExporterService {
  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  doExport(request: GeneralExportRequest) {
    let filename = request.fileName + '_';

    filename += this.getTimeStamp();
    switch (request.outputFormat) {
      case 'PDF':
        filename += '.pdf';
        break;

      case 'EXCEL':
        filename += '.xlsx';
        break;
    }
    request.fileName = filename;

    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'blob' as 'blob'
    };

    this.http
      .post(`${getApiUrl('generalExporter')}`, request, httpOptions)
      .pipe(
        map((req: HttpResponse<any>) => {
          req.body.statusCode = req.status;
          return req.body;
        })
      )
      .subscribe((response) => {
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

  // Will fill out the displayNameColumnList and tableData provided that the HealtheTableColumnDef.name matches
  // the table data member name and that the HealtheTableColumnDef.label is also filled in for the correct column display name.
  buildTableData(
    columns: HealtheTableColumnDef[],
    tableData: any[]
  ): GeneralExportRequest {
    const request: GeneralExportRequest = {
      outputFormat: 'EXCEL',
      sheetName: 'Sheet 1',
      fileName: 'file.xlsx',
      displayNameColumnList: [],
      displayDisclaimer: false,
      tableData: {}
    };

    columns.forEach((column) => {
      const displayName = column.label;
      const tableRowKey = column.name;
      request.displayNameColumnList.push(displayName);
      const tableColumnData = [];
      request.tableData[displayName] = tableColumnData;
      tableData.forEach((row) => {
        tableColumnData.push(row[tableRowKey]);
      });
    });

    return request;
  }

  getTimeStamp(): string {
    const date: Date = new Date();
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }
}
