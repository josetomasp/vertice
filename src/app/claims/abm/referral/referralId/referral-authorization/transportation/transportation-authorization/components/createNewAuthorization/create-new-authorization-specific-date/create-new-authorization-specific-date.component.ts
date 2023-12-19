import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption } from '@shared';
import { map, withLatestFrom } from 'rxjs/operators';
import {
  ClaimLocation
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import {
  getApprovedLocations
} from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';

import {
  compareLocations,
  referralLocationToFullString
} from '../../../../../../../make-a-referral/make-a-referral-shared';
import {
  duplicateFromAndToValidator
} from '../../../../../../../make-a-referral/transportation/TransporationSpecificDateValidators';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
import {
  TransportationAuthorizationFormBuilderService
} from '../../../transportation-authorization-form-builder.service';
import {
  CreateNewAuthorizationAbstractBaseComponent
} from '../create-new-authorization-abstract-base.component';
import {
  CreateNewAuthorizationModalComponentData
} from '../create-new-authorization-modal/create-new-authorization-modal.component';
import {
  CreateNewAuthorizationService
} from '../create-new-authorization.service';

@Component({
  selector: 'healthe-create-new-authorization-specific-date',
  templateUrl: './create-new-authorization-specific-date.component.html',
  styleUrls: ['./create-new-authorization-specific-date.component.scss']
})
export class CreateNewAuthorizationSpecificDateComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;

  compareLocations = compareLocations;
  transportationLocations$ = this.store$
    .pipe(select(getApprovedLocations('transportation')))
    .pipe(
      map((locations) => {
        return locations.map((location) => ({
          label: referralLocationToFullString(location),
          value: location
        }));
      })
    );

  constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService,
    public transportationAuthorizationFormBuilderService: TransportationAuthorizationFormBuilderService,
    private store$: Store<RootState>
  ) {
    super(createNewAuthorizationServiceService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected buildFormGroup() {
    this.formGroup.addControl(
      'pickupDate',
      new FormControl(null, [Validators.required])
    );
    this.formGroup.addControl(
      'pickupTime',
      new FormControl(null, [Validators.required])
    );
    this.formGroup.addControl(
      'fromAddress',
      new FormControl(null, [Validators.required, duplicateFromAndToValidator])
    );
    this.formGroup.addControl(
      'toAddress',
      new FormControl(null, [Validators.required, duplicateFromAndToValidator])
    );
  }

  protected saveFormData() {
    this.referralAuthorizationItem.authData[
      'pickupDate'
    ] = this.formGroup.controls['pickupDate'].value;

    this.referralAuthorizationItem.authData[
      'pickupTime'
    ] = this.formGroup.controls['pickupTime'].value;
    this.referralAuthorizationItem.authData[
      'fromAddress'
    ] = this.formGroup.controls['fromAddress'].value;

    this.referralAuthorizationItem.authData[
      'toAddress'
    ] = this.formGroup.controls['toAddress'].value;
  }

  showAddLocationModal(matSelect: MatSelect): void {
    this.transportationAuthorizationFormBuilderService
      .showAddLocationModal()
      .pipe(withLatestFrom(this.transportationLocations$))
      .subscribe(
        ([value, locationOptions]: [
          ClaimLocation,
          HealtheSelectOption<ClaimLocation>[]
        ]) => {
          for (let locationOption of locationOptions) {
            if (referralLocationToFullString(value) === locationOption.label) {
              matSelect.ngControl.control.setValue(locationOption.value);
              break;
            }
          }
        }
      );
  }
}
