import { Component, Input, OnInit } from '@angular/core';
import {
  CreateNewAuthorizationAbstractBaseComponent
} from '../create-new-authorization-abstract-base.component';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
import {
  CreateNewAuthorizationService
} from '../create-new-authorization.service';
import {
  CreateNewAuthorizationModalComponentData
} from '../create-new-authorization-modal/create-new-authorization-modal.component';
import { faWheelchair } from '@fortawesome/pro-light-svg-icons';
import {
  wheelchairTypes
} from '../../transportation-authorization-detailed-wheelchair/transportation-authorization-detailed-wheelchair.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'healthe-create-new-authorization-wheelchair',
  templateUrl: './create-new-authorization-wheelchair.component.html',
  styleUrls: ['./create-new-authorization-wheelchair.component.scss']
})
export class CreateNewAuthorizationWheelchairComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;

  faWheelchair = faWheelchair;
  wheelchairTypes = wheelchairTypes;

  constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService
  ) {
    super(createNewAuthorizationServiceService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected buildFormGroup() {
    this.formGroup.addControl(
      'wheelchairType',
      new FormControl(null, [Validators.required])
    );
    this.formGroup.addControl('steps', new FormControl());
  }

  protected saveFormData() {
    this.referralAuthorizationItem.authData[
      'wheelchairType'
    ] = this.formGroup.controls['wheelchairType'].value;
    this.referralAuthorizationItem.authData['steps'] = this.formGroup.controls[
      'steps'
    ].value;
  }
}
