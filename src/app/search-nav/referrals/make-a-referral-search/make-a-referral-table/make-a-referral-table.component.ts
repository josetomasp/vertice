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
import { ClaimResult } from '../../../../claims/abm/referral/store/models/claimResult.model';
import { SearchTableConfig } from '../make-a-referral-search.component';

interface ColumnDef {
  label: string;
  name: string;
  comparator?: (a: any, b: any, ascending: boolean) => number;
  sortByRow?: boolean;
}

@Component({
  selector: 'healthe-make-a-referral-table',
  templateUrl: './make-a-referral-table.component.html',
  styleUrls: ['./make-a-referral-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeAReferralTableComponent implements OnInit, OnChanges {
  //#region   Public Properties
  @Input()
  claimResults: ClaimResult[] = [];
  @Input() isLoading$: Observable<boolean>;
  @Input() searchTableConfig: SearchTableConfig;

  @ViewChild('matSort', { static: true }) matSort: MatSort;
  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;

  columns: ColumnDef[] = [
    {
      label: 'MAKE A REFERRAL',
      name: 'makeAReferral'
    },
    {
      label: 'CLAIM NUMBER',
      name: 'claimNumber',
      comparator: alphaNumericComparator
    },
    {
      label: 'CLAIMANT NAME',
      name: 'claimantName',
      comparator: alphaNumericComparator
    },
    {
      label: 'SSN',
      name: 'ssn',
      comparator: alphaNumericComparator
    },
    {
      label: 'DATE OF BIRTH',
      name: 'dateOfBirth',
      comparator: dateComparator
    },
    {
      label: 'DATE OF INJURY',
      name: 'dateOfInjury',
      comparator: dateComparator
    },
    {
      label: 'EMPLOYER',
      name: 'employer',
      comparator: alphaNumericComparator
    },
    {
      label: 'ADDRESS',
      name: 'address',
      comparator: alphaNumericComparator
    },
    {
      label: 'STATE OF VENUE',
      name: 'stateOfVenue',
      comparator: alphaNumericComparator
    }
  ];
  defaultColumns = [
    'makeAReferral',
    'claimNumber',
    'claimantName',
    'ssn',
    'dateOfBirth',
    'dateOfInjury',
    'employer',
    'address',
    'stateOfVenue'
  ];
  tableDataSource: HealtheDataSource<ClaimResult> = new HealtheDataSource(
    this.claimResults,
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
      id: 'dateOfInjury',
      disableClear: false
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.claimResults) {
      this.tableDataSource.data = [...changes.claimResults.currentValue];
    }
  }

  trackByMethod(index: number, el: any): number {
    return el.id;
  }
  //#endregion
}
