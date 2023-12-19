import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { ComponentChanges } from '@shared/models/component-changes';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { UserInfo } from '../../../../user/store/models/user.models';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { Observable } from 'rxjs';
import { NavSearchState } from 'src/app/search-nav/store/reducers/nav-search.reducers';
import { SearchNavFormField } from '../../../shared/SearchNavTypes';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-authorizations-search-form',
  templateUrl: './authorizations-search-form.component.html',
  styleUrls: ['./authorizations-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchFormComponent extends DestroyableComponent
  implements OnInit, OnChanges {
  @Input()
  searchName: string;
  @Input()
  displaySearchName: boolean = true;
  @Input()
  simpleSearchFormConfig: SearchNavFormField[][];
  @Input()
  advancedSearchFormConfig: SearchNavFormField[][];
  @Input()
  userInfo: UserInfo;
  @Input()
  subTitle: string;
  @Input()
  subTitleListItems: string[];
  @Input()
  searchOptionsState$: Observable<NavSearchState>;

  @Input()
  alwaysShowErrors;

  @Input()
  warningMessage;

  @Input()
  defaultSearchFormValues: { [field: string]: any };

  @Input()
  formGroupValidations: ValidatorFn[];

  @Input()
  formGroupValidationErrorMessages: { [key: string]: string };

  @Output()
  formValuesChange: EventEmitter<any> = new EventEmitter();
  @Output()
  searchNow: EventEmitter<any> = new EventEmitter();

  formGroup: FormGroup = new FormGroup({});
  advancedShown: boolean = false;
  searchButtonClickedOnce = false;
  alertType = AlertType;

  constructor() {
    super();
  }

  getErrors(errorState) {
    if (errorState && this.formGroupValidationErrorMessages) {
      let errorMessage = Object.keys(errorState)
        .map((errorKey) => this.formGroupValidationErrorMessages[errorKey])
        .join('\n');
      return errorMessage ? errorMessage : '';
    }
    return '';
  }

  ngOnInit() {
    this.searchOptionsState$
      .pipe(
        first(
          (navState) => !!navState.navigationSearchesStates[this.searchName]
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((navState: NavSearchState) => {
        this.formValuesChange.emit(this.formGroup.getRawValue());
        if (!this.userInfo.internal) {
          this.searchNow.emit();
        }
      });
  }

  ngOnChanges(changes: ComponentChanges<AuthorizationsSearchFormComponent>) {
    // Just grouping the controls together so that the entire formGroup's
    //  valueChanges can be handled as one emission
    if (changes.simpleSearchFormConfig) {
      changes.simpleSearchFormConfig.currentValue.forEach(
        (searchFormFieldConfigRow) =>
          searchFormFieldConfigRow.forEach((searchFormFieldConfig) =>
            this.formGroup.addControl(
              searchFormFieldConfig.formControlName,
              searchFormFieldConfig.formState
            )
          )
      );
    }
    if (changes.formGroupValidations) {
      this.formGroup.setValidators(this.formGroupValidations);
    }
    if (changes.advancedSearchFormConfig) {
      changes.advancedSearchFormConfig.currentValue.forEach(
        (searchFormFieldConfigRow) =>
          searchFormFieldConfigRow.forEach((searchFormFieldConfig) =>
            this.formGroup.addControl(
              searchFormFieldConfig.formControlName,
              searchFormFieldConfig.formState
            )
          )
      );
    }

    this.formGroup.valueChanges
      .pipe(
        debounceTime(350),
        takeUntil(this.onDestroy$)
      )
      .subscribe((searchFormValues) =>
        this.formValuesChange.emit(searchFormValues)
      );

    if (this.alwaysShowErrors) {
      this.searchButtonClickedOnce = true;
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
    }
  }

  resetForm() {
    this.formGroup.reset(this.defaultSearchFormValues);
  }

  doSearch() {
    this.searchButtonClickedOnce = true;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
    } else {
      this.searchNow.emit();
    }
  }
}
