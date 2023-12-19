import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { faNotesMedical } from '@fortawesome/pro-light-svg-icons';
import {
  AutocompleteOption,
  LocationService
} from '@shared/service/location.service';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap
} from 'rxjs/operators';

import {
  departureBeforeReturnValidator,
  duplicateAirportValidator
} from '../../../../../../make-a-referral/transportation/flight-wizard-form/flight-wizard-form-validators';
import {
  AuthRelatedAppointmentsModalService
} from '../../../../../components/auth-related-appointments-modal/auth-related-appointments-modal.service';
import {
  AuthorizationInformationService
} from '../../../../authorization-information.service';
import {
  ReferralAuthorizationItem,
  TransportationAuthorizationDetailedFlightFormData
} from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-transportation-authorization-detailed-flight',
  templateUrl: './transportation-authorization-detailed-flight.component.html',
  styleUrls: ['./transportation-authorization-detailed-flight.component.scss']
})
export class TransportationAuthorizationDetailedFlightComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  idIndex;

  @ViewChild('flyingFromMenuAutocompleteTrigger', { static: true })
  flyingFromAutocompleteTrigger: MatMenuTrigger;

  @ViewChild('flyingToMenuAutocompleteTrigger', { static: true })
  flyingToAutocompleteTrigger: MatMenuTrigger;

  flyingFromSuggestions$: Observable<AutocompleteOption[]>;
  flyingToSuggestions$: Observable<AutocompleteOption[]>;

  isAlive = true;
  sectionName = 'flight';
  faNotesMedical = faNotesMedical;

  numberOfTravelersOptions: number[];

  formGroup: FormGroup;
  authData: TransportationAuthorizationDetailedFlightFormData;

  constructor(
    private locationService: LocationService,
    private authRelatedAppointmentsModalService: AuthRelatedAppointmentsModalService,
    private authorizationInformationService: AuthorizationInformationService
  ) {
    this.numberOfTravelersOptions = this.authorizationInformationService.numberOfTravelersOptions;
  }

  ngOnInit() {
    this.authData = this.referralAuthorizationItem
      .authData as TransportationAuthorizationDetailedFlightFormData;
    this.formGroup = this.referralAuthorizationItem.formGroup;

    this.formGroup.addControl(
      'flyingFrom',
      new FormControl(this.authData.flyingFrom, [
        Validators.required,
        duplicateAirportValidator
      ])
    );

    this.formGroup.addControl(
      'flyingTo',
      new FormControl(this.authData.flyingTo, [
        Validators.required,
        duplicateAirportValidator
      ])
    );

    this.formGroup.addControl(
      'numberOfTravelers',
      new FormControl(this.authData.numberOfTravelers, Validators.required)
    );

    this.formGroup.addControl(
      'departureDate',
      new FormControl(new Date(this.authData.departureDate), [
        Validators.required,
        departureBeforeReturnValidator
      ])
    );

    this.formGroup.addControl(
      'returnDate',
      new FormControl(new Date(this.authData.returnDate), [
        departureBeforeReturnValidator
      ])
    );
    this.formGroup.get('returnDate').valueChanges.subscribe(() => {
      this.formGroup
        .get('departureDate')
        .updateValueAndValidity({ emitEvent: false });
    });

    this.formGroup.get('departureDate').valueChanges.subscribe(() => {
      this.formGroup
        .get('returnDate')
        .updateValueAndValidity({ emitEvent: false });
    });
  }

  ngAfterViewInit() {
    const fcFlyingFrom = this.formGroup.get('flyingFrom');
    const fcFlyingTo = this.formGroup.get('flyingTo');

    // These next two value changes solve the case when you have two identical airports
    // When you change one control, the error on the other control will now go away
    fcFlyingFrom.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      fcFlyingTo.updateValueAndValidity({ emitEvent: false });
    });

    fcFlyingTo.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      fcFlyingFrom.updateValueAndValidity({ emitEvent: false });
    });

    this.flyingFromSuggestions$ = fcFlyingFrom.valueChanges.pipe(
      this.getOptions(() => this.flyingFromAutocompleteTrigger)
    );

    this.flyingToSuggestions$ = fcFlyingTo.valueChanges.pipe(
      this.getOptions(() => this.flyingToAutocompleteTrigger)
    );
  }

  getOptions(
    trigger: () => MatMenuTrigger
  ): (o: Observable<any>) => Observable<AutocompleteOption[]> {
    return (o: Observable<any>): Observable<AutocompleteOption[]> =>
      o.pipe(
        debounceTime(250),
        switchMap((value) => {
          return this.locationService
            .getAirportOptions(value)
            .pipe(
              finalize(() => {
                setTimeout(() => {
                  trigger().openMenu();
                }, 500);
              })
            )
            .pipe(map((options) => options.slice(0, 10)));
        }),
        startWith([])
      );
  }

  selectOption(
    value: string,
    trigger: MatMenuTrigger,
    formControlName: string
  ) {
    const formControl = this.formGroup.get(formControlName);
    formControl.markAsPristine();
    formControl.setValue(value, { emitEvent: false });
    trigger.closeMenu();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  viewRelatedAppointments() {
    this.authRelatedAppointmentsModalService.showModal(
      this.authData.appointments
    );
  }

  get flyingFrom(): AbstractControl {
    return this.formGroup.get('flyingFrom');
  }

  get flyingTo(): AbstractControl {
    return this.formGroup.get('flyingTo');
  }
}
