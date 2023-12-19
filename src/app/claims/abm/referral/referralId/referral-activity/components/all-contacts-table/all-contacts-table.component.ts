import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { alphaNumericComparator } from '@shared';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { dateTimeComparator } from '@shared/lib/comparators/dateTimeComparator';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { map, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  getAllContactAttempts,
  isReferralActivityLoading
} from '../../../../store/selectors/referral-activity.selectors';

@Component({
  selector: 'healthe-all-contacts-table',
  templateUrl: './all-contacts-table.component.html',
  styleUrls: ['./all-contacts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllContactsTableComponent extends DestroyableComponent
  implements OnInit {
  @ViewChild(MatSort, { static: true })
  matSort: MatSort;
  @ViewChild(MatPaginator, { static: true })
  matPaginator: MatPaginator;
  tableColumnDefinitions: HealtheSortableColumn[] = [
    {
      name: 'vendor',
      comparator: alphaNumericComparator
    },
    {
      name: 'contactType',
      comparator: alphaNumericComparator
    },
    {
      name: 'isContactSuccessful',
      comparator: alphaNumericComparator
    },
    {
      name: 'notes',
      comparator: alphaNumericComparator
    },
    {
      name: 'dateTime',
      comparator: dateTimeComparator
    }
  ];

  tableColumns = this.tableColumnDefinitions.map((col) => col.name);

  isLoading$ = this.store$.pipe(
    select(isReferralActivityLoading),
    takeUntil(this.onDestroy$)
  );

  allContactAttempts$ = this.store$.pipe(
    select(getAllContactAttempts),
    map((data) => {
      const healtheDataSource = new HealtheDataSource(
        data,
        null,
        this.tableColumnDefinitions
      );
      healtheDataSource.sort = this.matSort;
      healtheDataSource.primaryPaginator = this.matPaginator;
      return healtheDataSource;
    }),
    takeUntil(this.onDestroy$)
  );

  ngOnInit() {
    this.matSort.sort({ id: 'dateTime', start: 'asc', disableClear: false });
  }

  constructor(public store$: Store<RootState>) {
    super();
  }
}
