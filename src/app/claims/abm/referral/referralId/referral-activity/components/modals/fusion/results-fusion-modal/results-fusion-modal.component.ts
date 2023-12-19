import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../../../../store/selectors/router.selectors';
import { ResultsFusionModel } from './results-fusion-model';
import {
  ReferralInformationRequest,
  ReferralInformationServiceRequest
} from '../../../../../../store/models';
import { referralInformationRequest } from '../../../../../../store/actions/referral-activity.actions';
import { Vertice25Service } from '@shared/service/vertice25.service';

@Component({
  selector: 'healthe-results-modal',
  templateUrl: './results-fusion-modal.component.html',
  styleUrls: ['./results-fusion-modal.component.scss']
})
export class ResultsFusionModalComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public modalData: ResultsFusionModel,
    public dialogRef: MatDialogRef<ResultsFusionModalComponent>,
    public store$: Store<RootState>,
    public vertice25Service: Vertice25Service
  ) {
    this.requestForInformationMenuOptions.push({
      label: 'Bill',
      request: this.modalData.referralInformationRequestBilling
    });
    this.requestForInformationMenuOptions.push({
      label: 'Documentation',
      request: this.modalData.referralInformationRequestDocumentation
    });
  }

  ngOnInit() {}

  createIncidentReport() {
    this.vertice25Service.createIncidentReport();
  }

  closeModal() {
    this.dialogRef.close();
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
