import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgxDrpOptions } from '@healthe/vertice-library';
import { HealtheSelectOption } from '@shared';
import { has } from 'lodash';
import { isObservable, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DateRangeValidators } from '../date-range-form/dateRangeValidators';
import {
  dmeNotesValidation,
  dmeOtherValidation
} from './specific-date-trip-information-form/components/hcpc-and-product-select-switch/hcpc-and-product-select-switch.validators';
import * as _moment from 'moment';

const moment = _moment;

export enum SpecificDateFormFieldType {
  Date,
  Time,
  Location,
  Select,
  MultiSelect,
  Number,
  Checkbox,
  Text,
  DateRange,
  SelectVirtualScroll // Currently only used for a virtual scroll select implementation in authorizations-search-form-field-switch.component.ts
}

export interface SpecificDateFormField<O = any, C = any> {
  type: SpecificDateFormFieldType;
  label: string;
  tooltip?: string;
  placeholder?: string;
  formControlName: string;
  compareWith?: (option: O, selection: O) => boolean;
  options?: Observable<HealtheSelectOption<O>[]>;
  errorMessages?: { [key: string]: string };
  formState?: any;
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  componentConfig?: C;
  hideNumberInputSpinner?: boolean;
  selectPanelClass?: string;
}

export interface SpecificDateActionConfig {
  enableAddNote: boolean;
  enableDuplicate: boolean;
  enableAddStop: boolean;
  enableDelete: boolean;
  deleteLabel: string;
}

export type SpecificDateFormFieldArray = (
  | SpecificDateFormField[]
  | HHSingleAndRangeSwitch)[];

export interface SpecificDateFormArrayConfig {
  formTitle: string;
  addLocationButtonLabel?: string;
  hideAddLocationButton?: boolean;
  addDateButtonLabel: string;
  serviceActionType: string;
  stepName: string;
  roundTripConfig?: {
    fromAddressFormControlName: string;
    toAddressFormControlName: string;
    appointmentTypeFormControlName: string;
    appointmentTimeFormControlName: string;
    pickupDateFormControlName: string;
  };
  deleteItemModal?: {
    deleteItemTitle: string;
    deleteItemMessage: string;
  };
  actionConfig: SpecificDateActionConfig;
  controls: SpecificDateFormFieldArray;
}

export enum SpecificDateDynamicRowType {
  HHSingleAndRangeSwitch,
  DMESingleAndRangeSwitch,
  HCPCAndProductSelectSwitch
}

export interface SpecificDateDynamicRow {
  type: SpecificDateDynamicRowType;
  controls: SpecificDateFormField<any, any>[];
}

export class HCPCAndProductSelectSwitch extends Array
  implements SpecificDateDynamicRow {
  type = SpecificDateDynamicRowType.HCPCAndProductSelectSwitch;
  controls = [
    {
      type: SpecificDateFormFieldType.Select,
      label: 'SELECT PRODUCT BY?',
      formControlName: 'productSelectionMode',
      placeholder: '',
      formState: 'category'
    },
    // HCPC
    {
      type: SpecificDateFormFieldType.Text,
      label: 'HCPC',
      formControlName: 'hcpc',
      errorMessages: {
        required: 'Enter a HCPC'
      },
      placeholder: 'Enter',
      validatorOrOpts: [Validators.required]
    },
    // Product Category
    {
      type: SpecificDateFormFieldType.Select,
      label: 'PRODUCT CATEGORY',
      formControlName: 'category',
      placeholder: 'Product Category',
      validatorOrOpts: [Validators.required],
      errorMessages: {
        required: 'Select a product category'
      }
    },
    {
      type: SpecificDateFormFieldType.Select,
      label: 'PRODUCT',
      formControlName: 'product',
      placeholder: 'Product',
      validatorOrOpts: [Validators.required, dmeOtherValidation],
      errorMessages: {
        required: 'Select a product'
      }
    }
  ];
}

