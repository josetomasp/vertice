import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';
import { RootState } from '../../store/models/root.models';

import * as fromClaimsSearch from '../store/selectors/claim-search.selectors';
import { Router } from '@angular/router';
import { PageTitleService } from '@shared/service/page-title.service';
import { ClaimSearchClaim } from '@shared/store/models';

@Component({
  selector: 'healthe-claims-search',
  templateUrl: './claim-search.component.html',
  styleUrls: ['./claim-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimSearchComponent implements OnInit {
  tableCondition = TableCondition;

  public errors$ = this.store$.pipe(
    select(fromClaimsSearch.getClaimSearchErrors)
  );

  filterSummary$: Observable<string> = this.store$.pipe(
    select(fromClaimsSearch.getFilterSummary)
  );

  claimSearchResults$: Observable<Array<ClaimSearchClaim>> = this.store$.pipe(
    select(fromClaimsSearch.getClaimSearchResults)
  );

  constructor(
    public store$: Store<RootState>,
    public verbiageService: VerbiageService,
    public router: Router,
    private pageTitleService: PageTitleService
  ) {
    if (router.url === '/claims/riskQueue') {
      this.pageTitleService.setTitle('Risk Queue');
    } else {
      this.pageTitleService.setTitle('Claim Search');
    }
  }

  getVerbiage(status: any) {
    return this.verbiageService.getTableVerbiage(status);
  }

  ngOnInit(): void {}
}
