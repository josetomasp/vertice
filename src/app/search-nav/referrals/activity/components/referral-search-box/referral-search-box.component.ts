import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons';
import { NgxMatDrpComponent } from '@healthe/vertice-library';
import { HealtheSelectOption } from '@shared';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DateRangeValidators } from 'src/app/claims/abm/referral/make-a-referral/components/date-range-form/dateRangeValidators';
import {
  NAV_DATE_PICKER_OPTIONS,
  NAV_SEARCH_REFERRALS_LABELS
} from './referral-search-box.config';
import { first, takeUntil } from 'rxjs/operators';
import { NavSearchState } from 'src/app/search-nav/store/reducers/nav-search.reducers';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-referral-search-box',
  templateUrl: './referral-search-box.component.html',
  styleUrls: ['./referral-search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ReferralSearchBoxComponent extends DestroyableComponent
  implements OnInit, AfterViewInit {
  //#region   Public Properties
  @Input() dateRangeLabel: string = 'Date Received';
  @Input() form: FormGroup = new FormGroup({});
  @Input() resultsLoadedFirstTime: boolean = true;
  @Input() username;
  @Input() defaultStatus;
  @Input() defaultServiceType;
  @Input() defaultAssignedAdjuster;
  @Input() helperText: string;
  @Input() title: 'Referral Activity Search' | 'Pending Referrals Search';
  @Input() hideAdjustersDropdown: boolean = false;

  @Output()
  searchForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @ViewChild('dateRange', { static: true }) dateRange: NgxMatDrpComponent;

  faCalendarAlt = faCalendarAlt;
  infoI = faInfoCircle;
  datePickerOptions: any = NAV_DATE_PICKER_OPTIONS;
  isEmptyForm = false;
  //#endregion

  //#region   Observables
  @Input() serviceTypes: HealtheSelectOption<string>[];
  @Input() statuses: HealtheSelectOption<string>[];
  @Input() users: HealtheSelectOption<string>[] = [];
  @Input() customers: HealtheSelectOption<string>[];
  @Input() navSearchState$: Observable<NavSearchState> = of(null);

  filterSummary$: BehaviorSubject<string> = new BehaviorSubject(null);
  //#endregion

  private formInputLabels = NAV_SEARCH_REFERRALS_LABELS;
  private defaultValues: any;
  searchClickedOnce = false;

  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.navSearchState$
      .pipe(
        takeUntil(this.onDestroy$),
        first()
      )
      .subscribe(() => {
        if (this.title === 'Pending Referrals Search') {
          this.search();
        }
      });
    if (this.resultsLoadedFirstTime) {
      this.setFilterSummary();
    }
    this.form
      .get('doiStartDate')
      .setValidators(
        DateRangeValidators.maxDateRangeDifferentInMonths(
          12,
          'doiStartDate',
          'doiEndDate'
        )
      );

    this.form
      .get('doiEndDate')
      .setValidators(
        DateRangeValidators.maxDateRangeDifferentInMonths(
          12,
          'doiStartDate',
          'doiEndDate'
        )
      );
    if (this.form.get('customerId')) {
      this.helperText += ' You must select a customer.';
    }
    this.defaultValues = { ...this.form.getRawValue() };
  }

  //#endregion
  _dateRangeChange(range: { fromDate: Date; toDate: Date }) {
    if (range && range.fromDate && range.toDate) {
      if (
        moment(new Date(range.fromDate))
          .startOf('day')
          .toString() !==
        moment(new Date(this.form.get('doiStartDate').value))
          .startOf('day')
          .toString()
      ) {
        this.form.get('doiStartDate').setValue(range.fromDate.toString());
      }
      if (
        moment(new Date(range.toDate))
          .startOf('day')
          .toString() !==
        moment(new Date(this.form.get('doiEndDate').value))
          .startOf('day')
          .toString()
      ) {
        this.form.get('doiEndDate').setValue(range.toDate.toString());
      }
    }
  }

  search(): void {
    if (this.form.valid) {
      this.isEmptyForm = this.isFormEmpty();
      if (!this.isEmptyForm) {
        this.setFilterSummary();
        this.searchForm.emit(cloneDeep(this.form));
      }
    } else {
      this.searchClickedOnce = true;
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  isSearchDisabled() {
    return this.searchClickedOnce && this.form.invalid;
  }

  private isFormEmpty(): boolean {
    let empty = true;
    const values = this.form.value;
    for (let key in values) {
      if (values[key]) {
        empty = false;
        break;
      }
    }
    return empty;
  }

  private setFilterSummary(): void {
    let text = '';
    const humanReadableValues = this.getHumanReadableValuesByFormValues(
      this.form.value
    );
    const doiStartDate = humanReadableValues.doiStartDate
      ? new Date(humanReadableValues.doiStartDate).toLocaleDateString()
      : null;
    const doiEndDate = humanReadableValues.doiEndDate
      ? new Date(humanReadableValues.doiEndDate).toLocaleDateString()
      : null;
    Object.keys(humanReadableValues).forEach((key) => {
      if (this.formInputLabels[key]) {
        text += `${this.formInputLabels[key]} (${humanReadableValues[key]}), `;
      }
    });
    if (doiStartDate && doiEndDate) {
      text += `${this.dateRangeLabel} (${doiStartDate} - ${doiEndDate}), `;
    }

    this.filterSummary$.next(text.slice(0, -2));
  }

  //  For select boxes, we normally have a label/value pair.  The formGroup has the value, so home health would be HH and that would
  // appear in the summary.  So for the summary we need to use the label values, not the original form values.
  private getHumanReadableValuesByFormValues(formValue: {
    [key: string]: string;
  }): { [key: string]: string } {
    const humanReadableValues: { [key: string]: string } = {};
    Object.keys(formValue).forEach((key) => {
      if (formValue[key]) {
        if (key === 'assignedTo' && this.users) {
          humanReadableValues.assignedTo = this.users.find((pair) => {
            return pair.value === formValue.assignedTo;
          }).label;
        } else if (key === 'status' && this.statuses) {
          humanReadableValues.status = this.statuses.find((pair) => {
            return pair.value === formValue.status;
          }).label;
        } else if (key === 'serviceType' && this.serviceTypes) {
          humanReadableValues.serviceType = this.serviceTypes.find((pair) => {
            return pair.value === formValue.serviceType;
          }).label;
        } else {
          humanReadableValues[key] = formValue[key];
        }
      }
    });

    return humanReadableValues;
  }

  resetForm() {
    if (this.defaultValues.doiStartDate && this.defaultValues.doiEndDate) {
      this.dateRange.writeValue({
        fromDate: this.defaultValues.doiStartDate,
        toDate: this.defaultValues.doiEndDate
      });
    } else {
      this.dateRange.writeValue(null);
    }
    this.form.reset(this.defaultValues);
    this.form.get('serviceType').setValue(this.defaultServiceType);
    this.form.get('status').setValue(this.defaultStatus);
    this.form.get('assignedTo').setValue(this.defaultAssignedAdjuster);
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    // If the form has been restored with values, set the date picker to have the correct values displayed.
    if (!!this.form.get('doiStartDate').value) {
      this.dateRange.writeValue({
        fromDate: this.form.get('doiStartDate').value,
        toDate: this.form.get('doiEndDate').value
      });
    }
  }
}
