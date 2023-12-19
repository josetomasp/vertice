import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import {faCheck, faTimes} from '@fortawesome/pro-light-svg-icons';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {takeUntil} from 'rxjs/operators';
import {
  AuthorizationChangeSummary,
  FusionAuthorizationLocation,
  FusionAuthorizationLocationStatus,
  FusionDisplayAuthorizationLocation,
  LocationSummary
} from '../../../../../../store/models/fusion/fusion-authorizations.models';
import {FormGroupNamePassThrough} from "@modules/form-validation-extractor";

export class OriginalLocationValues {
  remainingQuantity?: number;
  totalQuantity?: number;
  numAppointments?: number;
  approvedQuantity?: number;
}

@Component({
  selector: 'healthe-interpretation-details-editor',
  templateUrl: './interpretation-details-editor.component.html',
  styleUrls: ['./interpretation-details-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterpretationDetailsEditorComponent extends DestroyableComponent
  implements FormGroupNamePassThrough, OnInit {
  @Input()
  locations: FusionAuthorizationLocation[];
  @Input()
  authChanges: AuthorizationChangeSummary[] = [];
  @Input()
  authIndex: number;
  @Input()
  locationDetailsFormGroup: FormGroup;
  @Input()
  categoryDesc: string;
  @Input()
  minInput: number;
  @Input()
  readOnly = false;

  locationChange: AuthorizationChangeSummary[];

  changes: LocationSummary[];

  faCheck = faCheck;
  faTimes = faTimes;
  locationsDisplay: FusionDisplayAuthorizationLocation[] = [];

  originalLocationValues: OriginalLocationValues[] = [];

  isNewAuthorization: boolean = false;

  // Global Errors Show conditions
  showRequiredError: boolean = false;

  showMinError: boolean = false;

  showMinPendError: boolean = false;

  showExtentionDenyError: boolean = false;

  showExtentionMinError: boolean = false;

  showLocationMinError: boolean = false;

  lastAction: string;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  formGroupDirective: FormGroupDirective;
  parent: ControlContainer;
  parentFormGroup: FormGroup;
  parentPath: string[];

  ngOnInit() {
    // Check if it is an extension or a new auth
    this.isNewAuthorization =
      this.authChanges.filter(
        (change) => change.changeType === 'NEW_OPEN_AUTHORIZATION'
      ).length > 0;
    if (!this.isNewAuthorization) {
      this.locationChange = this.authChanges.filter((change) => {
        return change.changeType === 'OPEN_AUTHORIZATION_LOCATION_CHANGE';
      });
      if (this.locationChange.length) {
        this.changes = this.locationChange[0].locationSummary;
      }
    }
    // Add the locations FormArray to the global formGroup
    this.locationDetailsFormGroup.addControl('allLocations', new FormArray([]));
    this.locationDetailsFormGroup.addControl('authAction', new FormControl('approve'));

    // Build the display Object
    this.buildDisplayLocation();
  }

  // Creats the display object and a formGroup for every location and add it to the global FormArray with all Locations
  buildDisplayLocation() {
    this.locations.forEach((location: FusionAuthorizationLocation) => {
      let originalValue = new OriginalLocationValues();
      const locationApproved =
        location.status !== FusionAuthorizationLocationStatus.UnderReview;
      let locationFormGroup = this.formBuilder.group({
        locationId: new FormControl(location.locationId),
        approved: new FormControl({ value: true, disabled: locationApproved })
      });

      let change: LocationSummary;
      if (!this.isNewAuthorization && this.changes) {
        change = this.changes.filter(
          (specificChange) => specificChange.locationId === location.locationId
        )[0];
        if (change) {
          locationFormGroup.addControl(
            'remainingQuantity',
            new FormControl(
              {
                value: change.remainingQuantity,
                disabled: locationApproved
              },
              [Validators.required, Validators.min(1)]
            )
          );
          originalValue.remainingQuantity = change.remainingQuantity;
          originalValue.totalQuantity = change.totalQuantity;
          originalValue.approvedQuantity = location.numAppointments;
          locationFormGroup
            .get('approved')
            .setValidators([Validators.required]);
          locationFormGroup.get('approved').updateValueAndValidity();
          this.setPerLocationChangeControl(
            locationFormGroup,
            change.remainingQuantity,
            change.totalQuantity,
            change
          );
        } else {
          locationFormGroup.addControl(
            'numAppointments',
            new FormControl(location.numAppointments, [
              Validators.required,
              Validators.min(1)
            ])
          );
          originalValue.numAppointments = location.numAppointments;
          this.setPerLocationChangeControl(
            locationFormGroup,
            location.numAppointments
          );
        }
      } else {
        locationFormGroup.addControl(
          'numAppointments',
          new FormControl(
            { value: location.numAppointments, disabled: locationApproved },
            [Validators.required, Validators.min(1)]
          )
        );
        originalValue.numAppointments = location.numAppointments;
        this.setPerLocationChangeControl(
          locationFormGroup,
          location.numAppointments
        );
      }

      let display: FusionDisplayAuthorizationLocation = {
        change: change,
        ...location
      };
      (this.locationDetailsFormGroup.get('allLocations') as FormArray).push(locationFormGroup);
      this.locationsDisplay.push(display);
      this.originalLocationValues.push(originalValue);
    });
    if (!this.readOnly) {
      this.checkValidity();
    }
  }

  // Set custom on change subcriptions to evaluate new behaviors or reset original values
  setPerLocationChangeControl(
    location: FormGroup,
    originalValue: number,
    originalTotal?: number,
    change?: LocationSummary
  ) {
    let formControlName = change ? 'remainingQuantity' : 'numAppointments';
    // Check updates the display total when remaining appointments changes
    location
      .get(formControlName)
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((remainingQuantity: number) => {
        if (change) {
          if (remainingQuantity > -1) {
            change.totalQuantity =
              originalTotal + (remainingQuantity - originalValue);
          }
        }

        this.checkValidity();
      });

    // Check for a location check or uncheck to disable input or reset to original value
    location
      .get('approved')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((locationApproved) => {
        if (!locationApproved) {
          location.get(formControlName).disable();
          location.get(formControlName).setValue(originalValue);
        } else {
          if (location.get(formControlName).disabled) {
            location.get(formControlName).setValue(originalValue);
            location.get(formControlName).enable();
          }
        }
        this.checkValidity();
      });
  }

  // Checks for every location input validity so that it can show or hide global errors
  checkValidity() {
    this.showRequiredError = false;
    this.showMinError = false;
    this.showMinPendError = false;
    this.showExtentionDenyError = false;
    this.showExtentionMinError = false;
    this.showLocationMinError = false;
    let locationsSelected = false;
    let array = this.locationDetailsFormGroup.get('allLocations') as FormArray;
    array.controls.forEach((formGroup, index) => {
      if (formGroup.get('approved').value) {
        locationsSelected = true;
      }
      let controlName = formGroup.get('remainingQuantity')
        ? 'remainingQuantity'
        : 'numAppointments';
      let formControl = formGroup.get(controlName);
      if (formControl.hasError('required')) {
        this.showRequiredError = true;
      }
      if (formControl.hasError('min')) {
        this.showMinError = true;
      }
      if (controlName === 'remainingQuantity') {
        let newTotal =
          this.originalLocationValues[index].totalQuantity +
          (formControl.value -
            this.originalLocationValues[index].remainingQuantity);
        if (newTotal < this.originalLocationValues[index].approvedQuantity) {
          this.showExtentionMinError = true;
          this.addFormError(
            array.controls[index].get(controlName),
            'totalApproved'
          );
        } else {
          this.removeFormError(
            array.controls[index].get(controlName),
            'totalApproved'
          );
        }
        if (formGroup.get('approved').value === false) {
          this.showExtentionDenyError = true;
          this.addFormError(array.controls[index].get('approved'), 'required');
        } else {
          this.removeFormError(
            array.controls[index].get('approved'),
            'required'
          );
        }
      }
    });
    if (this.locationDetailsFormGroup.get('authAction').value) {
      this.lastAction = this.locationDetailsFormGroup.get('authAction').value.repeat(1);
    }
    if (this.isNewAuthorization) {
      if (!locationsSelected && array.controls.length > 0) {
        this.addFormError(array.controls[0].get('approved'), 'required');
        this.showLocationMinError = true;
      } else {
        this.removeFormError(array.controls[0].get('approved'), 'required');
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  removeFormError(control: AbstractControl, error: string) {
    const currentErrors = control.errors;
    if (currentErrors) {
      delete currentErrors[error];
      !Object.keys(currentErrors).length
        ? control.setErrors(null)
        : control.setErrors(currentErrors);
    }
  }

  addFormError(control: AbstractControl, error: string) {
    let newError = {};
    newError[error] = true;
    control.setErrors({ ...control.errors, ...newError });
  }

  getLocationFormGroupProperty(index, property): AbstractControl {
    let formGroup = (this.locationDetailsFormGroup.get('allLocations') as FormArray).controls[
      index
      ] as FormGroup;
    if (property) {
      return formGroup.get(property);
    }
    return formGroup;
  }

  getLocationFormGroup(index): FormGroup {
    return (this.locationDetailsFormGroup.get('allLocations') as FormArray)
      .controls[index] as FormGroup;
  }
}
