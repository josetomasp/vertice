import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TimeOption } from '@shared';

import { compareLocations } from '../../../../../../make-a-referral/make-a-referral-shared';

import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedWheelchairFormData
} from '../../../../referral-authorization.models';

export const wheelchairTypes: string[] = [
  'Requires Wheelchair',
  'Has Manual Wheelchair',
  'Has Power Wheelchair',
  'Unknown'
];

@Component({
  selector: 'healthe-transportation-authorization-detailed-wheelchair',
  templateUrl:
    './transportation-authorization-detailed-wheelchair.component.html',
  styleUrls: [
    './transportation-authorization-detailed-wheelchair.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportationAuthorizationDetailedWheelchairComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;
  @Input()
  idIndex;
  @Input() timeDropdownValues: TimeOption[];

  compareLocations = compareLocations;

  formGroup: FormGroup;

  authData: TransportationAuthorizationDetailedWheelchairFormData;

  wheelchairTypes = wheelchairTypes;

  constructor() {}

  ngOnInit() {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedWheelchairFormData;
    this.formGroup = this.referralAuthorizationItem.formGroup;

    this.formGroup.addControl(
      'wheelchairType',
      new FormControl(this.authData.wheelchairType, [Validators.required])
    );
    this.formGroup.addControl('steps', new FormControl(this.authData.steps));
  }
}
