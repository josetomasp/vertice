import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedSedanFormData
} from '../../../../referral-authorization.models';
import { FormGroup } from '@angular/forms';
import { TimeOption } from '@shared';
import {
  compareLocations
} from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';

@Component({
  selector: 'healthe-transportation-authorization-detailed-sedan',
  templateUrl: './transportation-authorization-detailed-sedan.component.html',
  styleUrls: ['./transportation-authorization-detailed-sedan.component.scss']
})
export class TransportationAuthorizationDetailedSedanComponent
  implements OnInit {
  //#region   Public Properties
  @Input() idIndex: number;
  @Input() referralAuthorizationItem: ReferralAuthorizationItem;
  @Input() timeDropdownValues: TimeOption[];

  compareLocations = compareLocations;

  formGroup: FormGroup;
  //#endregion

  authData: TransportationAuthorizationDetailedSedanFormData;

  constructor() {}

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedSedanFormData;

    this.formGroup = this.referralAuthorizationItem.formGroup;
  }

  //#endregion
}
//#endregion
