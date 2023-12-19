import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as _moment from 'moment';
import { filter, first, map, pluck } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ClaimSearchRequest, UpdateClaimSearchForm } from '../../claims/store';
import { RiskGraphComponent } from '@shared/components/risk-graph/risk-graph.component';
import {
  RiskGraphAgeRange,
  RiskGraphRequest,
  RiskGraphTimeInterval,
  RiskGraphType
} from '@shared/components/risk-graph/risk-graph.models';
import { RootState } from '../../store/models/root.models';
import { getUserInfo } from '../../user/store/selectors/user.selectors';
import {
  RiskGraphDataRequest,
  RiskGraphSelectCategory,
  RiskGraphSelectLevel
} from '../store/actions/dashboard.actions';
import {
  didRiskGraphLoadOnce,
  getCurrentGraph,
  getCurrentMetrics,
  getCurrentSeriesData,
  isRiskGraphLoading
} from '../store/selectors/dashboard.selectors';
import { PageTitleService } from '@shared/service/page-title.service';
import { FeatureFlagService } from '../../customer-configs/feature-flag.service';
import { ClaimSearchForm } from '@shared/store/models';

const moment = _moment;

interface QuickLink {
  label: string;
  icon: string;
  elementName: string;
  route: string;
}

@Component({
  selector: 'healthe-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  currentMetrics$ = this.store$.pipe(select(getCurrentMetrics));
  currentSeries$ = this.store$.pipe(select(getCurrentSeriesData));
  currentGraph$ = this.store$.pipe(select(getCurrentGraph));
  isGraphLoading$ = this.store$.pipe(select(isRiskGraphLoading));
  riskGraphLoadOnce$ = this.store$.pipe(select(didRiskGraphLoadOnce));

  @ViewChild('riskGraph')
  private riskGraph: RiskGraphComponent;

  componentGroupName: string = 'dashboard';
  riskGraphElementName: string = 'risk-graph';

  quickLinks: QuickLink[] = [
    {
      label: 'All Authorizations',
      icon: 'assets/img/desktop-monitor.png',
      elementName: 'authorizations_all',
      route: '/search-nav/all-authorizations'
    },
    {
      label: 'All Authorizations',
      icon: 'assets/img/desktop-monitor.png',
      elementName: 'authorizations_referrals',
      route: '/referrals/authorizations'
    },
    {
      label: 'Make A Referral',
      icon: 'assets/img/swap-avatars.png',
      elementName: 'make-a-referrals',
      route: '/referrals/make-a-referral-search'
    },
    {
      label: 'POS (ePAQ)',
      icon: 'assets/img/pills-and-bottle.png',
      elementName: 'authorizations_epaq',
      route: '/search-nav/epaq-authorizations'
    },
    {
      label: 'Retro (Paper)',
      icon: 'assets/img/money-in-the-mail.png',
      elementName: 'authorizations_paper',
      route: '/search-nav/paper-authorizations'
    },
    {
      label: 'Referral Search',
      icon: 'assets/img/magnifying-glass.png',
      elementName: 'referral-activity',
      route: '/search-nav/referral-activity'
    },
    {
      label: 'Claim Search',
      icon: 'assets/img/magnifying-glass.png',
      elementName: 'claims_claimSearch',
      route: '/claims/claimSearch'
    }
  ];

  constructor(
    public router: Router,
    public store$: Store<RootState>,
    private pageTitleService: PageTitleService,
    private featureFlagService: FeatureFlagService
  ) {
    this.pageTitleService.setTitle('Dashboard');
  }

  ngOnInit() {}

  // Using ngAfterViewInit() as the risk graph component could be feature toggled off and needs static: false on it's @ViewChild decorator
  ngAfterViewInit() {
    // Filtering on if the risk graph should be displayed to prevent dealing with risk graph code if the graph is configured to not display
    // Most of the risk graph code should probably be refactored and migrated into risk-graph.component.ts/html
    this.riskGraphLoadOnce$
      .pipe(
        first(),
        filter(
          () =>
            !this.featureFlagService.shouldElementBeRemoved(
              this.componentGroupName,
              this.riskGraphElementName
            )
        )
      )
      .subscribe((didLoadOnce) => {
        if (false === didLoadOnce) {
          this.fetchRiskGraphData(this.riskGraph.claimAgeRange);
        }
      });
  }

  goToClaimSearch(metricName: string) {
    this.currentGraph$.pipe(first()).subscribe((riskGraphType) => {
      let riskCategory = 'All';
      let riskLevel = 'All';

      switch (riskGraphType) {
        default:
        case RiskGraphType.CATEGORY:
          riskCategory = metricName;
          break;

        case RiskGraphType.LEVEL:
          // Need to map to the same values as the dropdowns.
          switch (metricName) {
            default:
              break;

            case 'Highest':
              riskLevel = '5 - Highest';
              break;

            case 'High':
              riskLevel = '4 - High';
              break;

            case 'Medium':
              riskLevel = '3 - Medium';
              break;

            case 'Low':
              riskLevel = '2 - Low';
              break;

            case 'Lowest':
              riskLevel = '1 - Lowest';
              break;
          }

          break;
      }

      this.store$
        .pipe(
          select(getUserInfo),
          pluck('email'),
          first(),
          map((email: string) => ({
            claimNumber: '',
            claimantLastName: '',
            claimantFirstName: '',
            assignedAdjuster: email,
            dateOfInjury: null,
            riskLevel: riskLevel,
            riskCategory: riskCategory,
            stateOfVenue: 'All'
          }))
        )
        .subscribe((form: ClaimSearchForm) => {
          this.store$.dispatch(new UpdateClaimSearchForm(form));
          this.store$.dispatch(new ClaimSearchRequest(form));
          this.router.navigateByUrl('/claims/claimSearch');
        });
    });
  }

  fetchRiskGraphData(ageRange: RiskGraphAgeRange) {
    if (null == ageRange) {
      return;
    }
    const request: RiskGraphRequest = {
      riskStartDate: moment()
        .subtract(1, 'year')
        .format(environment.dateFormat),

      riskEndDate: moment().format(environment.dateFormat),
      doiStartDate: ageRange.fromDate,
      doiEndDate: ageRange.toDate,
      timeInterval: RiskGraphTimeInterval.MONTHLY
    };

    this.store$.dispatch(new RiskGraphDataRequest(request));
  }

  dataPointClicked(metricName: string) {
    this.goToClaimSearch(metricName);
  }

  riskGraphTypeChanged($event: RiskGraphType) {
    switch ($event) {
      default:
      case RiskGraphType.CATEGORY:
        this.store$.dispatch(new RiskGraphSelectCategory($event));
        break;

      case RiskGraphType.LEVEL:
        this.store$.dispatch(new RiskGraphSelectLevel($event));
        break;
    }
  }

  navigateForQuicklink(route: string) {
    this.router.navigateByUrl(route);
  }
}
