import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption, TimeOption } from '@shared';
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
} from '../../../../../../make-a-referral/make-a-referral-shared';
import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedSedanFormData
} from '../../../../referral-authorization.models';
import {
  TransportationAuthorizationFormBuilderService
} from '../../transportation-authorization-form-builder.service';

@Component({
  selector: 'healthe-transportation-authorization-detailed-base',
  templateUrl: './transportation-authorization-detailed-base.component.html',
  styleUrls: ['./transportation-authorization-detailed-base.component.scss']
})
export class TransportationAuthorizationDetailedBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;
  @Input()
  idIndex: number;
  @Input()
  idBase: string = 'base';
  @Input()
  timeDropdownValues: TimeOption[];

  compareLocations = compareLocations;

  formGroup: FormGroup;

  authData: TransportationAuthorizationDetailedSedanFormData;

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
    public transportationAuthorizationFormBuilderService: TransportationAuthorizationFormBuilderService,
    private store$: Store<RootState>
  ) {}

  ngOnInit() {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedSedanFormData;
    this.formGroup = this.referralAuthorizationItem.formGroup;
    this.transportationAuthorizationFormBuilderService.createStandardSedanFormGroupControls(
      this.formGroup,
      this.authData
    );
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

  get fromAddress(): AbstractControl {
    return this.formGroup.get('fromAddress');
  }
  get toAddress(): AbstractControl {
    return this.formGroup.get('toAddress');
  }
}
