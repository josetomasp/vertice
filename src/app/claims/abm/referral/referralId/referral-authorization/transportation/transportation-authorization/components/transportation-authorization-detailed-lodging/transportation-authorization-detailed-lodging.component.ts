import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { faNotesMedical } from '@fortawesome/pro-light-svg-icons';
import {
  checkingDateBeforeCheckoutDateValidator
} from '../../../../../../make-a-referral/transportation/lodging-wizard-form/lodging-wizard-form-validators';
import {
  AuthRelatedAppointmentsModalService
} from '../../../../../components/auth-related-appointments-modal/auth-related-appointments-modal.service';
import {
  AuthorizationInformationService
} from '../../../../authorization-information.service';
import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedLodgingFormData
} from '../../../../referral-authorization.models';
import {
  calculateNumberOfNights,
  lodgingNumberOfRoomsOptions,
  lodgingPriceOfRoomOptions
} from './transportation-authorization-detailed-lodging-support';

@Component({
  selector: 'healthe-transportation-authorization-detailed-lodging',
  templateUrl: './transportation-authorization-detailed-lodging.component.html',
  styleUrls: ['./transportation-authorization-detailed-lodging.component.scss']
})
export class TransportationAuthorizationDetailedLodgingComponent
  implements OnInit, OnDestroy {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  idIndex;

  isAlive = true;
  sectionName = 'lodging';
  faNotesMedical = faNotesMedical;
  numberOfGuestsOptions: number[];
  numberOfNights: number;
  numberOfRoomsOptions = lodgingNumberOfRoomsOptions;
  priceOfRoomOptions = lodgingPriceOfRoomOptions;

  authData: TransportationAuthorizationDetailedLodgingFormData;
  formGroup: FormGroup;

  constructor(
    private authRelatedAppointmentsModalService: AuthRelatedAppointmentsModalService,
    private authorizationInformationService: AuthorizationInformationService
  ) {
    this.numberOfGuestsOptions = this.authorizationInformationService.numberOfTravelersOptions;
  }

  ngOnInit(): void {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedLodgingFormData;
    this.formGroup = this.referralAuthorizationItem.formGroup;

    this.formGroup.addControl(
      'destination',
      new FormControl(this.authData.destination, Validators.required)
    );

    this.formGroup.addControl(
      'numberOfGuests',
      new FormControl(this.authData.numberOfGuests, Validators.required)
    );

    this.formGroup.addControl(
      'numberOfRooms',
      new FormControl(this.authData.numberOfRooms)
    );

    this.formGroup.addControl(
      'priceOfRoom',
      new FormControl(this.authData.priceOfRoom)
    );

    this.formGroup.addControl(
      'checkInDate',
      new FormControl(new Date(this.authData.checkInDate), [
        Validators.required,
        checkingDateBeforeCheckoutDateValidator
      ])
    );

    this.formGroup.addControl(
      'checkOutDate',
      new FormControl(new Date(this.authData.checkOutDate), [
        Validators.required,
        checkingDateBeforeCheckoutDateValidator
      ])
    );

    this.formGroup.addControl(
      'numberOfNights',
      new FormControl(this.authData.numberOfNights)
    );

    this.formGroup.get('checkInDate').valueChanges.subscribe((value) => {
      const result = calculateNumberOfNights(
        value,
        this.formGroup.get('checkOutDate').value
      );
      this.formGroup
        .get('numberOfNights')
        .setValue(result, { emitEvent: false });
      this.numberOfNights = result;
    });

    this.formGroup.get('checkOutDate').valueChanges.subscribe((value) => {
      const result = calculateNumberOfNights(
        this.formGroup.get('checkInDate').value,
        value
      );
      this.formGroup
        .get('numberOfNights')
        .setValue(result, { emitEvent: false });
      this.numberOfNights = result;
    });

    this.calculateNights();
  }

  updateValidityOnBlur(): void {
    this.formGroup
      .get('checkInDate')
      .updateValueAndValidity({ emitEvent: false });
    this.formGroup
      .get('checkOutDate')
      .updateValueAndValidity({ emitEvent: false });
  }

  viewRelatedAppointments(): void {
    this.authRelatedAppointmentsModalService.showModal(
      this.authData.appointments
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  get destination(): AbstractControl {
    return this.formGroup.get('destination');
  }

  private calculateNights(): void {
    const controls = this.formGroup.controls;
    const checkInDate = controls['checkInDate'].value;
    const checkOutDate = controls['checkOutDate'].value;

    if (checkInDate && checkOutDate) {
      this.numberOfNights = calculateNumberOfNights(checkInDate, checkOutDate);
    }
  }
}
