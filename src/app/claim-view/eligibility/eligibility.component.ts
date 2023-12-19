import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ClaimViewState } from '../store/models/claim-view.models';
import {
  getAbmDates,
  getClaimDates,
  getClaimInfo,
  getIdInfo,
  getPbmDates
} from '../store/selectors/eligibility-tab.selectors';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss']
})
export class EligibilityComponent implements OnInit {
  componentGroupName = 'eligibility';
  idInfo$ = this.store$.pipe(select(getIdInfo));
  claimInfo$ = this.store$.pipe(select(getClaimInfo));
  claimDates$ = this.store$.pipe(select(getClaimDates));
  claimAbmDates$ = this.store$.pipe(select(getAbmDates));
  claimPbmDates$ = this.store$.pipe(select(getPbmDates));
  decodedClaimNumber$ = this.store$.pipe(
    select(getDecodedClaimNumber),
    first()
  );
  decodedCustomerId$ = this.store$.pipe(
    select(getDecodedCustomerId),
    first()
  );

  constructor(
    public store$: Store<ClaimViewState>,
    private pageTitleService: PageTitleService
  ) {
    this.pageTitleService.setTitleWithClaimNumber('Claim View', 'Eligibility');
  }

  ngOnInit() {}
}
