import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Range } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { dateComparator, pageSizeOptions } from '@shared';
import { HealtheDataSource } from '@shared/models/healthe-data-source';
import * as _moment from 'moment';
import { combineLatest, from } from 'rxjs';
import {
  distinctUntilChanged,
  mergeMap,
  takeWhile,
  tap,
  toArray
} from 'rxjs/operators';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';
import { environment } from '../../../../../../../../environments/environment';
import { PreferenceType } from '../../../../../../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../../../../../../preferences/store/selectors/user-preferences.selectors';
import { RootState } from '../../../../../../../store/models/root.models';
import { referralActivityFilter } from '../../referralActivityFilter';
import {
  CardState,
  FooterColor,
  ReferralStage,
  ReferralStageUtil
} from '../../../../store/models';
import { OpenReferralDetailModal } from '../../../../store/actions/referral-activity.actions';
import {
  getActivityTableFilters,
  getCurrentActivityCards,
  getSelectedServiceType
} from '../../../../store/selectors/referral-activity.selectors';
import { pluckPrefValue } from '@shared/lib/store/pluckPrefValue';

const moment = _moment;

@Component({
  selector: 'healthe-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent
  implements OnInit, AfterContentInit, OnDestroy {
  isAlive = true;
  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  pageSizeOptions = pageSizeOptions;
  pageSize$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue,
    takeWhile(() => this.isAlive)
  );

  ReferralStageUtil = ReferralStageUtil;
  displayedColumns = [
    'date',
    'stage',
    'actionDetail',
    'notes',
    'status',
    'action'
  ];
  tableCondition = TableCondition;
  currentActivityCards$ = this.store$.pipe(select(getCurrentActivityCards));
  selectedServiceType$ = this.store$.pipe(select(getSelectedServiceType));
  filters$ = this.store$.pipe(select(getActivityTableFilters));

  fullyFilteredCards$ = combineLatest([
    this.currentActivityCards$,
    this.selectedServiceType$
  ]).pipe(referralActivityFilter);

  tableData$ = this.fullyFilteredCards$.pipe(
    /**
     * Translation from cards to table
     */
    mergeMap((cards: CardState<any>[]) =>
      from(cards).pipe(
        tap(
          (cardState) =>
            (cardState.tableRow.hasAddNoteButton =
              cardState.footer &&
              cardState.footer.color === FooterColor.SUCCESS &&
              cardState.stage === ReferralStage.VENDOR_ASSIGNMENT)
        ),
        toArray()
      )
    )
  );

  dataSource = new HealtheDataSource(this.tableData$, this.filters$, [
    { name: 'date', comparator: dateComparator }
  ]);

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public verbiageService: VerbiageService
  ) {}

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.dataSource.primaryPaginator = this.primaryPaginator;
    this.dataSource.secondaryPaginator = this.secondaryPaginator;
    this.dataSource.setCustomFilter('date', this.dateRangeFilter);
    this.dataSource.sort = this.matSort;

    // Reset our pager to page 1 whenever they change the service type.
    this.selectedServiceType$
      .pipe(
        takeWhile(() => this.isAlive),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.primaryPaginator.pageIndex = 0;
      });
  }

  openSendANote(dateOfService: string) {
    this.store$.dispatch(
      new OpenReferralDetailModal({
        stage: ReferralStage.VENDOR_ASSIGNMENT,
        modalData: { dateOfService }
      })
    );
  }

  openDialog({ stage, modalData }: CardState<any>) {
    if (modalData) {
      this.store$.dispatch(new OpenReferralDetailModal({ stage, modalData }));
    }
  }

  getVerbiage(verbiage: TableCondition) {
    return this.verbiageService.getTableVerbiage(verbiage);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  private dateRangeFilter(date: string, range: Range): boolean {
    if (range === null) {
      return true;
    }
    const { fromDate, toDate } = range;
    const mFromDate = moment(fromDate, environment.dateFormat);
    const mToDate = moment(toDate, environment.dateFormat);
    return moment(date, environment.dateFormat).isBetween(mFromDate, mToDate);
  }
}
