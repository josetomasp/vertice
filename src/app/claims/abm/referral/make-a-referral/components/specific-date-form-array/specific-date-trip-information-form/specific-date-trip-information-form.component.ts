import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import {
  faCopy,
  faInfoCircle,
  faPlus,
  faStickyNote
} from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { generateABMReferralTimeOptions, HealtheSelectOption } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { has, isEqual } from 'lodash';
import { Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  takeWhile,
  withLatestFrom
} from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  ClaimLocation,
  CustomerServiceGroupConfiguration
} from '../../../../store/models/make-a-referral.models';
import { getDMECategoriesAndProducts } from '../../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import {
  getApprovedLocations,
  getSpecificNotesByFormStateNameAndIndex
} from '../../../../store/selectors/makeReferral.selectors';
import {
  compareLocations,
  referralLocationToFullString,
  ServiceType
} from '../../../make-a-referral-shared';
import { MakeAReferralService } from '../../../make-a-referral.service';
import { TRANSPORTATION_ARCH_TYPE } from '../../../transportation/transportation-step-definitions';
import {
  SpecificDateActionConfig,
  SpecificDateDynamicRow,
  SpecificDateDynamicRowType,
  SpecificDateFormField,
  SpecificDateFormFieldArray,
  SpecificDateFormFieldType
} from '../specific-date-form-config';

