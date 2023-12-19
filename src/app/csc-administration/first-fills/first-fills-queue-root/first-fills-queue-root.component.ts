import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { FirstFillsQueueService } from '../first-fills-queue.service';
import { alphaNumericComparator, dateComparator } from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import { Router } from '@angular/router';
import { MatSortable } from '@angular/material/sort';

export interface FirstFillsQueueResultRow {
  // non-Completed tabs fields
  firstFillTempId: string;
  dateOfInjury: string;
  dateModified: string;
  notes: string;

  // Completed tab only fields
  dateMatched: string;
  tempMemberId: string;
  claimNumberMatched: string;

  // Shared fields
  customer: string;
  modifiedBy: string;

  // ¿Used for when clicking a table link?
  possibleMatchingClaimCount: number;
  // Used for filtering which tab a result is included in
  tab: string;
}

@Component({
  selector: 'healthe-first-fills-queue-root',
  templateUrl: './first-fills-queue-root.component.html',
  styleUrls: ['./first-fills-queue-root.component.scss']
})
export class FirstFillsQueueRootComponent extends DestroyableComponent {
  tempMemberIdClicked: Subject<any> = new Subject();
  resultsData: FirstFillsQueueResultRow[] = [];
  serverErrors: string[] = [];
  isResultLoading: boolean = true;
  faSyncAlt = faSyncAlt;
  tabNames = [
    'New Line Items',
    'First Check',
    'Second Check',
    'Final Check',
    'Exhausted Efforts',
    'Completed'
  ];
  resultsColumnsConfig = [
    {
      label: 'FIRST FILL TEMP ID',
      name: 'firstFillTempId',
      comparator: alphaNumericComparator,
      linkProp: 'firstFillTempIdUrl',
      styles: { width: '200px' }
    },
    {
      label: 'CUSTOMER',
      name: 'customer',
      comparator: alphaNumericComparator,
      styles: { width: '120px' }
    },
    {
      label: 'DATE OF INJURY',
      name: 'dateOfInjury',
      comparator: dateComparator,
      styles: { width: '120px' }
    },
    {
      label: 'DATE MODIFIED',
      name: 'dateModified',
      comparator: dateComparator,
      styles: { width: '120px' }
    },
    {
      label: 'MODIFIED BY',
      name: 'modifiedBy',
      styles: { width: '120px' },
      comparator: alphaNumericComparator
    },
    {
      label: 'NOTES',
      name: 'notes',
      comparator: alphaNumericComparator
    },
    {
      label: 'DATE MATCHED',
      name: 'dateMatched',
      comparator: dateComparator,
      styles: { width: '120px' }
    },
    {
      label: 'TEMP MEMBER ID',
      name: 'tempMemberId',
      comparator: alphaNumericComparator,
      styles: { width: '200px' }
    },
    {
      label: 'CLAIM NUMBER MATCHED',
      name: 'claimNumberMatched',
      comparator: alphaNumericComparator,
      styles: { width: '200px' }
    }
  ];
  currentTabName = this.tabNames[0];
  resultsDefaultSort: MatSortable = {} as MatSortable;

  constructor(
    protected firstFillsQueueService: FirstFillsQueueService,
    private pageTitleService: PageTitleService,
    private router: Router
  ) {
    super();
    this.refreshQueue();
    this.pageTitleService.setTitle('CSC Administration', 'First Fills Queue');
  }

  changeTab($event: MatTabChangeEvent) {
    this.currentTabName = $event.tab.textLabel;
  }

  refreshQueue() {
    this.isResultLoading = true;

    this.firstFillsQueueService
      .getFirstFillsQueueData()
      .pipe(first())
      .subscribe((firstFillsQueueResults) => {
        this.resultsData = firstFillsQueueResults.responseBody;
        this.isResultLoading = false;
        this.serverErrors = firstFillsQueueResults.errors;
      });
  }

  getFilteredData() {
    return this.resultsData
      .filter((result) => result.tab === this.currentTabName)
      .map((row) => ({
        ...row,
        firstFillTempIdUrl: `csc-administration/assign-first-fill-to-claim/${row.firstFillTempId}`
      }));
  }

  getDisplayedColumnNames() {
    if (this.currentTabName === 'Completed') {
      return [
        'dateModified',
        'customer',
        'tempMemberId',
        'claimNumberMatched',
        'modifiedBy'
      ];
    } else {
      return [
        'firstFillTempId',
        'customer',
        'dateOfInjury',
        'dateModified',
        'modifiedBy',
        'notes'
      ];
    }
  }
}
