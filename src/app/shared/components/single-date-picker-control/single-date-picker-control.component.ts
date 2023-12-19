import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import { MatDateFormats } from '@angular/material/core';
import * as _moment from 'moment';
import { faArrowRight, faCalendarAlt } from '@fortawesome/pro-light-svg-icons';
import { Subscription } from 'rxjs';
import {
  HealtheUIComponent,
  NgxDrpOptions,
  RangeStoreService
} from '@healthe/vertice-library';
import { ConfigStoreService } from './config-store.service';
import { CalendarOverlayService } from './calendar-overlay.service';
import { DatePipe } from '@angular/common';

const moment = _moment;
const noop = (any?: any) => {};

export const dateFormat = 'MM/DD/YYYY';

const DATEPICKER_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SingleDatePickerControlComponent),
  multi: true
};

export const APP_dateFormatS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'monthYearLabel',
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

/**
 * TODO: Make this it's own module in the modules folder since this seems like a common control
 */
@Component({
  selector: 'healthe-single-date-picker-control',
  templateUrl: './single-date-picker-control.component.html',
  styleUrls: ['./single-date-picker-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CalendarOverlayService,
    RangeStoreService,
    ConfigStoreService,
    DatePipe,
    DATEPICKER_ACCESSOR_PROVIDER
  ]
})
export class SingleDatePickerControlComponent extends HealtheUIComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  @Input() triggerIcon: any;
  @Input()
  options: NgxDrpOptions = {} as NgxDrpOptions;

  @Output()
  readonly selectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public submit: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('calendarInput', { static: true })
  calendarInput;

  control: AbstractControl;
  dateRegex = /((\d{2})\/(\d{2})\/(\d{4}))/;
  faArrowRight = faArrowRight;
  faCalendarAlt = faCalendarAlt;
  idPrefix = 'single-date';
  selectedDate: string = '';

  DATE_INVALID_ERROR = 'Please enter a valid date MM/DD/YYYY';

  isDisabled: boolean;
  private isRequired: boolean;
  private rangeUpdate$: Subscription;

  //#region For ControlValueAccessor
  private onChange: (val: any) => any = noop;
  private onTouched = noop;
  //#endregion

  constructor(
    public elementRef: ElementRef,
    private changeDetectionRef: ChangeDetectorRef,
    private calendarOverlayService: CalendarOverlayService,
    private rangeStoreService: RangeStoreService,
    private configStoreService: ConfigStoreService,
    private datePipe: DatePipe,
    private injector: Injector
  ) {
    super(elementRef);
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();
    /**
     * Enforce this date format so that it's easier to manually enter a date
     */

    this.options.format = dateFormat;
    this.configStoreService.singleDateOptions = this.options;
    this.options.placeholder = this.options.placeholder || 'MM/DD/YYYY';

    this.rangeUpdate$ = this.rangeStoreService.rangeUpdate$.subscribe(
      (range) => {
        if (range.toDate) {
          this.selectedDate = moment(range.toDate)
            .format(dateFormat)
            .toString();
          this.selectedDateChanged.emit(range.toDate);
          this.onChange(range.toDate);
          if (range.userAction) {
            this.submit.emit(range.toDate);
          }
          this.changeDetectionRef.detectChanges();
        }
      }
    );

    this.changeDetectionRef.markForCheck();
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    this.control = ngControl.control;
    this.setDisabledState(status.equalsIgnoreCase('DISABLED'));
    ngControl.statusChanges.subscribe((status) => {
      this.setDisabledState(status.equalsIgnoreCase('DISABLED'));
      this.changeDetectionRef.detectChanges();
    });
    this.isRequired =
      this.control.validator &&
      this.control.validator({} as AbstractControl).required
        ? true
        : false;
    setTimeout(() => {
      if (this.control.value) {
        this.writeValue(this.control.value);
      }
      this.changeDetectionRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.rangeUpdate$) {
      this.rangeUpdate$.unsubscribe();
    }
  }
  //#endregion

  get value(): Date {
    return this.control.value;
  }

  set value(value: Date) {
    if ((value as any) === '') {
      value = null;
    }
    this.control.setValue(value);
    this.selectedDate = moment(value)
      .format(dateFormat)
      .toString();
  }

  //#region ControlValueAccessor Overrided methods
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: Date): void {
    if (!value) {
      if (this.isRequired) {
        this.onChange(undefined);
      } else {
        this.onChange(null);
      }
    } else if (value !== null) {
      this.selectedDate = moment(value)
        .format(dateFormat)
        .toString();
      this.rangeStoreService.updateRange(this.options.toMinMax.fromDate, value);
    } else {
      this.selectedDate = moment(value)
        .format(dateFormat)
        .toString();
      this.onChange(value);
    }
    this.changeDetectionRef.detectChanges();
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  //#endregion

  //#region   Public Methods
  dispatchSubmission(value: Date): void {
    if (value) {
      this.inputChange(value);
      if (this.control.valid) {
        this.submit.emit(this.rangeStoreService.toDate);
      }
    }
  }

  inputChange(value: Date): void {
    if (!value && this.isRequired) {
      this.onChange(undefined);
    } else if (!value && !this.isRequired) {
      this.onChange(null);
    } else {
      this.onChange(value);
    }
  }

  openCalendar(): void {
    if (!this.isDisabled) {
      this.calendarOverlayService.open(
        this.options.calendarOverlayConfig,
        this.calendarInput
      );
    }
  }

  submitDateRange(value: string): void {
    if (value.length > 9) {
      const dateValue = moment(new Date(value), dateFormat);
      if (dateValue.isValid()) {
        this.setControlDateValidity(true);
        this.inputChange(dateValue.toDate());
        const momentFromDate = moment(this.options.toMinMax.fromDate);
        this.rangeStoreService.updateRange(
          momentFromDate.toDate(),
          dateValue.toDate()
        );
      } else {
        this.setControlDateValidity(false);
      }
    } else if (value.length > 0) {
      this.setControlDateValidity(false);
    } else {
      this.inputChange(null);
    }
    this.changeDetectionRef.detectChanges();
  }

  setControlDateValidity(valid: boolean) {
    const validationErrors = {
      ...this.control.errors
    };
    if (!valid) {
      validationErrors['invalidDate'] = true;
    } else {
      delete validationErrors['invalidDate'];
    }
    this.control.setErrors(validationErrors);
  }

  touch(): void {
    this.onTouched();
  }
  //#endregion
}
