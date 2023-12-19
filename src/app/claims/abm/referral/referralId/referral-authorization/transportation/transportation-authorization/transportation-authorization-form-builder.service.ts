import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import { DateRangeValidators } from '../../../../make-a-referral/components/date-range-form/dateRangeValidators';
import { MakeAReferralService } from '../../../../make-a-referral/make-a-referral.service';
import { duplicateFromAndToValidator } from '../../../../make-a-referral/transportation/TransporationSpecificDateValidators';
import { TRANSPORTATION_ARCH_TYPE } from '../../../../make-a-referral/transportation/transportation-step-definitions';
import { ClaimLocation } from '../../../../store/models/make-a-referral.models';
import {
  ReferralAuthData,
  ReferralLocationsMap,
  TransportationAuthorizationDetailedSedanFormData,
  TransportationAuthorizationOpenSedanFormData,
  TransportationAuthorizationOpenWheelchairFormData
} from '../../referral-authorization.models';

export function preventLessThanZero(fc: AbstractControl) {
  fc.valueChanges.subscribe((value) => {
    if (value < 0) {
      fc.setValue(0, { emitEvent: false });
    }
  });
}

@Injectable({
  providedIn: 'root'
})
export class TransportationAuthorizationFormBuilderService {
  constructor(private makeAReferralService: MakeAReferralService) {}

  createStandardSedanFormGroupControls(
    formGroup: FormGroup,
    authData: TransportationAuthorizationDetailedSedanFormData
  ): void {
    formGroup.addControl(
      'toAddress',
      new FormControl(authData.toAddress, [
        Validators.required,
        duplicateFromAndToValidator
      ])
    );
    formGroup.addControl(
      'fromAddress',
      new FormControl(authData.fromAddress, [
        Validators.required,
        duplicateFromAndToValidator
      ])
    );
    formGroup.addControl(
      'pickupDate',
      new FormControl(new Date(authData.pickupDate), [Validators.required])
    );
    formGroup.addControl(
      'pickupTime',
      new FormControl(authData.pickupTime, [Validators.required])
    );
  }

  showAddLocationModal(): Observable<any> {
    return this.makeAReferralService
      .displayAddLocationModal({
        selectedServiceType: TRANSPORTATION_ARCH_TYPE,
        enablePhysicianSpecialtyDropdown: true
      })
      .afterClosed();
  }

  // Open Auth related methods
  addOpenAuthControls(openAuthFormGroup: FormGroup): void {
    openAuthFormGroup.addControl(
      'startDate',
      new FormControl('', [
        Validators.required,
        DateRangeValidators.startDateValidation
      ])
    );
    openAuthFormGroup.addControl(
      'endDate',
      new FormControl('', [
        Validators.required,
        DateRangeValidators.endDateValidation
      ])
    );
    openAuthFormGroup.addControl(
      'tripsAuthorized',
      new FormControl('', DateRangeValidators.tripsOrUnlimitedTrips)
    );
    openAuthFormGroup.addControl(
      'unlimitedTrips',
      new FormControl(false, DateRangeValidators.tripsOrUnlimitedTrips)
    );
    openAuthFormGroup.addControl(
      'noLocationRestrictions',
      new FormControl(false)
    );
    openAuthFormGroup.addControl('approvedLocations', new FormGroup({}));
    openAuthFormGroup.addControl('notes', new FormControl(''));
    openAuthFormGroup.addControl(
      'specifyTripsByLocation',
      new FormControl(false)
    );
  }

  setTransportationOpenAuthFormState(
    openAuthDetailsFormGroup: FormGroup,
    claimLocations: ClaimLocation[],
    openAuthorizationData:
      | ReferralAuthData
      | TransportationAuthorizationOpenSedanFormData
      | TransportationAuthorizationOpenWheelchairFormData
  ): Observable<[void, void]>[] {
    this.addOpenAuthControls(openAuthDetailsFormGroup);
    openAuthDetailsFormGroup
      .get('startDate')
      .setValue(new Date(openAuthorizationData.startDate));
    openAuthDetailsFormGroup
      .get('endDate')
      .setValue(new Date(openAuthorizationData.endDate));
    openAuthDetailsFormGroup
      .get('unlimitedTrips')
      .setValue(openAuthorizationData.unlimitedTrips);
    if (openAuthorizationData.specifyTripsByLocation) {
      openAuthDetailsFormGroup.get('unlimitedTrips').disable();
    }
    openAuthDetailsFormGroup
      .get('noLocationRestrictions')
      .setValue(openAuthorizationData.noLocationRestrictions);
    openAuthDetailsFormGroup
      .get('specifyTripsByLocation')
      .setValue(openAuthorizationData.specifyTripsByLocation);
    openAuthDetailsFormGroup
      .get('tripsAuthorized')
      .setValue(openAuthorizationData.tripsAuthorized);
    if (
      openAuthorizationData.specifyTripsByLocation ||
      openAuthorizationData.unlimitedTrips
    ) {
      openAuthDetailsFormGroup.get('tripsAuthorized').disable();
    }
    openAuthDetailsFormGroup.clearValidators();
    openAuthDetailsFormGroup.setValidators([
      DateRangeValidators.validTwoLocationSelectionAuth,
      DateRangeValidators.specifyTripsTotal
    ]);
    return this.setApprovedLocationsForm(
      openAuthDetailsFormGroup.get('specifyTripsByLocation') as FormControl,
      openAuthDetailsFormGroup.get('approvedLocations') as FormGroup,
      claimLocations,
      openAuthDetailsFormGroup.get('tripsAuthorized') as FormControl,
      openAuthorizationData.approvedLocations
    );
  }

