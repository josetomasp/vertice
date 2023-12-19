import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import {
  combineLatest,
  from,
  Observable,
  of,
  Subject,
  Subscription,
  zip
} from 'rxjs';
import {
  filter,
  first,
  map,
  mergeMap,
  startWith,
  takeUntil,
  toArray
} from 'rxjs/operators';
import { RootState } from '../../../store/models/root.models';
import {
  PendingActivityData,
  PendingActivityTotals
} from '../../store/models/activity-tab.models';
import {
  getActivityTab,
  getPendingTotals,
  isPendingLoading
} from '../../store/selectors/activity-tab.selectors';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { hexDecode } from '@shared';
import { Router } from '@angular/router';
import {
  generate3_0ABMReferralAuthorizationTabUrl,
  generateExternal3_0PBMAuthorizationTabUrl
} from '@shared/lib/links';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';

@Component({
  selector: 'healthe-pending-activity-table',
  templateUrl: './pending-activity-table.component.html',
  styleUrls: ['./pending-activity-table.component.scss']
})
export class PendingActivityTableComponent extends DestroyableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  activeTabName: string;

  claimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    takeUntil(this.onDestroy$)
  );
  customerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    takeUntil(this.onDestroy$)
  );

  activeTab$: Observable<string> = this.store$.pipe(select(getActivityTab));
  pendingDataSource: MatTableDataSource<
    PendingActivityData
  > = new MatTableDataSource();
  tableColumns: Array<string> = [
    'rush',
    'type',
    'creationDate',
    'prescriber',
    'pharmacyOrVendor',
    'itemName',
    'descriptionOrReason',
    'productType',
    'requestorRole',
    'action'
  ];
  tableColumns$: Observable<Array<string>> = combineLatest(
    of(this.tableColumns),
    this.activeTab$
  ).pipe(
    mergeMap(([columns, activeTab]) => {
      return from(columns).pipe(
        filter((columnName) => this.isColumnIncluded(activeTab, columnName)),
        toArray()
      );
    })
  );

  isLoading$ = this.store$.pipe(select(isPendingLoading));
  pendingActvityTotals$: Observable<PendingActivityTotals> = this.store$.pipe(
    select(getPendingTotals)
  );
  tabChanged$ = new Subject();
  hideNoDataVerbiage: boolean = false;
  pendingActivitySubscription: Subscription = null;
  labels = {
    rush: {
      all: 'RUSH',
      pharmacy: 'RUSH',
      clinical: 'RUSH',
      ancillary: 'RUSH'
    },
    type: {
      all: 'TYPE',
      pharmacy: 'ACTIVITY TYPE',
      clinical: 'ACTIVITY TYPE',
      ancillary: 'SERVICE TYPE'
    },
    pharmacyOrVendor: {
      all: 'PHARMACY / VENDOR',
      pharmacy: 'PHARMACY',
      clinical: 'PHARMACY',
      ancillary: 'VENDOR'
    }
  };

  private tabNames = {
    Ancillary: 'ancillary',
    Pharmacy: 'pharmacy',
    Clinical: 'clinical',
    '': 'all'
  };

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    protected router: Router
  ) {
    super();
  }

  @Input()
  set pendingActivities(data: PendingActivityData[]) {
    this.pendingDataSource.data = data.sort((a, b) => {
      /**
       *  <Date> - <Date> works in javascript
       *  but typescript complains...
       *  Hence the number assertion
       */
      const aDate = +new Date(a.creationDate);
      const bDate = +new Date(b.creationDate);
      return bDate - aDate;
    });
  }

  ngOnInit() {
    this.pendingActivitySubscription = combineLatest([
      this.pendingActvityTotals$,
      this.tabChanged$.pipe(startWith())
    ]).subscribe(([pendingTotals]) => {
      const tabName = this.tabNames[this.activeTabName];
      this.hideNoDataVerbiage  = pendingTotals[tabName] !== 0;
    });
  }

  isColumnIncluded(activeTab: String, columnName: String): boolean {
    switch (activeTab) {
      case 'all':
        return columnName !== 'requestorRole';
      case 'clinical':
      case 'pharmacy':
        return columnName !== 'productType' && columnName !== 'requestorRole';
      case 'ancillary':
        return (
          columnName !== 'productType' && columnName !== 'descriptionOrReason'
        );
      default:
        return true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.activeTabName != null &&
      changes.activeTabName.currentValue !== changes.activeTabName.previousValue
    ) {
      this.tabChanged$.next();
    }
  }

  ngOnDestroy() {
    this.pendingActivitySubscription.unsubscribe();
  }

  getLabel$(name: string) {
    return this.activeTab$.pipe(
      map((activeTab) => {
        return this.labels[name][activeTab];
      })
    );
  }

  private openActivityLink(activity: PendingActivityData) {
    if (activity.isVertice30Link && activity.activityId) {
      if (activity.productType === 'Ancillary') {
        this.zipPipeFirstClaimNumberAndCustomerId().subscribe(
          ([claimNumber, customerId]) => {
            customerId = hexDecode(customerId);
            claimNumber = hexDecode(claimNumber);

            this.router.navigate([
              generate3_0ABMReferralAuthorizationTabUrl(
                customerId,
                claimNumber,
                activity.activityId,
                activity.serviceCode,
                activity.isLegacy
              )
            ]);
          }
        );
      } else if (activity.type === 'POS (ePAQ)') {
        this.zipPipeFirstClaimNumberAndCustomerId().subscribe(
          ([claimNumber, customerId]) => {
            customerId = hexDecode(customerId);
            claimNumber = hexDecode(claimNumber);

            // All claim view links are currently planned to open as external
            // links as in there is no view filtering the lines displayed for that authorization
            this.router.navigate([
              generateExternal3_0PBMAuthorizationTabUrl(
                customerId,
                claimNumber,
                activity.activityId,
                'pos'
              )
            ]);
          }
        );
      }
    } else {
      openCenteredNewWindowDefaultSize(activity.action);
    }
  }

  zipPipeFirstClaimNumberAndCustomerId(): Observable<[string, string]> {
    return zip(this.claimNumber$, this.customerId$).pipe(first());
  }
}
