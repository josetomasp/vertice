import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as pbi from 'powerbi-client';
import {
  PowerBIEmbedTokenDTO,
  PowerBIReportService
} from './power-bireport.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'healthe-power-bireport',
  templateUrl: './power-bireport.component.html',
  styleUrls: ['./power-bireport.component.scss']
})
export class PowerBIReportComponent implements OnInit {
  // Report ID
  private reportId: string; // simple test reportId: 8abe0764-a5ae-4ed5-a79d-d7630dd2737e
  private groupId: string;
  private powerBiType: string; // reports, dashboards, or paginated-reports
  private powerBiEmbedToken: PowerBIEmbedTokenDTO;
  reportHasLoaded: boolean = false;

  constructor(
    private powerBIReportService: PowerBIReportService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupId'];
    this.powerBiType = this.route.snapshot.params['powerBiType'];
    this.reportId = this.route.snapshot.params['reportId'];
    // The report dropdowns are passing the Customer.dbo.reports table primary key in the URL
    // which breaks us so instead of updating legacy code, I'm just stripping this piece from the URL
    this.reportId = this.reportId.split('&')[0];
    this.powerBIReportService
      .getAccessToken(this.groupId, this.powerBiType, this.reportId)
      .subscribe((result) => {
        this.showReport(result);
      });
    this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        })
      )
      .subscribe(() => {
        location.reload();
      });
  }

  showReport(powerBiEmbedToken: PowerBIEmbedTokenDTO) {
    this.powerBiEmbedToken = powerBiEmbedToken;
    // Embed URL
    let embedUrl: string;
    if (this.powerBiType === 'dashboards') {
      embedUrl =
        'https://app.powerbi.com/dashboardEmbed?dashboardId=' +
        powerBiEmbedToken.reportId +
        '&groupId=' +
        powerBiEmbedToken.groupId;
    } else if (this.powerBiType === 'paginated-reports') {
      embedUrl =
        'https://app.powerbi.com/rdlEmbed?reportId=' +
        powerBiEmbedToken.reportId +
        '&groupId=' +
        powerBiEmbedToken.groupId;
    } else {
      embedUrl =
        'https://app.powerbi.com/reportEmbed?reportId=' +
        powerBiEmbedToken.reportId +
        '&groupId=' +
        powerBiEmbedToken.groupId;
    }

    // Configuration used to describe the hasData and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    let config: pbi.IEmbedConfiguration = {
      type: this.powerBiType === 'dashboards' ? 'dashboard' : 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: powerBiEmbedToken.embedToken,
      embedUrl: embedUrl,
      id: powerBiEmbedToken.reportId,
      settings: {
        // These settings seemed to be used in other examples, but we get a transpiliation error when including them and it works
        filterPaneEnabled: false
        // navContentPaneEnabled: true,
      }
    };

    // Grab the reference to the div HTML element that will host the report.
    let reportContainer = <HTMLElement>(
      document.getElementById('reportContainer')
    );

    // Embed the report and display it within the div container.
    let powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    let report = powerbi.embed(reportContainer, config);
    this.reportHasLoaded = true;

    // PowerBI events: https://learn.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events
    report.off('error');

    report.on('error', (error) => {
      // Not sure how to trigger this, but it looks like this is how we could intercept an error
      console.error(
        'Power BI error in Angular: showReport(accessToken: string)',
        error
      );
    });

    report.on('loaded', () => {
      this.powerBIReportService.updateLoadMetrics(this.powerBiEmbedToken.embedTokenId).subscribe();
    });

    report.on('rendered', () => {
      this.powerBIReportService.updateRenderedMetrics(this.powerBiEmbedToken.embedTokenId).subscribe();
    });
  }

}
