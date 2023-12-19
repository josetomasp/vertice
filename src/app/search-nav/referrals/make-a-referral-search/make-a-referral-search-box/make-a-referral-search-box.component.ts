import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons/faCalendarAlt';
import { NgxDrpOptions, NgxMatDrpComponent } from '@healthe/vertice-library';
import { HealtheSelectOption } from '@shared';
import { Observable } from 'rxjs';
import { CLAIM_VIEW_DATE_PICKER_OPTIONS } from 'src/app/claim-view/store/models/claim-view.models';
import { ClaimResult } from '../../../../claims/abm/referral/store/models/claimResult.model';

@Component({
  selector: 'healthe-make-a-referral-search-box',
  templateUrl: './make-a-referral-search-box.component.html',
  styleUrls: ['./make-a-referral-search-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeAReferralSearchBoxComponent implements OnInit, OnChanges {

  @Input() formGroup: FormGroup;
  @Input() isInternal: boolean;
  @Input() defaultCustomerCode: string;
  @Input() defaultStateOfVenue: string;
  @Input() savedForm: FormGroup;

  @Output()
  searchForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @ViewChild('dateOfInjury', { static: true }) dateOfInjury: NgxMatDrpComponent;
  @ViewChild('customerSelect') customerSelect: MatSelect;

  faCalendarAlt = faCalendarAlt;
  datePickerOptions: NgxDrpOptions = CLAIM_VIEW_DATE_PICKER_OPTIONS;
  isEmptyForm = false;

  @Input() claimsResults$: Observable<ClaimResult[]>;
  @Input() customers$: Observable<HealtheSelectOption<string>[]>;
  @Input() stateOfVenue$: Observable<HealtheSelectOption<string>[]>;

  INITIAL_FORM_VALUES = {
    customerCode: null,
    claimNumber: null,
    claimantLastName: null,
    claimantFirstName: null,
    doiStartDate: null,
    doiEndDate: null,
    stateOfVenue: 'All',
    ssn: null,
    officeCode: null,
    employer: null
  };

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group(this.INITIAL_FORM_VALUES);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.savedForm && changes.savedForm.currentValue) {
      const form: FormGroup = changes.savedForm.currentValue;
      this.formGroup = new FormGroup(form.controls);

      if (form.value.doiStartDate && form.value.doiEndDate) {
        this.dateOfInjury.writeValue({
          fromDate: form.value.doiStartDate,
          toDate: form.value.doiEndDate
        });
      }
    }

    if (changes.defaultCustomerCode && changes.defaultCustomerCode) {
      this.formGroup
        .get('customerCode')
        .setValue(changes.defaultCustomerCode.currentValue);
    }

    if (changes.defaultStateOfVenue && changes.defaultStateOfVenue) {
      this.formGroup
        .get('stateOfVenue')
        .setValue(changes.defaultStateOfVenue.currentValue);
    }
  }

  _dateRangeChange(range: { fromDate: Date; toDate: Date }) {
    this.formGroup
      .get('doiStartDate')
      .setValue(new Date(range.fromDate).toLocaleDateString());
    this.formGroup
      .get('doiEndDate')
      .setValue(new Date(range.toDate).toLocaleDateString());
  }

  search(): void {
    this.isEmptyForm = this.isFormEmpty();
    if (!this.isEmptyForm && this.formGroup.valid) {
      this.searchForm.emit(this.formGroup);
    }
    // Internal users only will have this select
    if (this.customerSelect) {
      this.formGroup.get('customerCode').markAsTouched();
    }
  }

  private isFormEmpty(): boolean {
    const values = this.formGroup.value;
    for (let key in values) {
      if (values[key]) {
        return false;
      }
    }
    return true;
  }

  submitDisabled() {
    // Internal users only will have this select
    if (this.customerSelect && this.formGroup.get('customerCode').touched) {
      return !this.formGroup.get('customerCode').valid;
    }
    return false;
  }

  resetForm() {
    this.formGroup.setValue(this.INITIAL_FORM_VALUES);
  }
}
