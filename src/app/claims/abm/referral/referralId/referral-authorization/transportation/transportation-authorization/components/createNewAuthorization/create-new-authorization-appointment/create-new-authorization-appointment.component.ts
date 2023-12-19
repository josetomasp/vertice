import { Component, Input, OnInit } from '@angular/core';
import {
  CreateNewAuthorizationAbstractBaseComponent
} from '../create-new-authorization-abstract-base.component';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
import {
  CreateNewAuthorizationModalComponentData
} from '../create-new-authorization-modal/create-new-authorization-modal.component';
import {
  CreateNewAuthorizationService
} from '../create-new-authorization.service';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import {
  environment
} from '../../../../../../../../../../../environments/environment';

import { takeUntil } from 'rxjs/operators';
import { allOrNothingValidator } from '@shared';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';

const moment = _moment;

@Component({
  selector: 'healthe-create-new-authorization-appointment',
  templateUrl: './create-new-authorization-appointment.component.html',
  styleUrls: ['./create-new-authorization-appointment.component.scss']
})
export class CreateNewAuthorizationAppointmentComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;
  errorBoxClass = ['noError'];

  ERROR_MESSAGES = ERROR_MESSAGES;
  constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService
  ) {
    super(createNewAuthorizationServiceService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected buildFormGroup() {
    this.formGroup.addControl('appointmentDate', new FormControl());
    this.formGroup.addControl('appointmentTime', new FormControl());
    this.formGroup.addControl('appointmentType', new FormControl());
    this.formGroup.setValidators(allOrNothingValidator);
    this.formGroup.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (this.formGroup.valid || !this.allTouched()) {
          this.errorBoxClass = ['noError'];
        } else {
          this.errorBoxClass = ['errorBox'];
        }
      });
  }

  allTouched(): boolean {
    return (
      this.formGroup.get('appointmentDate').touched &&
      this.formGroup.get('appointmentTime').touched &&
      this.formGroup.get('appointmentType').touched
    );
  }

  protected saveFormData() {
    const appointmentDate = moment(
      this.formGroup.controls['appointmentDate'].value
    );
    if (appointmentDate.isValid()) {
      // using .format(environment.dateFormat); sets this date to the UI format, but these values are the ones being
      // sent the ngVertice-Service. Since some of these values were translated for the UI and only stored as an
      // uneditable string, I'm leaving this translation in so that the ngVertice-Service logic will just translate them
      // always instead of just when it was an added service (as opposed to an existing manual authorization)
      this.referralAuthorizationItem.authData[
        'appointmentDate'
      ] = appointmentDate.format(environment.dateFormat);
    } else {
      this.referralAuthorizationItem.authData['appointmentDate'] = null;
    }
    this.referralAuthorizationItem.authData[
      'appointmentTime'
    ] = this.formGroup.controls['appointmentTime'].value;
    this.referralAuthorizationItem.authData[
      'appointmentType'
    ] = this.formGroup.controls['appointmentType'].value;
  }

  clearAppointments() {
    this.formGroup.get('appointmentDate').setValue(null);
    this.formGroup.get('appointmentTime').setValue(null);
    this.formGroup.get('appointmentType').setValue(null);
  }
}
