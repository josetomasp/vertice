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
import { select, Store } from '@ngrx/store';
import {
  RootState
} from '../../../../../../../../../../store/models/root.models';
import {
  getTransportationTypes
} from '../../../../../../../store/selectors/makeReferral.selectors';
import { map, takeUntil } from 'rxjs/operators';
import { faAmbulance } from '@fortawesome/pro-light-svg-icons';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'healthe-create-new-authorization-other',
  templateUrl: './create-new-authorization-other.component.html',
  styleUrls: ['./create-new-authorization-other.component.scss']
})
export class CreateNewAuthorizationOtherComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;

  faAmbulance = faAmbulance;

  transportationTypes$ = this.store$.pipe(
    select(getTransportationTypes),
    takeUntil(this.onDestroy$),
    map((other) => other.types)
  );

  constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService,
    private readonly store$: Store<RootState>
  ) {
    super(createNewAuthorizationServiceService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected buildFormGroup() {
    this.formGroup.addControl(
      'typeOfTransportation',
      new FormControl(null, [Validators.required])
    );
  }

  protected saveFormData() {
    this.referralAuthorizationItem.authData[
      'typeOfTransportation'
    ] = this.formGroup.controls['typeOfTransportation'].value;
  }
}