  setApprovedLocationsForm(
    specifyTripsByLocation: FormControl,
    allLocationsFormGroup: FormGroup,
    claimLocations: ClaimLocation[],
    tripsAuthorizedControl: FormControl,
    selectedLocations: ReferralLocationsMap
  ): Observable<[void, void]>[] {
    const individualLocation$Array: Observable<[void, void]>[] = [];
    claimLocations.forEach((location: ClaimLocation) => {
      let typedLocationsFormGroup: FormGroup = allLocationsFormGroup.get(
        location.type
      ) as FormGroup;
      if (!typedLocationsFormGroup) {
        typedLocationsFormGroup = new FormGroup({});
        allLocationsFormGroup.addControl(
          location.type,
          typedLocationsFormGroup
        );
      }

      const locationControl = this.generateIndividualLocationFormGroup(
        selectedLocations[location.type][location.id].locationSelected,
        selectedLocations[location.type][location.id].locationTripCount
      );
      typedLocationsFormGroup.addControl(location.id, locationControl);
      const individualLocation$ = this.individualLocation$(
        tripsAuthorizedControl,
        locationControl
      );
      individualLocation$Array.push(individualLocation$);
    });
    return individualLocation$Array;
  }

  generateIndividualLocationFormGroup(
    locationSelected: boolean,
    locationTripCount: number
  ): FormGroup {
    return new FormGroup(
      {
        locationSelected: new FormControl(locationSelected),
        locationTripCount: new FormControl(locationTripCount)
      },
      DateRangeValidators.mustBeGreaterThanZeroIfSelected
    );
  }

  individualLocation$(
    tripsAuthorizedControl: FormControl,
    locationControl: FormGroup
  ): Observable<[void, void]> {
    const locationSelected$ = locationControl.controls[
      'locationSelected'
    ].valueChanges.pipe(
      filter(() => !tripsAuthorizedControl.enabled),
      map((isLocationSelected) => {
        locationControl.setValidators(
          DateRangeValidators.mustBeGreaterThanZeroIfSelected
        );
        const currentLocationControl =
          locationControl.controls['locationTripCount'];
        if (isLocationSelected) {
          currentLocationControl.setErrors(null);
          currentLocationControl.updateValueAndValidity();
        } else {
          currentLocationControl.setValue(0);
          currentLocationControl.clearValidators();
          currentLocationControl.updateValueAndValidity();
        }
      })
    );

    const locationTripCount$ = locationControl.controls[
      'locationTripCount'
    ].valueChanges.pipe(
      startWith(locationControl.controls['locationTripCount'].value as number),
      pairwise(), // Pairwise will save the previous emission and include it as the first value in the array so we can do delta math
      map(([oldLocationTripCount, newLocationTripCount]) => {
        tripsAuthorizedControl.setValue(
          tripsAuthorizedControl.value +
            newLocationTripCount -
            oldLocationTripCount
        );
      })
    );

    return combineLatest([locationSelected$, locationTripCount$]);
  }

  addNewLocationControls(
    openAuthFormGroup: FormGroup,
    claimLocation: ClaimLocation
  ): Observable<[void, void]> {
    let approvedLocationsFormGroup: FormGroup = openAuthFormGroup.get(
      'approvedLocations'
    ) as FormGroup;
    let typedLocationsFormGroup: FormGroup = approvedLocationsFormGroup.get(
      claimLocation.type
    ) as FormGroup;

    if (!typedLocationsFormGroup) {
      typedLocationsFormGroup = new FormGroup({});
      approvedLocationsFormGroup.addControl(
        claimLocation.type,
        typedLocationsFormGroup
      );
    }

    const locationControl = this.generateIndividualLocationFormGroup(false, 0);

    if (openAuthFormGroup.get('noLocationRestrictions').value) {
      locationControl.disable();
    }

    typedLocationsFormGroup.addControl(claimLocation.id, locationControl);

    return this.individualLocation$(
      openAuthFormGroup.get('tripsAuthorized') as FormControl,
      locationControl
    );
  }
}
