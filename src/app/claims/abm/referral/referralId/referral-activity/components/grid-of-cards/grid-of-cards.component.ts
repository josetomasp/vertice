import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatAll, filter, first, toArray } from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  getCurrentActivityCards,
  getSelectedServiceType
} from '../../../../store/selectors/referral-activity.selectors';
import { referralActivityFilter } from '../../referralActivityFilter';
import { CardState, GridLane, ReferralStage } from '../../../../store/models';
import {
  getAuthorizationArchetype
} from '../../../../../../../store/selectors/router.selectors';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization/referral-authorization.models';

@Component({
  selector: 'healthe-grid-of-cards',
  templateUrl: './grid-of-cards.component.html',
  styleUrls: ['./grid-of-cards.component.scss']
})
export class GridOfCardsComponent implements OnInit {
  lanes: GridLane[] = [
    {
      header: 'Vendor Assignment',
      lane: ReferralStage.VENDOR_ASSIGNMENT
    },
    {
      header: 'SCHEDULING STATUS',
      lane: ReferralStage.SCHEDULE_SERVICE,
      clickable: true
    },
    {
      header: 'SERVICE SCHEDULED',
      lane: ReferralStage.SERVICE_SCHEDULED,
      clickable: true
    },
    {
      header: 'RESULTS',
      lane: ReferralStage.RESULTS,
      clickable: true
    },
    {
      header: 'BILLING',
      lane: ReferralStage.BILLING,
      clickable: true
    }
  ];
  currentActivityCards$: Observable<CardState<any>[]> = this.store$.pipe(
    select(getCurrentActivityCards)
  );
  selectedServiceType$ = this.store$.pipe(select(getSelectedServiceType));
  authorizationArchType$: Observable<ReferralAuthorizationArchetype> =
    this.store$.pipe(select(getAuthorizationArchetype));

  filteredCards$: Observable<CardState<any>[]> = combineLatest(
    this.currentActivityCards$,
    this.selectedServiceType$
  ).pipe(referralActivityFilter);

  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;
  ReferralStage = ReferralStage;

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {}

  getCards$(stage: ReferralStage): Observable<CardState<any>[]> {
    return this.filteredCards$.pipe(
      first(),
      concatAll(),
      filter((cardState) => cardState.stage === stage),
      toArray()
    );
  }

  trackByFn(item) {
    return item.title;
  }
}
