import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizedLocationsModalData } from '../../../store/models/referral-id.models';

@Component({
  selector: 'healthe-transportation-referral-locations-modal',
  templateUrl: './transportation-referral-locations-modal.component.html',
  styleUrls: ['./transportation-referral-locations-modal.component.scss']
})
export class TransportationReferralLocationsModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public authorizedLocationsModalData: AuthorizedLocationsModalData
  ) {}

  ngOnInit() {}
}
