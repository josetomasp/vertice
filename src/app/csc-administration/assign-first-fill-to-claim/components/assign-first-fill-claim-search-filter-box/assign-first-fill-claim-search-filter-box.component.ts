import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirstFillClaimSearchFormValues } from '../../store/assign-first-fill-to-claim.reducer';
import { firstFillClaimSearchValidator } from './assign-first-fill-claim-search-form.validator';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'healthe-assign-first-fill-claim-search-filter-box',
  templateUrl: './assign-first-fill-claim-search-filter-box.component.html',
  styleUrls: ['./assign-first-fill-claim-search-filter-box.component.scss']
})
export class AssignFirstFillClaimSearchFilterBoxComponent implements OnInit {
  @Input()
  defaultSearchFormValues$: Observable<FirstFillClaimSearchFormValues>;
  @Output()
  executeSearch: EventEmitter<
    FirstFillClaimSearchFormValues
  > = new EventEmitter<FirstFillClaimSearchFormValues>();

  claimSearchFormGroup: FormGroup = this.formBuilder.group(
    this.getInitialFormGroupValues(),
    {
      validators: firstFillClaimSearchValidator
    }
  );

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.defaultSearchFormValues$
      .pipe(
        filter(
          (defaultSearchFormValues) =>
            !!defaultSearchFormValues.claimantFirstName &&
            !!defaultSearchFormValues.claimantLastName
        ),
        first()
      )
      .subscribe((defaultSearchFormValues) => {
        // Default search form values are from the firstFillsToAssign's first returned item
        this.claimSearchFormGroup.setValue(defaultSearchFormValues);
        this.searchButtonClicked();
      });
    this.claimSearchFormGroup.markAllAsTouched();
  }

  public searchButtonClicked(): void {
    this.executeSearch.next(this.claimSearchFormGroup.value);
  }

  public resetButtonClicked(): void {
    this.claimSearchFormGroup.patchValue(this.getInitialFormGroupValues());
  }

  getInitialFormGroupValues() {
    return {
      claimNumber: '',
      claimantFirstName: '',
      claimantLastName: '',
      claimantSsn: ''
    };
  }
}