export class DMESingleAndRangeSwitch extends Array
  implements SpecificDateDynamicRow {
  type = SpecificDateDynamicRowType.DMESingleAndRangeSwitch;
  controls = [
    {
      type: SpecificDateFormFieldType.Select,
      label: 'DATE RANGE OR SINGLE DATE?',
      formControlName: 'dynamicDateMode',
      placeholder: '',
      formState: 'dateRange'
    },
    // Date Range Mode
    {
      type: SpecificDateFormFieldType.Date,
      label: 'DELIVERY START DATE',
      formControlName: 'startDate',
      errorMessages: {
        required: 'Enter a start date',
        invalidDateRange: 'End Date cannot be before Start Date'
      },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [
        Validators.required,
        DateRangeValidators.startDateValidation
      ]
    },
    {
      type: SpecificDateFormFieldType.Date,
      label: 'DELIVERY END DATE',
      formControlName: 'endDate',
      errorMessages: {
        required: 'Enter an end date',
        invalidDateRange: 'End Date cannot be before Start Date'
      },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [
        Validators.required,
        DateRangeValidators.endDateValidation
      ]
    },
    // Specific Date
    {
      type: SpecificDateFormFieldType.Date,
      label: 'DELIVERY DATE',
      formControlName: 'deliveryDate',
      errorMessages: {
        required: 'Enter a delivery date'
      },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [Validators.required]
    },
    // Shared
    {
      type: SpecificDateFormFieldType.Location,
      label: 'DELIVERY ADDRESS',
      formControlName: 'deliveryAddress',
      errorMessages: {
        required: 'Select a delivery address'
      },
      placeholder: 'Select a delivery address',
      validatorOrOpts: [Validators.required]
    },
    {
      type: SpecificDateFormFieldType.Number,
      label: 'QTY',
      formControlName: 'quantity',
      placeholder: 'QTY',
      validatorOrOpts: [Validators.required],
      errorMessages: {
        required: 'Enter a quantity'
      }
    },
    {
      type: SpecificDateFormFieldType.Checkbox,
      label: 'Rental?',
      formControlName: 'rental',
      placeholder: 'Rental?'
    }
  ];
}

export class HHSingleAndRangeSwitch extends Array
  implements SpecificDateDynamicRow {
  type = SpecificDateDynamicRowType.HHSingleAndRangeSwitch;
  controls = [
    {
      type: SpecificDateFormFieldType.Select,
      label: 'DATE RANGE OR SINGLE DATE?',
      formControlName: 'dynamicDateMode',
      placeholder: '',
      formState: 'dateRange'
    },
    // Date Range Mode
    {
      type: SpecificDateFormFieldType.Date,
      label: 'START DATE',
      formControlName: 'startDate',
      errorMessages: {
        required: 'Enter a start date',
        invalidDateRange: 'End Date cannot be before Start Date'
      },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [
        Validators.required,
        DateRangeValidators.startDateValidation
      ]
    },
    {
      type: SpecificDateFormFieldType.Date,
      label: 'END DATE',
      formControlName: 'endDate',
      errorMessages: {
        required: 'Enter an end date',
        invalidDateRange: 'End Date cannot be before Start Date'
      },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [
        Validators.required,
        DateRangeValidators.endDateValidation
      ]
    },
    {
      type: SpecificDateFormFieldType.Number,
      label: 'NUMBER OF VISITS',
      formControlName: 'numberOfVisits',
      errorMessages: {
        min: 'Enter a valid number of session greater than 0'
      },
      placeholder: 'Enter Quantity',
      validatorOrOpts: [Validators.min(1)]
    },
    // Single Date Mode
    {
      type: SpecificDateFormFieldType.Date,
      label: 'APPOINTMENT DATE',
      formControlName: 'appointmentDate',
      errorMessages: { required: 'Enter an appointment date' },
      placeholder: 'MM/DD/YYYY',
      validatorOrOpts: [Validators.required]
    }
  ];
}

export class SpecificDateControlConfigBuilder {
  controls: SpecificDateFormFieldArray = [];

  staticRow(
    rowbuildCb: (controlBuilder: FormArrayControlRowBuilder) => void,
    rowIndex: number = null
  ): SpecificDateControlConfigBuilder {
    let row;
    if (rowIndex != null && this.controls[rowIndex]) {
      row = this.controls[rowIndex];
    } else {
      row = [];
      this.controls.push(row);
    }
    rowbuildCb(new FormArrayControlRowBuilder(row));
    return this;
  }

  dynamicRow(type: SpecificDateDynamicRowType) {
    switch (type) {
      case SpecificDateDynamicRowType.HCPCAndProductSelectSwitch:
        this.controls.push(new HCPCAndProductSelectSwitch());
        break;
      case SpecificDateDynamicRowType.DMESingleAndRangeSwitch:
        this.controls.push(new DMESingleAndRangeSwitch());
        break;
      case SpecificDateDynamicRowType.HHSingleAndRangeSwitch:
        this.controls.push(new HHSingleAndRangeSwitch());
    }
    return this;
  }

