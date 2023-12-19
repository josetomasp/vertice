import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { select, Store } from '@ngrx/store';
import { fromEvent, NEVER, Observable } from 'rxjs';
import { catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../../store/selectors/router.selectors';
import { ReferralActivityService } from '../../referral-activity.service';
import { ReferralInformationRequest } from '../../../../store/models';
import { ClaimsService } from '../../../../../../claims.service';

@Component({
  selector: 'healthe-referral-information-request-button',
  templateUrl: './referral-information-request-button.component.html',
  styleUrls: ['./referral-information-request-button.component.scss']
})
export class ReferralInformationRequestButtonComponent implements OnInit {
  @ViewChild('requestButton', { static: true })
  requestButton: MatButton;

  @Input()
  referralInformationRequest: ReferralInformationRequest;

  @Input()
  buttonText: string;

  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  requestInformationButtonDisabled = false;

  snackBarTranslator = {
    DOCUMENT: 'Documentation',
    BILLING: 'Billing'
  };

  constructor(
    public store$: Store<RootState>,
    public referralActivityService: ReferralActivityService,
    public claimsService: ClaimsService
  ) {}

  ngOnInit() {
    fromEvent(this.requestButton._elementRef.nativeElement, 'click')
      .pipe(
        withLatestFrom(this.encodedReferralId$, this.encodedCustomerId$),
        mergeMap(([event, encodedReferralId, encodedCustomerId]) => {
          this.requestInformationButtonDisabled = true;
          return this.referralActivityService
            .requestForInformation(
              encodedReferralId,
              this.referralInformationRequest.vendorCode,
              this.referralInformationRequest.requestType,
              this.referralInformationRequest.dateOfService,
              encodedCustomerId
            )
            .pipe(
              catchError((error) => {
                this.requestInformationButtonDisabled = false;
                this.claimsService.showSnackBar(
                  this.referralInformationRequest.requestType +
                    ' request failed',
                  false
                );
                return NEVER;
              })
            );
        })
      )
      .subscribe((success) => {
        this.requestInformationButtonDisabled = false;
        this.claimsService.showSnackBar(
          this.snackBarTranslator[this.referralInformationRequest.requestType] +
            ' was requested successfully',
          true
        );
      });
  }
}
