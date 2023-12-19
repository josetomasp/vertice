import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { faPlaneDeparture } from '@fortawesome/pro-light-svg-icons';
import {
  AutocompleteOption,
  LocationService
} from '@shared/service/location.service';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  departureBeforeReturnValidator,
  duplicateAirportValidator
} from 'src/app/claims/abm/referral/make-a-referral/transportation/flight-wizard-form/flight-wizard-form-validators';
import {
  AuthorizationInformationService
} from '../../../../../authorization-information.service';
import {
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';
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
  selector: 'healthe-create-new-authorization-flight',
  templateUrl: './create-new-authorization-flight.component.html',
  styleUrls: ['./create-new-authorization-flight.component.scss']
})
export class CreateNewAuthorizationFlightComponent
  extends CreateNewAuthorizationAbstractBaseComponent
  implements OnInit {
  //#region   Public Properties
  @Input()
  dialogData: CreateNewAuthorizationModalComponentData;
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @ViewChild('flyingFromMenuAutocompleteTrigger', { static: true })
  flyingFromAutocompleteTrigger: MatMenuTrigger;
  @ViewChild('flyingToMenuAutocompleteTrigger', { static: true })
  flyingToAutocompleteTrigger: MatMenuTrigger;

  faPlaneDeparture = faPlaneDeparture;
  numberOfTravelersOptions: number[];
  //#endregion

  //#region   Observables
  flyingFromSuggestions$: Observable<AutocompleteOption[]>;
  flyingToSuggestions$: Observable<AutocompleteOption[]>;
  //#endregion

  constructor(
    private authorizationInformationService: AuthorizationInformationService,
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService,
    private locationService: LocationService
  ) {
    super(createNewAuthorizationServiceService);
    this.numberOfTravelersOptions = this.authorizationInformationService.numberOfTravelersOptions;
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();
    this.validateForm();
  }
  //#endregion

  //#region   Public Properties
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
  ): void {
    const formControl = this.formGroup.get(formControlName);
    formControl.markAsPristine();
    formControl.setValue(value, { emitEvent: false });
    trigger.closeMenu();
  }
  //#endregion

  protected saveFormData(): void {
    this.referralAuthorizationItem.authData = {
      ...this.referralAuthorizationItem.authData,
      ...this.formGroup.value
    };
  }
  protected buildFormGroup(): void {
    this.formGroup.addControl(
      'flyingFrom',
      new FormControl('', [Validators.required, duplicateAirportValidator])
    );
    this.formGroup.addControl(
      'flyingTo',
      new FormControl('', [Validators.required, duplicateAirportValidator])
    );

    this.formGroup.addControl(
      'departureDate',
      new FormControl(null, [
        Validators.required,
        departureBeforeReturnValidator
      ])
    );
    this.formGroup.addControl(
      'returnDate',
      new FormControl(null, [departureBeforeReturnValidator])
    );
    this.formGroup.addControl(
      'numberOfTravelers',
      new FormControl(1, [Validators.required])
    );
  }

  private validateForm(): void {
    const fcFlyingFrom = this.formGroup.get('flyingFrom');
    const fcFlyingTo = this.formGroup.get('flyingTo');

    // These next two value changes solve the case when you have two identical airports
    // When you change one control, the error on the other control will now go away
    fcFlyingFrom.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe(() => {
        fcFlyingTo.updateValueAndValidity({ emitEvent: false });
      });

    fcFlyingTo.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe(() => {
        fcFlyingFrom.updateValueAndValidity({ emitEvent: false });
      });

    this.flyingFromSuggestions$ = fcFlyingFrom.valueChanges.pipe(
      filter((value) => !!value),
      this.getOptions(() => this.flyingFromAutocompleteTrigger)
    );

    this.flyingToSuggestions$ = fcFlyingTo.valueChanges.pipe(
      filter((value) => !!value),
      this.getOptions(() => this.flyingToAutocompleteTrigger)
    );

    this.formGroup
      .get('returnDate')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup
          .get('departureDate')
          .updateValueAndValidity({ emitEvent: false });
      });

    this.formGroup
      .get('departureDate')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup
          .get('returnDate')
          .updateValueAndValidity({ emitEvent: false });
      });
  }
}
