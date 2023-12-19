import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { faHotel } from '@fortawesome/pro-light-svg-icons';
import * as _moment from 'moment';
import { merge } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import {
  checkingDateBeforeCheckoutDateValidator,
  nightsOrCheckinDateValidator
} from '../../../../../../../make-a-referral/transportation/lodging-wizard-form/lodging-wizard-form-validators';
import {
  AuthorizationInformationService
} from '../../../../../authorization-information.service';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
import {
  lodgingNumberOfRoomsOptions,
  lodgingPriceOfRoomOptions
} from '../../transportation-authorization-detailed-lodging/transportation-authorization-detailed-lodging-support';
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
  selector: 'healthe-create-new-authorization-lodging',
  templateUrl: './create-new-authorization-lodging.component.html',
  styleUrls: ['./create-new-authorization-lodging.component.scss']
})
export class CreateNewAuthorizationLodgingComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  //#region   Public Properties
  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  faHotel = faHotel;
  numberOfGuestsOptions: number[];
  numberOfNights: string;
  numberOfRoomsOptions: number[] = lodgingNumberOfRoomsOptions;
  priceOfRoomOptions: string[] = lodgingPriceOfRoomOptions;
  //#endregion

  constructor(
    private authorizationInformationService: AuthorizationInformationService,
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService
  ) {
    super(createNewAuthorizationServiceService);
    this.numberOfGuestsOptions = this.authorizationInformationService.numberOfTravelersOptions;
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();

    merge(
      this.formGroup.get('checkInDate').valueChanges,
      this.formGroup.get('checkOutDate').valueChanges
    )
      .pipe(
        delay(500),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.autoCalculateDatesAndNights();
      });
  }
  //#endregion
  updateValidityOnBlur(): void {
    this.formGroup.get('checkInDate').updateValueAndValidity();
    this.formGroup.get('checkOutDate').updateValueAndValidity();
  }
  private autoCalculateDatesAndNights(): void {
    const fcNumberOfNights: AbstractControl = this.formGroup.get(
      'numberOfNights'
    );
    const fcCheckInDate: AbstractControl = this.formGroup.get('checkInDate');
    const fcCheckOutDate: AbstractControl = this.formGroup.get('checkOutDate');

    const checkin = _moment(fcCheckInDate.value);
    const checkout = _moment(fcCheckOutDate.value);
    const days = checkout.diff(checkin, 'days');

    fcNumberOfNights.setValue('', { emitEvent: false });
    this.numberOfNights = '';

    // First set of rules, try and calculate number of nights if we can
    if (fcCheckInDate.value && fcCheckOutDate.value) {
      if (
        _moment.isDate(fcCheckInDate.value) &&
        _moment.isDate(fcCheckOutDate.value)
      ) {
        if (days >= 0) {
          fcNumberOfNights.setValue(days, { emitEvent: false });
          this.numberOfNights = days + '';
        }
      }
    }
  }
  //#region  Protected Properties
  protected saveFormData(): void {
    this.referralAuthorizationItem.authData = {
      ...this.referralAuthorizationItem.authData,
      ...this.formGroup.value
    };
  }
  protected buildFormGroup(): void {
    this.formGroup.addControl(
      'destination',
      new FormControl('', [Validators.required])
    );
    this.formGroup.addControl(
      'numberOfGuests',
      new FormControl(1, Validators.required)
    );
    this.formGroup.addControl('numberOfRooms', new FormControl(1));
    this.formGroup.addControl(
      'checkInDate',
      new FormControl(null, [
        Validators.required,
        checkingDateBeforeCheckoutDateValidator
      ])
    );
    this.formGroup.addControl(
      'checkOutDate',
      new FormControl(null, [Validators.required])
    );
    this.formGroup.addControl(
      'priceOfRoom',
      new FormControl(this.priceOfRoomOptions[0])
    );
    this.formGroup.addControl(
      'numberOfNights',
      new FormControl(null, [nightsOrCheckinDateValidator])
    );
  }
  //#endregion
}
