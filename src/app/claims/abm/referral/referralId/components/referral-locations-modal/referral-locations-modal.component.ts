import { Component, Inject, OnInit } from '@angular/core';
import { ReferralIdService } from '../../referral-id.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ReferralLocationResponse
} from '../../referral-authorization/referral-authorization.models';

@Component({
  selector: 'healthe-referral-locations-modal',
  templateUrl: './referral-locations-modal.component.html',
  styleUrls: ['./referral-locations-modal.component.scss']
})
export class ReferralLocationsModalComponent implements OnInit {
  public referralId: string;
  public referralLocationData: ReferralLocationResponse = {
    locationHeaders: [],
    locationDetails: []
  };
  public isResultLoading: boolean = true;
  public columnNames: string[] = [
    'summaryLocation',
    'dateApproved',
    'locationStatus',
    'estimatedNumAppts'
  ];
  resultsColumnsConfig = [
    {
      label: 'LOCATION',
      name: 'summaryLocation',
      styles: { width: '150px' }
    },
    {
      label: 'DATE APPROVED OR TERMINATED',
      name: 'dateApproved',
      styles: { width: '150px', 'text-align': 'center' },
      cellStyles: { 'text-align': 'center' }
    },
    {
      label: 'STATUS',
      name: 'locationStatus',
      styles: { width: '150px' }
    },
    {
      label: 'ESTIMATE # OF APPOINTMENTS',
      name: 'estimatedNumAppts',
      styles: { width: '100px', 'text-align': 'center' },
      cellStyles: { 'text-align': 'center' }
    }
  ];
  constructor(
    public referralIdService: ReferralIdService,
    @Inject(MAT_DIALOG_DATA) referralId?: string
  ) {
    this.referralId = referralId;
  }

  ngOnInit() {
    this.getReferralLocationsLanguage(this.referralId);
  }

  getReferralLocationsLanguage(referralId: string) {
    this.referralIdService
      .getReferralLocationsLanguage(referralId)
      .subscribe((data) => {
        data.locationDetails = data.locationDetails.map((x) => {
          return {
            summaryLocation: x.summaryLocation,
            locationStatus: x.locationStatus,
            dateApproved: x.dateApproved,
            estimatedNumAppts:
              x.estimatedNumAppts == null ||
              x.estimatedNumAppts.toString() === '' ||
              x.estimatedNumAppts.toString() === '0'
                ? ''
                : x.estimatedNumAppts.toString(),
            hesReferralDetailId: x.hesReferralDetailId
          };
        });
        this.referralLocationData = data;
        this.isResultLoading = false;
      });
  }
}