  getEmptyFormGroup(
    {
      enableAddNotes,
      groupValidations
    }: { enableAddNotes: boolean; groupValidations: ValidatorFn[] } = {
      enableAddNotes: true,
      groupValidations: []
    }
  ): FormGroup {
    let formGroupControls = this.getEmptyFormGroupShared();
    if (enableAddNotes) {
      formGroupControls['notes'] = new FormControl('');
    }
    return new FormGroup(formGroupControls, { validators: groupValidations });
  }

  getEmptyDmeFormGroup(
    {
      enableAddNotes,
      groupValidations
    }: { enableAddNotes: boolean; groupValidations: ValidatorFn[] } = {
      enableAddNotes: true,
      groupValidations: []
    }
  ): FormGroup {
    let formGroupControls = this.getEmptyFormGroupShared();
    if (enableAddNotes) {
      formGroupControls['notes'] = new FormControl('', [dmeNotesValidation]);
    }
    return new FormGroup(formGroupControls, { validators: groupValidations });
  }

  _flatten(): SpecificDateFormField<any, any>[] {
    const flattened = [];
    for (const row of this.controls) {
      for (const control of row) {
        flattened.push(control);
      }
    }
    return flattened;
  }

  getControls(): SpecificDateFormField<any, any>[][] {
    return this.controls;
  }

  private getEmptyFormGroupShared() {
    const formGroupControls = {};

    for (let i = 0; i < this.controls.length; i++) {
      let controlRow = this.controls[i];

      if (has(controlRow, 'type')) {
        controlRow = (controlRow as SpecificDateDynamicRow).controls;
      }
      for (let {
        formControlName,
        formState,
        validatorOrOpts,
        asyncValidator
      } of controlRow) {
        if (isObservable(formState)) {
          formState
            .pipe(first())
            .subscribe((initialState) => (formState = initialState));
        }
        formGroupControls[formControlName] = new FormControl(
          formState,
          validatorOrOpts,
          asyncValidator
        );
      }
    }
    return formGroupControls;
  }
}

export class FormArrayControlRowBuilder {
  constructor(public row: SpecificDateFormField[]) {}

  get() {
    return this.row;
  }

  control(controlDef: SpecificDateFormField): FormArrayControlRowBuilder {
    this.row.push(controlDef);
    return this;
  }

  dateRange(
    formControlName: string,
    label: string,
    dateRangeConfig: NgxDrpOptions = FORM_GRID_BUILDER_DATE_RANGE_DEFAULT_CONFIG
  ) {
    this.row.push({
      type: SpecificDateFormFieldType.DateRange,
      formControlName,
      label,
      componentConfig: dateRangeConfig
    } as SpecificDateFormField<any, NgxDrpOptions>);
    return this;
  }

  text(
    formControlName: string,
    label: string,
    placeholder?: string,
    required = false
  ) {
    this.row.push({
      formControlName,
      label,
      placeholder: placeholder ? placeholder : label,
      type: SpecificDateFormFieldType.Text,
      validatorOrOpts: required ? [Validators.required] : undefined
    });
    return this;
  }

  select<T>(
    formControlName: string,
    label: string,
    options$: Observable<HealtheSelectOption<T>[]>,
    placeholder?: string,
    required = false,
    errorMessages?: { [key: string]: string }
  ) {
    this.row.push({
      formControlName,
      label,
      placeholder: placeholder ? placeholder : label,
      type: SpecificDateFormFieldType.Select,
      validatorOrOpts: required ? [Validators.required] : undefined,
      options: options$,
      errorMessages
    });
    return this;
  }
}

export const FORM_GRID_BUILDER_DATE_RANGE_DEFAULT_CONFIG: NgxDrpOptions = {
  calendarOverlayConfig: {
    panelClass: 'ngx-mat-drp-overlay',
    hasBackdrop: true,
    backdropClass: 'ngx-mat-drp-overlay-backdrop',
    shouldCloseOnBackdropClick: true
  },
  presets: [
    {
      presetLabel: 'Past Month',
      range: {
        fromDate: moment()
          .subtract(1, 'month')
          .toDate(),
        toDate: moment().toDate()
      }
    },
    {
      presetLabel: 'Past 3 Months',
      range: {
        fromDate: moment()
          .subtract(3, 'month')
          .toDate(),
        toDate: moment().toDate()
      }
    },
    {
      presetLabel: 'Past 6 Months',
      range: {
        fromDate: moment()
          .subtract(6, 'month')
          .toDate(),
        toDate: moment().toDate()
      }
    },
    {
      presetLabel: 'Past Year',
      range: {
        fromDate: moment()
          .subtract(1, 'year')
          .toDate(),
        toDate: moment().toDate()
      }
    }
  ],
  format: 'mediumDate'
};
