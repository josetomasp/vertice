import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { hexDecode } from '@shared';
import { combineLatest, zip } from 'rxjs';
import { first, takeWhile, takeUntil, map } from 'rxjs/operators';
import { RootState } from '../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../store/selectors/router.selectors';
import { IncidentsRequest } from '../store/actions/incidents-tab.actions';
import {
  didIncidentsTabFetchFromServer,
  getIncidentsResponse,
  getIsIncidentsLoading,
  getIncidentsErrors
} from '../store/selectors/incidents-tab.selectors';
import { tableColumns } from './columns';
import { PageTitleService } from '@shared/service/page-title.service';
import { Router } from '@angular/router';
import { generate3_0ABMReferralActivityTabUrl } from '@shared/lib/links';
import { Vertice25Service } from '@shared/service/vertice25.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent extends DestroyableComponent implements OnInit {
  didFetchFromServer$ = this.store$.pipe(
    select(didIncidentsTabFetchFromServer)
  );

  isLoading$ = this.store$.pipe(select(getIsIncidentsLoading));
  incidentsResponse$ = this.store$.pipe(select(getIncidentsResponse));
  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));
  incidentsErrors$ = this.store$.pipe(select(getIncidentsErrors));
  showIncidentsErrors$ = this.incidentsErrors$.pipe(
    map((errors) => errors && errors.length > 0)
  );

  tableColumns = tableColumns;

  constructor(
    public store$: Store<RootState>,
    private pageTitleService: PageTitleService,
    public vertice25Service: Vertice25Service,
    protected router: Router
  ) {
    super();
    this.pageTitleService.setTitleWithClaimNumber('Claim View', 'Incidents');
  }

  ngOnInit() {
    this.didFetchFromServer$.pipe(first()).subscribe((didFetchFromServer) => {
      if (false === didFetchFromServer) {
        this.fetchDataFromServer();
      }
    });
  }

  fetchDataFromServer() {
    zip(this.claimNumber$, this.customerId$)
      .pipe(first())
      .subscribe(([claimNumber, customerId]) => {
        this.store$.dispatch(
          new IncidentsRequest({
            claimNumber: claimNumber,
            customerId: customerId
          })
        );
      });
  }

  openIncidentEdit(incidentNumber) {
    this.vertice25Service.editIncidentReports(incidentNumber);
  }

  createIncident() {
    combineLatest([this.claimNumber$, this.customerId$])
      .pipe(first())
      .subscribe(([claimNumber, customerId]) => {
        claimNumber = hexDecode(claimNumber);
        customerId = hexDecode(customerId);
        this.vertice25Service.createIncidentReportWithParameters(
          customerId,
          claimNumber
        );
      });
  }

  goToReferralActivity(incident) {
    if (incident.productType === 'Ancillary') {
      zip(this.claimNumber$, this.customerId$)
        .pipe(first())
        .subscribe(([claimNumber, customerId]) => {
          customerId = hexDecode(customerId);
          claimNumber = hexDecode(claimNumber);

          this.router.navigate([
            generate3_0ABMReferralActivityTabUrl(
              customerId,
              claimNumber,
              incident.referralID,
              incident.service,
              incident.isLegacy
            )
          ]);
        });
    } else {
      window.open(
        '/abm/index.jsp;#AbmRef;referralId=' + incident.referralID,
        '_blank'
      );
    }
  }
}