@Component({
  selector: 'healthe-specific-trip-information',
  templateUrl: './specific-date-trip-information-form.component.html',
  styleUrls: ['./specific-date-trip-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecificDateTripInformationFormComponent
  implements OnInit, OnDestroy, OnChanges {
  faTrashAlt = faTrashAlt;
  faStickyNote = faStickyNote;
  faCopy = faCopy;
  faPlus = faPlus;
  faInfoCircle = faInfoCircle;
  @Input()
  formGroup: FormGroup;
  @Input()
  serviceActionType: string;
  @Input()
  stepName: string;
  @Input()
  index: number;
  @Input()
  controlConfigs: SpecificDateFormFieldArray;
  @Input()
  actionConfig: SpecificDateActionConfig;
  @Input()
  disableDeleteButton: boolean;
  // We need to provide the parent service type.
  // Transportation is the default value.
  @Input()
  selectedService: ServiceType;

  @Input()
  currentStepIndex: number;

  @Output()
  duplicateFormGroup: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  deleteFormGroup: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  addFormGroup: EventEmitter<number> = new EventEmitter<number>();
  fieldType = SpecificDateFormFieldType;
  timeDropdownValues = generateABMReferralTimeOptions(30);

  transportationLocations$: Observable<HealtheSelectOption<any>[]> = of([]);
  productOptions$: Observable<CustomerServiceGroupConfiguration[]> = of([]);
  SpecificDateDynamicRowType = SpecificDateDynamicRowType;
  compareLocations = compareLocations;
  locationToolTips = {};
  private isAlive = true;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public makeAReferralService: MakeAReferralService,
    public confirmationModalService: ConfirmationModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get dynamicDateMode() {
    return this.formGroup.get('dynamicDateMode') || { value: 'dateRange' };
  }

  ngOnInit() {
    this.transportationLocations$ = this.store$.pipe(
      select(getApprovedLocations(this.selectedService)),
      map((locations) => {
        return locations.map((location) => ({
          label: referralLocationToFullString(location),
          value: location
        }));
      })
    );
    this.productOptions$ = this.store$.pipe(
      select(getDMECategoriesAndProducts),
      takeWhile(() => this.isAlive),
      distinctUntilChanged(
        (configs1, configs2) =>
          configs2.length === 0 && configs2.length < configs1.length
      ),
      map((configs) => {
        let list = [];
        if (configs[0]) {
          list = configs[0].groupConfigurations;
        }
        return list;
      })
    );
    this.store$
      .pipe(
        takeWhile(() => this.isAlive),
        select(getSpecificNotesByFormStateNameAndIndex, {
          formStateChild: this.stepName,
          useReturnedValues: false,
          index: this.index
        }),
        filter((note) => this.formGroup.get('notes').value !== note)
      )
      .subscribe((note) =>
        this.formGroup.get('notes').setValue(note, { emitEvent: false })
      );

    if (this.formGroup.contains('dynamicDateMode')) {
      let specificDateKeys = [];
      if (this.formGroup.contains('appointmentDate')) {
        specificDateKeys.push('appointmentDate');
      } else if (this.formGroup.contains('deliveryDate')) {
        specificDateKeys.push('deliveryDate');
      }

      specificDateKeys.forEach((key) => {
        if (
          this.formGroup.get('dynamicDateMode').value === 'dateRange' &&
          !this.formGroup.get(key).value
        ) {
          this.formGroup.get(key).disable();
          this.formGroup.get(key).reset();
        }
      });

      this.formGroup.get('dynamicDateMode').setValue('dateRange');
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  ngOnChanges(changes: SimpleChanges) {}

  getErrorMessage(
    errorMessages: { [p: string]: string } = {},
    formControlName: string
  ) {
    let ctrl = this.formGroup.get(formControlName);
    let errorKeys = Object.keys(errorMessages);
    for (let i = 0; i < errorKeys.length; i++) {
      if (ctrl.hasError(errorKeys[i])) {
        return errorMessages[errorKeys[i]];
      }
    }
    return '';
  }

  isRequiredField(field: string) {
    if (this.formGroup) {
      const form_field = this.formGroup.get(field);
      if (form_field) {
        if (!form_field.validator) {
          return false;
        }
        const validator = form_field.validator({} as AbstractControl);
        return validator && validator.required;
      }
    }
    return false;
  }

  addNotes(): void {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this ' + this.serviceActionType + ' request',
        this.formGroup.get('notes').value
      )
      .subscribe((notes) => {
        this.formGroup.get('notes').setValue(notes);
        this.formGroup.get('notes').markAsDirty();
        this.changeDetectorRef.detectChanges();
      });
  }

  duplicate(): void {
    this.duplicateFormGroup.emit(this.index);
  }

  delete(): void {
    this.deleteFormGroup.emit(this.index);
  }

  showAddLocationModal(matSelect: MatSelect): void {
    this.makeAReferralService
      .displayAddLocationModal({
        selectedServiceType: this.selectedService,
        enablePhysicianSpecialtyDropdown:
          this.selectedService === TRANSPORTATION_ARCH_TYPE
      })
      .afterClosed()
      .pipe(withLatestFrom(this.transportationLocations$))
      .subscribe(
        ([value, locationOptions]: [
          ClaimLocation,
          HealtheSelectOption<ClaimLocation>[]
        ]) => {
          // Transportation select is the default.
          if (this.selectedService !== TRANSPORTATION_ARCH_TYPE) {
            let newLocationSelected$ = new Subject<void>();
            this.transportationLocations$
              .pipe(takeUntil(newLocationSelected$))
              .subscribe(
                (newLocationOptions: HealtheSelectOption<ClaimLocation>[]) => {
                  this.selectAddedLocation(
                    matSelect,
                    value,
                    newLocationOptions,
                    newLocationSelected$
                  );
                }
              );
          } else {
            this.selectAddedLocation(matSelect, value, locationOptions);
          }
        }
      );
  }

  selectAddedLocation(
    matSelect: MatSelect,
    newLocation: ClaimLocation,
    locationOptions: HealtheSelectOption<ClaimLocation>[],
    newLocationSelected$?: Subject<void>
  ) {
    for (let locationOption of locationOptions) {
      if (referralLocationToFullString(newLocation) === locationOption.label) {
        matSelect.ngControl.control.setValue(locationOption.value);
        if (newLocationSelected$) {
          newLocationSelected$.next();
          newLocationSelected$.complete();
        }
        break;
      }
    }
  }

  multiSelectCompare(option, selection) {
    return isEqual(option, selection);
  }

  getInnerConfigType(
    innerConfig: SpecificDateFormField[] | SpecificDateDynamicRow
  ) {
    if (has(innerConfig, 'type')) {
      return (innerConfig as SpecificDateDynamicRow).type;
    }
    return 'Array';
  }

  setLocationToolTip(
    location: HealtheSelectOption<any>,
    formControlName: string
  ) {
    this.locationToolTips[formControlName] = location.label;
  }
}
