import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
import {
  CreateNewAuthorizationService
} from '../create-new-authorization.service';
import { faCarAlt } from '@fortawesome/pro-light-svg-icons';

import {
  CreateNewAuthorizationAbstractBaseComponent
} from '../create-new-authorization-abstract-base.component';
import {
  CreateNewAuthorizationModalComponentData
} from '../create-new-authorization-modal/create-new-authorization-modal.component';

@Component({
  selector: 'healthe-create-new-authorization-sedan',
  templateUrl: './create-new-authorization-sedan.component.html',
  styleUrls: ['./create-new-authorization-sedan.component.scss']
})
export class CreateNewAuthorizationSedanComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;

  faCarAlt = faCarAlt;

  constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService
  ) {
    super(createNewAuthorizationServiceService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected buildFormGroup() {}

  protected saveFormData() {}
}
