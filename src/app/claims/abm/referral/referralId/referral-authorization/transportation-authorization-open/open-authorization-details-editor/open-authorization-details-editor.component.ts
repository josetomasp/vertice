import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';

import { MakeAReferralService } from '../../../../make-a-referral/make-a-referral.service';
import { TRANSPORTATION_ARCH_TYPE } from '../../../../make-a-referral/transportation/transportation-step-definitions';
import { ClaimLocation } from '../../../../store/models/make-a-referral.models';
import { AuthorizationInformationService } from '../../authorization-information.service';

@Component({
  selector: 'healthe-open-authorization-details-editor',
  templateUrl: './open-authorization-details-editor.component.html',
  styleUrls: ['./open-authorization-details-editor.component.scss']
})
export class OpenAuthorizationDetailsEditorComponent
  extends DestroyableComponent
  implements OnInit {
  faPlus = faPlus;
  approvedLocations: ClaimLocation[];
  @ViewChild('specifyTripsByLocationSelect', { static: true })
  specifyTripsByLocationSelect: MatSelect;
  @Input()
  openAuthFormGroup: FormGroup;
  @Input() isReadOnlyForm: boolean = false;
  defaultTotalOfTrips: number;
  totalOfTripsReadOnly = false;
  constructor(
    private makeAReferralService: MakeAReferralService,
    private confirmationModalService: ConfirmationModalService,
    private authorizationInformationService: AuthorizationInformationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  individualLocationModalContent: string = 'By choosing this action, the total number of trips value will be cleared. Do you want to continue?';
  allLocationsModalContent: string = 'By choosing this action, the individual limit locations will no longer apply. Do you want to continue?';

  ngOnInit() {
    this.authorizationInformationService.showValidationErrors
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.changeDetectorRef.detectChanges());
    this.specifyTripsByLocationSelect.value = this.openAuthFormGroup.get(
      'specifyTripsByLocation'
    ).value;

    this.openAuthFormGroup
      .get('unlimitedTrips')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((isUnlimitedTrips) => {
        let tripsAuthorizedInput: AbstractControl = this.openAuthFormGroup.get(
          'tripsAuthorized'
        );
        if (isUnlimitedTrips) {
          tripsAuthorizedInput.setValue(0);
          tripsAuthorizedInput.disable();
        } else if (
          !this.openAuthFormGroup.get('specifyTripsByLocation').value &&
          !this.isReadOnlyForm
        ) {
          tripsAuthorizedInput.enable();
        }
      });

    this.openAuthFormGroup
      .get('specifyTripsByLocation')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((specifyTripsByLocation) => {
        this.specifyTripsByLocationSelect.value = specifyTripsByLocation;
        this.switchSpecifyTripsByLocationRelatedSettings(
          specifyTripsByLocation
        );
      });

    // Set the inital state of the form mode
    this.initialTripsByLocationRelatedSettings(
      this.openAuthFormGroup.get('specifyTripsByLocation').value
    );

    this.defaultTotalOfTrips = this.openAuthFormGroup.get(
      'tripsAuthorized'
    ).value;
  }

  initialTripsByLocationRelatedSettings(specifyTripsByLocation: boolean): void {
    if (specifyTripsByLocation) {
      this.switchToIndividualLocationMode();
    } else {
      this.switchToAllLocationsTogetherMode();
    }
  }

  promptForSpecifyTripsByLocationChange(
    specifyTripsByLocationSelect: MatSelect
  ) {
    this.confirmationModalService
      .displayModal(
        {
          titleString: 'Change specify # of trips at mode?',
          bodyHtml: this.changeTripLocationModalContent(this.openAuthFormGroup
            .get('specifyTripsByLocation').value),
          affirmString: 'Yes',
          denyString: 'No',
          affirmClass: 'success-button'
        },
        '225px'
      )
      .afterClosed()
      .subscribe((isSure) => {
        if (isSure) {
          let tripsAuthorizedInput: AbstractControl = this.openAuthFormGroup.get(
            'tripsAuthorized'
          );

          if (!this.openAuthFormGroup.get('specifyTripsByLocation').value) {
            tripsAuthorizedInput.setValue(0);
          }

          this.openAuthFormGroup
            .get('specifyTripsByLocation')
            .setValue(specifyTripsByLocationSelect.value);
        } else {
          specifyTripsByLocationSelect.writeValue(
            !specifyTripsByLocationSelect.value
          );
        }
      });
  }

  switchSpecifyTripsByLocationRelatedSettings(
    specifyTripsByLocation: boolean
  ): void {
    if (specifyTripsByLocation) {
      this.switchToIndividualLocationMode();
      this.openAuthFormGroup.get(
        'tripsAuthorized'
      ).setValue(0);
    } else {
      this.switchToAllLocationsTogetherMode();
    }
  }

  switchToIndividualLocationMode(): void {
    this.totalOfTripsReadOnly = true;
    this.openAuthFormGroup.get('unlimitedTrips').disable();
    this.openAuthFormGroup.get('unlimitedTrips').setValue(false);
    this.openAuthFormGroup.get('noLocationRestrictions').disable();
    this.openAuthFormGroup.get('noLocationRestrictions').setValue(false);
  }

  switchToAllLocationsTogetherMode(): void {
    this.totalOfTripsReadOnly = false;

    if (!this.isReadOnlyForm) {
      this.openAuthFormGroup.get('unlimitedTrips').enable();
      this.openAuthFormGroup.get('noLocationRestrictions').enable();
      if (!this.openAuthFormGroup.get('unlimitedTrips').value) {
        this.openAuthFormGroup.get('tripsAuthorized').enable();
      }
    }

    this.resetIndividualTripCountForms();
  }

  resetIndividualTripCountForms() {
    let approvedLocationsFormGroup: FormGroup = this.openAuthFormGroup.get(
      'approvedLocations'
    ) as FormGroup;
    Object.keys(approvedLocationsFormGroup.controls).forEach((locationType) => {
      let locationTypeGroup: FormGroup = approvedLocationsFormGroup.get(
        locationType
      ) as FormGroup;
      Object.keys(locationTypeGroup.controls).forEach((locationId) => {
        locationTypeGroup
          .get(locationId)
          .get('locationTripCount')
          .setValidators(null);
        locationTypeGroup
          .get(locationId)
          .get('locationTripCount')
          .setValue(0, { emitEvent: false });
      });
    });
  }

  getSpecifyTripsAtOptionsDisplay(specifyTripsAtOptions: boolean): string {
    return specifyTripsAtOptions
      ? 'Individual Location Level'
      : 'All Locations Together';
  }

  changeTripLocationModalContent(isAllLocationsTripSelection: boolean): string {
    return isAllLocationsTripSelection
      ? this.allLocationsModalContent
      : this.individualLocationModalContent;
  }

  showAddLocationModal() {
    this.makeAReferralService.displayAddLocationModal({
      selectedServiceType: TRANSPORTATION_ARCH_TYPE,
      enablePhysicianSpecialtyDropdown: true
    });
  }

  validateTrips() {
    this.openAuthFormGroup.get('tripsAuthorized').updateValueAndValidity();
    this.openAuthFormGroup.get('unlimitedTrips').updateValueAndValidity();
  }
}
