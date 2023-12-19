import { ApplicationRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { State, States } from '@shared';
import { LocationService } from '@shared/service/location.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../store/selectors/router.selectors';
import { addFusionLocation } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { addTransportationLocation } from '../../../store/actions/make-a-referral.actions';
import {
  ClaimLocation,
  ReferralLocationCreateRequest
} from '../../../store/models/make-a-referral.models';
import {
  getServiceOptions,
  isApprovedLocationsLoaded
} from '../../../store/selectors/makeReferral.selectors';
import { DIAGNOSTICS_ARCH_TYPE } from '../../diagnostics/diagnostics-step-definitions';
import { DME_ARCH_TYPE } from '../../dme/dme-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from '../../home-health/home-health-step-definitions';
import { LANGUAGE_ARCH_TYPE } from '../../language/language-step-definitions';
import {
  AncilliaryServiceCode,
  buildLocationAddressDisplayText,
  MakeAReferralOptionsType
} from '../../make-a-referral-shared';
import { PHYSICALMEDICINE_ARCH_TYPE } from '../../physical-medicine/physical-medicine-step-definitions';
import { TRANSPORTATION_ARCH_TYPE } from '../../transportation/transportation-step-definitions';
import { AddLocationModalConfig } from './add-location-modal-config';
import { AddLocationValidators } from './add-location.validators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-add-location-modal',
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.scss']
})
export class AddLocationModalComponent extends DestroyableComponent
  implements OnInit {
  // Configuration
  addLocationConfig: AddLocationModalConfig;

  public serviceOptions$: Observable<MakeAReferralOptionsType>;

  states: State[] = States;

  isApprovedLocationsLoaded$;

  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  encodedCustomerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );

  private addButtonIsDisabled = false;

  public formGroup = new FormGroup({
    locationType: new FormControl('', [Validators.required]),
    locationName: new FormControl('', [Validators.required]),
    // locationAddress: new FormControl('', [Validators.required]),
    street1Address: new FormControl('', [Validators.required]),
    street2Address: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [
      Validators.required,
      AddLocationValidators.zipCodeValidator
    ]),
    locationPhone: new FormControl(),
    physicianSpecialty: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<AddLocationModalComponent>,
    private store$: Store<RootState>,
    private locationService: LocationService,
    private applicationRef: ApplicationRef,
    @Inject(MAT_DIALOG_DATA) addLocationConfig?: AddLocationModalConfig
  ) {
    super();
    // Transportation configuration is the default.
    if (addLocationConfig) {
      this.addLocationConfig = addLocationConfig;
    } else {
      this.addLocationConfig = {
        enablePhysicianSpecialtyDropdown: true,
        selectedServiceType: TRANSPORTATION_ARCH_TYPE
      };
    }
  }

  ngOnInit() {
    this.serviceOptions$ = this.store$.pipe(
      select(getServiceOptions(this.addLocationConfig.selectedServiceType))
    );
    this.isApprovedLocationsLoaded$ = this.store$.pipe(
      select(
        isApprovedLocationsLoaded,
        this.addLocationConfig.selectedServiceType
      )
    );
  }

  isAddButtonDisabled() {
    return this.addButtonIsDisabled && this.formGroup.invalid;
  }

  addLocation() {
    if (this.formGroup.invalid) {
      Object.keys(this.formGroup.controls).forEach((key) => {
        this.formGroup.get(key).markAsTouched();
        this.formGroup.get(key).updateValueAndValidity();
      });
      this.addButtonIsDisabled = true;
    } else {
      const retVal: ClaimLocation = {
        type: this.formGroup.getRawValue().locationType.code,
        address: '',
        name: this.formGroup.getRawValue().locationName
      };

      let body: ReferralLocationCreateRequest = {
        address: {
          streetAddress1: this.formGroup.getRawValue().street1Address,
          streetAddress2: this.formGroup.getRawValue().street2Address,
          city: this.formGroup.getRawValue().city,
          state: this.formGroup.getRawValue().state,
          zipCode: this.formGroup.getRawValue().zip,
          zipCodeExt: ''
        },
        locationName: this.formGroup.getRawValue().locationName,
        physicianSpecialty: this.formGroup.getRawValue().physicianSpecialty,
        type: this.formGroup.getRawValue().locationType.code,
        typeDescription: this.formGroup.getRawValue().locationType.description,
        locationPhone: this.formGroup.getRawValue().locationPhone
      };
      this.fixZipCode(body);

      this.dispatchSubmit(body);

      retVal.address = buildLocationAddressDisplayText(body.address);
      retVal.type = body.typeDescription;
      this.closeDialog(retVal);
    }
  }

  // The reason the following is not deleted and just commented out is because
  // in the future, we will want to go back to the google API again.

  // addLocation() {
  //   if (this.formGroup.invalid) {
  //     Object.keys(this.formGroup.controls).forEach((key) => {
  //       this.formGroup.get(key).markAsTouched();
  //       this.formGroup.get(key).updateValueAndValidity();
  //     });
  //     this.addButtonIsDisabled = true;
  //   } else {
  //     const retVal: ClaimLocation = {
  //       type: this.formGroup.getRawValue().locationType.code,
  //       address: '',
  //       name: this.formGroup.getRawValue().locationName
  //     };
  //
  //     this.locationService
  //       .getPlacesFromAddress(this.formGroup.getRawValue().locationAddress)
  //       .pipe(
  //         first(),
  //         switchMap((results) =>
  //           this.locationService.getAddressComponentsForPlace(
  //             results[0]['place_id']
  //           )
  //         )
  //       )
  //       .subscribe((result) => {
  //         let addressComponents: GeocoderAddressComponent[] =
  //           result.address_components;
  //
  //         let street1: string = '';
  //         let streetNumber = getAddressComponentValueByType(
  //           'street_number',
  //           addressComponents
  //         );
  //         if (streetNumber) {
  //           street1 = street1.concat(streetNumber);
  //         }
  //         let streetName = getAddressComponentValueByType(
  //           'route',
  //           addressComponents
  //         );
  //         if (streetName.length > 0) {
  //           street1 = street1.concat(' ', streetName);
  //         }
  //
  //         let body: ReferralLocationCreateRequest = {
  //           address: {
  //             streetAddress1: street1,
  //             streetAddress2: '',
  //             city: getAddressComponentValueByType(
  //               'locality',
  //               addressComponents
  //             ),
  //             state: getAddressComponentValueByType(
  //               'administrative_area_level_1',
  //               addressComponents
  //             ),
  //             zipCode: getAddressComponentValueByType(
  //               'postal_code',
  //               addressComponents
  //             ),
  //             zipCodeExt: ''
  //           },
  //           locationName: this.formGroup.getRawValue().locationName,
  //           physicianSpecialty: this.formGroup.getRawValue().physicianSpecialty,
  //           type: this.formGroup.getRawValue().locationType.code,
  //           typeDescription: this.formGroup.getRawValue().locationType
  //             .description,
  //           locationPhone: this.formGroup.getRawValue().locationPhone
  //         };
  //         this.dispatchSubmit(body);
  //
  //         retVal.address = buildLocationAddressDisplayText(body.address);
  //         retVal.type = body.typeDescription;
  //         this.closeDialog(retVal);
  //       });
  //   }
  // }

  private dispatchSubmit(request: ReferralLocationCreateRequest) {
    switch (this.addLocationConfig.selectedServiceType) {
      case DIAGNOSTICS_ARCH_TYPE:
      case DME_ARCH_TYPE:
      case HOMEHEALTH_ARCH_TYPE:
      case LANGUAGE_ARCH_TYPE:
      case PHYSICALMEDICINE_ARCH_TYPE:
        // case IMPLANTS_ARCH_TYPE:
        {
          combineLatest([this.encodedCustomerId$, this.encodedClaimNumber$])
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
              this.store$.dispatch(
                addFusionLocation({
                  serviceCode: this.getServiceCode(
                    this.addLocationConfig.selectedServiceType
                  ),
                  newLocation: request,
                  encodedClaimNumber,
                  encodedCustomerId
                })
              );
            });
        }
        break;
      case TRANSPORTATION_ARCH_TYPE:
      default:
        {
          this.store$.dispatch(
            addTransportationLocation({ newLocation: request })
          );
        }
        break;
    }
  }

  getServiceCode(selectedServiceType: string): AncilliaryServiceCode {
    switch (selectedServiceType) {
      case 'language':
        return AncilliaryServiceCode.LAN;
      case 'physicalMedicine':
        return AncilliaryServiceCode.PM;
      case 'transportation':
        return AncilliaryServiceCode.TRP;
      case 'dme':
        return AncilliaryServiceCode.DME;
      case 'diagnostics':
        return AncilliaryServiceCode.DX;
      case 'homeHealth':
        return AncilliaryServiceCode.HH;
      default:
        return null;
    }
  }

  private closeDialog(retVal: ClaimLocation) {
    this.dialogRef.close(retVal);
    this.applicationRef.tick();
  }

  private fixZipCode(body: ReferralLocationCreateRequest) {
    let originalZip = body.address.zipCode;
    if (originalZip.length > 5) {
      body.address.zipCode = originalZip.substr(0, 5);
      body.address.zipCodeExt = originalZip.substring(5);
    }
  }
}
