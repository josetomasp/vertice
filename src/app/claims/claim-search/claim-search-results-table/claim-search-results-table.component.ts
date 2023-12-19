import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { numericComparator, pageSizeOptions } from '@shared';
import { pluckPrefValue } from '@shared/lib/store/pluckPrefValue';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { alphaNumericComparator, dateComparator } from 'src/app/shared/lib';
import { environment } from '../../../../environments/environment';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { PreferenceType } from '../../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../../preferences/store/selectors/user-preferences.selectors';
import { RootState } from '../../../store/models/root.models';
import { TableCondition, VerbiageService } from '../../../verbiage.service';

import * as fromClaimSearch from '../../store/selectors/claim-search.selectors';
import { ClaimSearchClaim } from '@shared/store/models';
import { MatMenu } from '@angular/material/menu';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

const moment = _moment;

interface ClaimSearchCardListColumnDef {
  label: string;
  name: string;
  comparator?: (a: any, b: any, ascending: boolean) => number;
  sortByRow?: boolean;
}

@Component({
  selector: 'healthe-result-table',
  templateUrl: './claim-search-results-table.component.html',
  styleUrls: ['./claim-search-results-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimSearchResultTableComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('matSort', { static: true }) matSort: MatSort;
  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;

  @ViewChild('exportMenu')
  exportMenu: MatMenu;

  @Output()
  exportEvent: EventEmitter<string> = new EventEmitter<string>();

  exportMenuIcon = faChevronDown;

  pageSize$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );

  componentGroupName = 'claim-search-filter-box';

  resultsCardListColumns: ClaimSearchCardListColumnDef[] = [
    {
      label: 'CLAIM NUMBER',
      name: 'claimNumber',
      comparator: alphaNumericComparator
    },
    {
      label: 'INJURY DATE',
      name: 'dateOfInjury',
      comparator: dateComparator
    },
    {
      label: 'CLAIMANT NAME',
      name: 'claimantName',
      comparator: alphaNumericComparator
    },
    {
      label: 'ADJUSTER NAME',
      name: 'adjusterName',
      comparator: alphaNumericComparator
    },
    {
      label: 'ADJUSTER EMAIL',
      name: 'adjusterEmail',
      comparator: alphaNumericComparator
    },
    {
      label: 'STATE/ OFFICE ID',
      name: 'stateAndOfficeID',
      comparator: alphaNumericComparator
    },
    {
      label: 'RISK LEVEL',
      name: 'riskLevel',
      comparator: this.riskLevelComparator,
      sortByRow: true
    },
    {
      label: 'MME',
      name: 'claimMME',
      comparator: numericComparator
    },
    {
      label: 'RISK CATEGORY',
      name: 'riskCategory'
    },
    {
      label: 'PREVIOUS ACTIONS',
      name: 'previousActions'
    },
    {
      label: 'INTERVENTIONS',
      name: 'interventions'
    },
    {
      label: 'PHI MEMBER ID',
      name: 'phiMemberId',
      comparator: alphaNumericComparator
    },
    // Action Column
    {
      label: '',
      name: 'action'
    }
  ];
  defaultColumns = [
    'claimNumber',
    'dateOfInjury',
    'claimantName',
    'phiMemberId',
    'adjusterName',
    'adjusterEmail',
    'stateAndOfficeID',
    'riskLevel',
    'riskCategory',
    'claimMME',
    'previousActions',
    'interventions',
    'action'
  ].filter((name) => {
    return !this.featureFlagService.shouldElementBeRemoved(
      'claim-search-results-table',
      name
    );
  });
  claimSearchResultsInput$: Observable<Array<ClaimSearchClaim>> =
    this.store$.pipe(select(fromClaimSearch.getClaimSearchResults));
  filterSummaryIsEmpty$: Observable<boolean> = this.store$.pipe(
    select(fromClaimSearch.getFilterSummary),
    map((summary) => summary === '')
  );
  isLoading$: Observable<boolean> = this.store$.pipe(
    select(fromClaimSearch.getIsLoading)
  );
  // claimSearchResultsFiltered$: Observable<Array<ClaimSearchClaim>>;
  tableCondition = TableCondition;

  pagerSizeOptions: number[] = pageSizeOptions;
  dataSource: HealtheDataSource<ClaimSearchClaim> = new HealtheDataSource(
    this.claimSearchResultsInput$,
    null,
    this.resultsCardListColumns as HealtheSortableColumn[]
  );

  constructor(
    public store$: Store<RootState>,
    public verbiageService: VerbiageService,
    public router: Router,
    public dialog: MatDialog,
    public featureFlagService: FeatureFlagService
  ) {
    super();
  }

  riskLevelComparator(
    item1: ClaimSearchClaim,
    item2: ClaimSearchClaim,
    ascending: boolean
  ): number {
    let returnValue = 0;
    if (
      !_.has(item1, 'riskLevel') ||
      !_.has(item1, 'riskLevelNumber') ||
      !_.has(item1, 'riskIncreased')
    ) {
      return -1;
    }

    if (item1.riskLevelNumber === item2.riskLevelNumber) {
      if (item1.daysSinceRiskLevelChange === item2.daysSinceRiskLevelChange) {
        const item1DateOfInjury = moment(
          item1.dateOfInjury,
          environment.dateFormat
        );
        const item2DateOfInjury = moment(
          item2.dateOfInjury,
          environment.dateFormat
        );

        returnValue = item1DateOfInjury.isAfter(item2DateOfInjury) ? 1 : -1;
      } else {
        returnValue =
          //   item1.daysSinceRiskLevelChange - item2.daysSinceRiskLevelChange;
          item1.daysSinceRiskLevelChange - item2.daysSinceRiskLevelChange > 0
            ? 1
            : -1;
      }
    } else {
      //   returnValue = item1.riskLevelNumber - item2.riskLevelNumber;
      returnValue = item1.riskLevelNumber - item2.riskLevelNumber > 0 ? 1 : -1;
    }
    if (ascending) {
      return returnValue;
    } else {
      return returnValue * -1;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    this.dataSource.primaryPaginator = this.primaryPaginator;
    this.dataSource.secondaryPaginator = this.secondaryPaginator;
    this.exportMenu.closed.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  ngOnInit() {
    // Default Sort
    this.matSort.sort({ start: 'desc', id: 'riskLevel', disableClear: false });
  }

  exportMenuOpen() {
    this.exportMenuIcon = faChevronUp;
  }

  getVerbiage(status: any) {
    return this.verbiageService.getTableVerbiage(status);
  }

  doSearchExport(exportType: string) {
    this.exportEvent.emit(exportType);
  }
}
