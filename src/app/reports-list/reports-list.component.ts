import { Component, OnInit } from '@angular/core';
import { ReportsListService } from './reports-list.service';
import { Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { PageTitleService } from '@shared/service/page-title.service';

export interface ReportItem {
  reportGroup: string;
  reportName: string;
  reportLink: string;
  externalLink: boolean;
  new: boolean;
}

export interface ReportAPIReponse {
  reports: { [p: string]: ReportItem[] };
  errors: string[];
}

@Component({
  selector: 'healthe-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  Object = Object;
  reportsListByGroup = {};
  errors: string[] = [];

  constructor(
    private router: Router,
    private reportsService: ReportsListService,
    private pageTitleService: PageTitleService
  ) {}

  ngOnInit() {
    this.pageTitleService.setTitle('Reports');
    this.reportsService
      .getReportsList()
      .pipe(
        filter((values) => Object.keys(values).length > 0),
        first()
      )
      .subscribe((values) => {
        this.reportsListByGroup = values.reports;
        this.errors = values.errors;
      });
  }

  navigateUser(report: ReportItem) {
    if (report.externalLink) {
      window.open(report.reportLink, '_blank');
    } else {
      this.router.navigate(['../' + report.reportLink]);
    }
  }
}
