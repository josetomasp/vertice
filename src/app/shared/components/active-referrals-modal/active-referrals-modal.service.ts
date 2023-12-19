import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActiveReferralsModalComponent } from './active-referrals-modal.component';

/**
 * TODO: move this to MAR module
 */
@Injectable({
  providedIn: 'root'
})
export class ActiveReferralsModalService {
  constructor(private dialog: MatDialog, public http: HttpClient) {}

  showModal(
    activeReferrals,
    encodedCustomerId,
    encodedClaimNumber,
    serviceType
  ) {
    this.displayModal(
      activeReferrals,
      encodedCustomerId,
      encodedClaimNumber,
      serviceType
    );
    return;
  }

  private displayModal(
    ActiveReferralParam,
    customerId,
    claimNumber,
    serviceType
  ) {
    this.dialog.open(ActiveReferralsModalComponent, {
      data: {
        activeReferrals: ActiveReferralParam,
        customerId: customerId,
        claimNumber: claimNumber,
        serviceType: serviceType
      },
      autoFocus: false,
      width: '1200px'
    });
  }
}
