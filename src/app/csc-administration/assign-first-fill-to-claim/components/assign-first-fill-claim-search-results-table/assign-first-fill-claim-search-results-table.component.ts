import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { FirstFillClaimSearchResult } from '../../store/assign-first-fill-to-claim.reducer';
import { SelectionModel } from '@angular/cdk/collections';
import { HealtheDataSource } from '@shared/models/healthe-data-source';
import { dateComparator, hexEncode } from '@shared';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'healthe-assign-first-fill-claim-search-results-table',
  templateUrl: './assign-first-fill-claim-search-results-table.component.html',
  styleUrls: ['./assign-first-fill-claim-search-results-table.component.scss']
})
export class AssignFirstFillClaimSearchResultsTableComponent implements OnInit {
  @Input()
  isLoadingClaimSearchResults$: Observable<boolean>;
  @Input()
  firstFillClaimSearchResults$: Observable<FirstFillClaimSearchResult[]>;
  @Output()
  claimSelected$: EventEmitter<FirstFillClaimSearchResult> = new EventEmitter<
    FirstFillClaimSearchResult
  >();

  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild('topPaginator', { static: true })
  topPaginator: MatPaginator;
  @ViewChild('bottomPaginator', { static: true })
  bottomPaginator: MatPaginator;

  dataSource: HealtheDataSource<FirstFillClaimSearchResult>;
  tableData$: Observable<FirstFillClaimSearchResult[]>;

  tableColumns = [
    'selectedClaim',
    'memberId',
    'claimNumber',
    'claimant',
    'ssn',
    'dateOfInjury',
    'customer',
    'stateOfVenue'
  ];

  selectedClaim = new SelectionModel<FirstFillClaimSearchResult>(false, null);

  constructor(private router: Router) {}

  ngOnInit() {
    this.dataSource = new HealtheDataSource(
      this.firstFillClaimSearchResults$,
      null,
      [{ name: 'dateOfInjury', comparator: dateComparator }]
    );
    this.dataSource.sort = this.matSort;
    this.dataSource.primaryPaginator = this.topPaginator;
    this.dataSource.secondaryPaginator = this.bottomPaginator;
  }

  selectClaim(row: FirstFillClaimSearchResult): void {
    this.claimSelected$.next(row);
  }

  goToClaimView(row: FirstFillClaimSearchResult) {
    this.router
      .navigate([
        'claimview',
        hexEncode(row.customer),
        hexEncode(row.claimNumber)
      ])
      .then();
  }
}
