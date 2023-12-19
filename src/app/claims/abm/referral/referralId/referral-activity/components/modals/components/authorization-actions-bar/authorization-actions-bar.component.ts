import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralInformationServiceRequest,
  ReferralStage
} from 'src/app/claims/abm/referral/store/models/referral-activity.models';
import { ReferralInformationRequest } from '../../../../../../store/models';
import { Vertice25Service } from '@shared/service/vertice25.service';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { referralInformationRequest } from '../../../../../../store/actions/referral-activity.actions';
import { select, Store } from '@ngrx/store';
import {
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../../../../store/selectors/router.selectors';
import { RootState } from '../../../../../../../../../store/models/root.models';

@Component({
  selector: 'healthe-authorization-actions-bar',
  templateUrl: './authorization-actions-bar.component.html',
  styleUrls: ['./authorization-actions-bar.component.scss']
})
export class AuthorizationActionsBarComponent implements OnInit {
  ReferralStage = ReferralStage;
  @Input() stage: string;
  @Input() dateOfService: string;
  @Input() vendorCode: string;

  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  requestForInformationMenuOptions: {
    label: String;
    request: ReferralInformationRequest;
  }[] = [];
  requestForInformationMenuOpened: boolean = false;

  constructor(
    public store$: Store<RootState>,
    public vertice25Service: Vertice25Service
  ) {}

  ngOnInit() {
    this.requestForInformationMenuOptions.push({
      label: 'Bill',
      request: {
        dateOfService: this.dateOfService,
        requestType: 'BILLING',
        vendorCode: this.vendorCode
      }
    });
    this.requestForInformationMenuOptions.push({
      label: 'Documentation',
      request: {
        dateOfService: this.dateOfService,
        requestType: 'DOCUMENT',
        vendorCode: this.vendorCode
      }
    });
  }

  goToViewIncidentReports() {
    this.vertice25Service.viewIncidentReports();
  }

  goToCreateIncidentReport() {
    this.vertice25Service.createIncidentReport();
  }

  doInformationRequest(request: ReferralInformationRequest) {
    combineLatest([this.encodedCustomerId$, this.encodedReferralId$])
      .pipe(
        map(([encodedCustomerId, encodedReferralId]) => {
          const serviceRequest: ReferralInformationServiceRequest = request as ReferralInformationServiceRequest;
          serviceRequest.encodedReferralID = encodedReferralId;
          serviceRequest.encoodedCustomerID = encodedCustomerId;

          return serviceRequest;
        }),
        first()
      )
      .subscribe((serviceRequest) => {
        this.store$.dispatch(referralInformationRequest({ serviceRequest }));
      });
  }
}
