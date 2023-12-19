import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';
import { hexDecode } from '@shared';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../store/models/root.models';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import { Observable } from 'rxjs';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import {
  getAbmClaimStatus,
  getPbmClaimStatus
} from '@shared/store/selectors/claim.selectors';

import { isEmpty } from 'lodash';
import { ClaimViewSearchRequest } from '@shared/store/actions/claim-view.actions';
import { getClaimViewSearchResults } from '@shared/store/selectors/claim-view-selectors';
import { PageTitleService } from '@shared/service/page-title.service';
import { MemberIDInfo } from '../authorization-status-queue/create-new-auth-modal/create-new-auth-modal.component';
import { CreateNewPosAuthComponentViewContext } from './components/create-new-pos-auth/create-new-pos-auth.component';

export interface CscCreatePosAuthRouteParams {
  customerId: string;
  claimNumber: string;
  memberId: string;
}

@Component({
  selector: 'healthe-create-pos-authorization',
  templateUrl: './create-pos-authorization.component.html',
  styleUrls: ['./create-pos-authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePosAuthorizationComponent implements OnInit {
  viewContext = {
    AuthInformationContext: {} as CreateNewPosAuthComponentViewContext
  };
  encodedRouteParams: CscCreatePosAuthRouteParams;
  decodedRouteParams: CscCreatePosAuthRouteParams;
  claimViewLink = [];
  pbmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getPbmClaimStatus)
  );
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  claimSearchResults$ = this.store$.pipe(select(getClaimViewSearchResults));
  riskLevelNumber$ = this.claimSearchResults$.pipe(
    filter((results) => !isEmpty(results)),
    map((results) => {
      return results[0].riskLevelNumber;
    })
  );
  riskLevel$ = this.claimSearchResults$.pipe(
    filter((results) => !isEmpty(results)),
    map((results) => {
      return results[0].riskLevel;
    })
  );

  disableDeactivateGuard = false;

  constructor(
    private route: ActivatedRoute,
    public store$: Store<RootState>,
    private pageTitleService: PageTitleService
  ) {
    this.pageTitleService.setTitle(
      'CSC Administration',
      'Create POS Authorization'
    );

    this.route.params.pipe(first()).subscribe((params) => {
      this.encodedRouteParams = params as CscCreatePosAuthRouteParams;

      this.decodedRouteParams = {
        customerId: hexDecode(this.encodedRouteParams.customerId),
        claimNumber: hexDecode(this.encodedRouteParams.claimNumber),
        memberId: hexDecode(this.encodedRouteParams.memberId)
      };
    });
  }

  // Because someone can redo the member search, all this information can change.
  reloadData() {
    this.claimViewLink.push(
      '/claimview/' +
        this.encodedRouteParams.customerId +
        '/' +
        this.encodedRouteParams.claimNumber +
        '/activity/all'
    );

    this.store$.dispatch(
      new RequestClaimV2({
        claimNumber: this.encodedRouteParams.claimNumber,
        customerId: this.encodedRouteParams.customerId
      })
    );

    this.store$.dispatch(
      new ClaimViewSearchRequest({
        claimNumber: this.decodedRouteParams.claimNumber,
        claimantLastName: '',
        claimantFirstName: '',
        assignedAdjuster: 'All',
        dateOfInjury: null,
        riskLevel: 'All',
        riskCategory: 'All',
        stateOfVenue: 'All'
      })
    );
  }

  ngOnInit() {
    this.reloadData();
  }

  memberSearchChange(data: MemberIDInfo) {
    if (data) {
      // If we are changing our route, then the route guard modal will popup asking to confirm the change
      // So we will temporarily disable the guard check.
      this.disableDeactivateGuard = true;

      this.encodedRouteParams = {
        customerId: data.encodedCustomerID,
        claimNumber: data.encodedClaimNumber,
        memberId: data.encodedMemberID
      };

      this.decodedRouteParams = {
        customerId: data.customerID,
        claimNumber: data.claimNumber,
        memberId: data.memberID
      };

      this.reloadData();
      setTimeout(() => {
        this.disableDeactivateGuard = false;
      }, 100);
    }
  }

  setCanDeactivate($event: boolean) {
    this.disableDeactivateGuard = $event;
  }
}
