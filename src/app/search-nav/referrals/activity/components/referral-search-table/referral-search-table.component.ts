import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { alphaNumericComparator, dateComparator } from '@shared';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { Observable } from 'rxjs';
import { NavSearchTableConfig } from '../../../../search-nav-table.config';
import { NavReferral } from '../../../../store/models/nav-referral.model';

interface ColumnDef {
  label: string;
  name: string;
  comparator?: (a: any, b: any, ascending: boolean) => number;
  sortByRow?: boolean;
}

@Component({
  selector: 'healthe-referral-search-table',
  templateUrl: './referral-search-table.component.html',
  styleUrls: ['./referral-search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralSearchTableComponent implements OnInit, OnChanges {
  //#region   Public Properties
  @Input()
  results: NavReferral[] = [];
  @Input() isLoading$: Observable<boolean>;
  @Input() searchTableConfig: NavSearchTableConfig;

  @ViewChild('matSort', { static: true }) matSort: MatSort;
  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;

  clickForResult: boolean;
  columns: ColumnDef[] = [
    {
      label: 'REFERRAL ID',
      name: 'referralId',
      comparator: alphaNumericComparator
    },
    {
      label: 'CLAIM #',
      name: 'claimNumber',
      comparator: alphaNumericComparator
    },
    {
      label: 'CLAIMANT NAME',
      name: 'claimantName',
      comparator: alphaNumericComparator
    },
    {
      label: 'DATE RECEIVED',
      name: 'dateReceived',
      comparator: dateComparator
    },
    {
      label: 'REQUESTOR ROLE/NAME',
      name: 'requestorRoleName',
      comparator: alphaNumericComparator
    },
    {
      label: 'STATUS',
      name: 'status',
      comparator: alphaNumericComparator
    },
    {
      label: 'SERVICE TYPE',
      name: 'serviceType',
      comparator: alphaNumericComparator
    },
    {
      label: 'VENDOR',
      name: 'vendor',
      comparator: alphaNumericComparator
    }
  ];
  defaultColumns = [
    'referralId',
    'claimNumber',
    'claimantName',
    'dateReceived',
    'requestorRoleName',
    'status',
    'serviceType',
    'vendor'
  ];
  tableDataSource: HealtheDataSource<NavReferral> = new HealtheDataSource(
    this.results,
    null,
    this.columns as HealtheSortableColumn[]
  );

  //#endregion
  constructor() {}

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.tableDataSource.sort = this.matSort;
    this.tableDataSource.primaryPaginator = this.primaryPaginator;
    this.tableDataSource.secondaryPaginator = this.secondaryPaginator;
    this.matSort.sort({
      start: 'desc',
      id: 'dateReceived',
      disableClear: false
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.results) {
      this.clickForResult = changes.results.firstChange;
      this.tableDataSource.data = changes.results.currentValue;
    }
  }

  trackByMethod(index: number, el: any): number {
    return el.id;
  }

  //#endregion
}
