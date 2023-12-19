import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-solid-svg-icons/faChevronUp';
import {
  ClaimStatusEnum,
  HealtheSystemErrorComponent
} from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';

import { RxcardModalComponent } from '@shared/components/rxcard-modal/rxcard-modal.component';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import { TrendingRiskModalDataRequest } from '@shared/store/actions/trending-risk-modal.actions';
import {
  getAbmClaimStatus,
  getPbmClaimStatus
} from '@shared/store/selectors/claim.selectors';
import { isEmpty } from 'lodash';
import { Observable, zip } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { RootState } from '../store/models/root.models';
import {
  getDecodedClaimNumber,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../store/selectors/router.selectors';
import { RequestPendingActivity } from './store/actions/activity-tab.actions';
import { ResetClaimView } from './store/actions/claim-view.actions';
import { PendingActivityTotals } from './store/models/activity-tab.models';
import { getPendingTotals } from './store/selectors/activity-tab.selectors';

import { SharedStateReset } from '@shared/store/actions/shared.actions';
import { ClaimViewSearchRequest } from '@shared/store/actions/claim-view.actions';
import { ClaimSearchForm } from '@shared/store/models';
import { getClaimViewSearchResults } from '@shared/store/selectors/claim-view-selectors';
import { ClaimDocumentTableComponentStoreService } from '@shared/components/claim-documents-table/claim-document-table-component-store.service';
import {
  ClaimViewBillingTabStore
} from './billing/claim-view-billing-tab.store';

@Component({
  selector: 'healthe-claim-view',
  templateUrl: './claim-view.component.html',
  styleUrls: ['./claim-view.component.scss'],
  providers: [ClaimDocumentTableComponentStoreService, ClaimViewBillingTabStore]
})
export class ClaimViewComponent implements OnInit, OnDestroy, AfterContentInit {
  claimSearchResults$ = this.store$.pipe(select(getClaimViewSearchResults));
  riskLevelNumber$ = this.claimSearchResults$.pipe(
    filter((results) => !isEmpty(results)),
    map((results) => {
      return results[0].riskLevelNumber;
    })
  );
  riskLevel$ = this.claimSearchResults$.pipe(
    filter((results) => !isEmpty(results)),
    map((results) => {
      return results[0].riskLevel;
    })
  );

  requestMenuIcon = faChevronDown;

  public modals = {
    rxCardModalComponent: {
      component: RxcardModalComponent,
      size: '1000px',
      action: () => {}
    },
    healtheSystemErrorComponent: {
      component: HealtheSystemErrorComponent,
      size: '356px',
      action: () => {}
    }
  };
  claimBannerPanelHeaderHeight = '';
  pbmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getPbmClaimStatus)
  );
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );
  decodedClaimNumber$ = this.store$.pipe(select(getDecodedClaimNumber));
  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId), first());
  customerID: string;
  claimNumber: string;
  pendingActvityTotals$: Observable<PendingActivityTotals> = this.store$.pipe(
    select(getPendingTotals)
  );
  componentGroupName = 'claim-view';
  navigationTabs = [
    {
      name: 'Activity',
      isSelected: true,
      routerLink: 'activity',
      elementName: 'activityTab'
    },
    {
      name: 'Claimant',
      isSelected: false,
      routerLink: 'claimant',
      elementName: 'claimantTab'
    },
    {
      name: 'Documents',
      isSelected: false,
      routerLink: 'documents',
      elementName: 'documentsTab'
    },
    {
      name: 'Contacts',
      isSelected: false,
      routerLink: 'contacts',
      elementName: 'contactsTab'
    },
    {
      name: 'Eligibility',
      isSelected: false,
      routerLink: 'eligibility',
      elementName: 'eligibilityTab'
    },
    {
      name: 'ICD Codes',
      isSelected: false,
      routerLink: 'icdCodes',
      elementName: 'icdCodesTab'
    },
    {
      name: 'Billing',
      isSelected: false,
      routerLink: 'billing',
      elementName: 'billingTab'
    },
    {
      name: 'Incidents',
      isSelected: false,
      routerLink: 'incidents',
      elementName: 'incidentsTab'
    }
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public store$: Store<RootState>,
    public breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .subscribe((result) => {
        result.breakpoints[Breakpoints.XSmall]
          ? (this.claimBannerPanelHeaderHeight = '190px')
          : result.breakpoints[Breakpoints.Small]
          ? (this.claimBannerPanelHeaderHeight = '110px')
          : result.breakpoints[Breakpoints.Medium]
          ? (this.claimBannerPanelHeaderHeight = '110px')
          : result.breakpoints[Breakpoints.Large]
          ? (this.claimBannerPanelHeaderHeight = '39px')
          : result.breakpoints[Breakpoints.XLarge]
          ? (this.claimBannerPanelHeaderHeight = '39px')
          : (this.claimBannerPanelHeaderHeight = '190px');
      });
  }

  ngOnInit(): void {
    zip(
      this.encodedClaimNumber$,
      this.decodedClaimNumber$,
      this.encodedCustomerId$
    ).subscribe(([claimNumber, decodedClaimNumber, customerId]) => {
      if (this.route.snapshot.fragment === 'riskModal') {
        this.store$.dispatch(
          new TrendingRiskModalDataRequest({ claimNumber: decodedClaimNumber })
        );
      }
      const request: ClaimSearchForm = {
        claimNumber: decodedClaimNumber,
        claimantLastName: '',
        claimantFirstName: '',
        assignedAdjuster: 'All',
        dateOfInjury: null,
        riskLevel: 'All',
        riskCategory: 'All',
        stateOfVenue: 'All'
      };

      this.store$.dispatch(new ClaimViewSearchRequest(request));
      this.store$.dispatch(new RequestClaimV2({ claimNumber, customerId }));
      this.store$.dispatch(
        new RequestPendingActivity({
          claimNumber,
          customerId
        })
      );
    });
  }

  openDialog(modalName): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = this.modals[modalName].size;

    const dialogRef = this.dialog.open(
      this.modals[modalName].component,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.modals[modalName].action();
    });
  }

  ngAfterContentInit() {}

  ngOnDestroy(): void {
    this.store$.dispatch(new ResetClaimView());
    this.store$.dispatch(new SharedStateReset(null));
  }

  setOpenUntilClose(requestMenu: MatMenu) {
    this.requestMenuIcon = faChevronUp;
    requestMenu.closed.subscribe(() => {
      this.requestMenuIcon = faChevronDown;
    });
  }
}
