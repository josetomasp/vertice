import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { generateDateRangeForm } from '../../transportation/openAuthFormGenerators';
import { ApprovedLocationsFormComponent } from '../approved-locations-form/approved-locations-form.component';

export interface DateRangeFormConfig {
  noValidation?: string[];
}

@Component({
  selector: 'healthe-date-range-form',
  templateUrl: './date-range-form.component.html',
  styleUrls: ['./date-range-form.component.scss']
})
export class DateRangeFormComponent implements OnInit {
  @ViewChild(ApprovedLocationsFormComponent)
  locationsForm: ApprovedLocationsFormComponent;
  @Input()
  idPrefix: string = '';
  // TODO: remove once we know this is not needed or implement needed logic
  @Input('config')
  dateRangeConfig: DateRangeFormConfig = {};
  @Input() withTwoLocations;
  _parentFormGroup: FormGroup = generateDateRangeForm();

  @Input()
  set parentFormGroup(formGroup: FormGroup) {
    if (formGroup) {
      this._parentFormGroup = formGroup;
    }
  }

  get parentFormGroup(): FormGroup {
    return this._parentFormGroup;
  }

  @Input()
  serviceActionType: string = '';

  constructor() {}

  // TODO: remove once we know this is not needed or implement needed logic
  hasValidation(value: string) {
    return !(this.dateRangeConfig &&
      this.dateRangeConfig.noValidation != null &&
      this.dateRangeConfig.noValidation.indexOf(value) > -1);
  }

  ngOnInit() {
    if (false === this.hasValidation('tripsAuthorized')) {
      this._parentFormGroup.get('tripsAuthorized').setValidators(null);
    }

    if (false === this.hasValidation('unlimitedTrips')) {
      this._parentFormGroup.get('unlimitedTrips').setValidators(null);
    }
  }

  validateTrips() {
    this._parentFormGroup.get('tripsAuthorized').updateValueAndValidity();
    this._parentFormGroup.get('unlimitedTrips').updateValueAndValidity();
  }

  unlimitedTripsUpdated(event: MatCheckboxChange) {
    let tripsAuthorizedInput: AbstractControl = this._parentFormGroup.get(
      'tripsAuthorized'
    );
    if (event.checked) {
      tripsAuthorizedInput.setValue('');
      tripsAuthorizedInput.disable();
    } else {
      tripsAuthorizedInput.enable();
    }
    this.validateTrips();
  }
}
