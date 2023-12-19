import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { TimeOption } from '@shared';
import { Observable } from 'rxjs';
import {
  compareLocations
} from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';
import {
  ReferralManagementTransportationType
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';

import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedOtherFormData
} from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-transportation-authorization-detailed-other',
  templateUrl: './transportation-authorization-detailed-other.component.html',
  styleUrls: ['./transportation-authorization-detailed-other.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportationAuthorizationDetailedOtherComponent
  implements OnInit {
  //#region   Public Properties
  @Input() idIndex: number;
  @Input() referralAuthorizationItem: ReferralAuthorizationItem;
  @Input() timeDropdownValues: TimeOption[];

  @Input()
  transportationTypes$: Observable<ReferralManagementTransportationType[]>;
  compareLocations = compareLocations;

  formGroup: FormGroup;
  //#endregion

  authData: TransportationAuthorizationDetailedOtherFormData;

  constructor() {}

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedOtherFormData;
    this.formGroup = this.referralAuthorizationItem.formGroup;

    this.formGroup.addControl(
      'typeOfTransportation',
      new FormControl(this.authData.typeOfTransportation)
    );
  }

  //#endregion

  get typeOfTransportation(): AbstractControl {
    return this.formGroup.get('typeOfTransportation');
  }
}

//#endregion
