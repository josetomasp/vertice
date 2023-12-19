import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { UserInfo } from '../../../../user/store/models/user.models';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';
import { ComponentChanges } from '@shared/models/component-changes';
import {
  AllAuthorizationSearchFormValues
} from '../../all-authorizations/all-authorizations.store';
import { AuthorizationSearchFormField } from '../../authorizations-models';

@Component({
  selector: 'healthe-authorizations-search-form-standalone',
  templateUrl: './authorizations-search-form-standalone.component.html',
  styleUrls: ['./authorizations-search-form-standalone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchFormStandaloneComponent extends DestroyableComponent
  implements OnInit, OnChanges {
  @Input()
  searchName: string;
  @Input()
  displaySearchName: boolean = true;
  @Input()
  initialSearchFormValues: { [key: string]: any };
  @Input()
  simpleSearchFormConfig: AuthorizationSearchFormField<any, any>[][];
  @Input()
  advancedSearchFormConfig: AuthorizationSearchFormField<any, any>[][];
  @Input()
  userInfo: UserInfo;
  @Input()
  subTitle: string;
  @Input()
  subTitleListItems: string[] = [];

  // UNTESTED: Could be helpful for future searches using the warning message
  // @Input()
  // warningMessage;

  // UNTESTED: Could be helpful for future searches using error messages
  // @Input()
  // formGroupValidations: ValidatorFn[];

  // UNTESTED: Could be helpful for future searches using error messages
  // @Input()
  // formGroupValidationErrorMessages: { [key: string]: string };

  @Output()
  searchNow: EventEmitter<AllAuthorizationSearchFormValues> = new EventEmitter();

  formGroup: FormGroup = new FormGroup({});
  defaultValues: AllAuthorizationSearchFormValues = {
    assignedAdjuster: '',
    authorizationType: '',
    claimNumber: '',
    claimantFirstName: '',
    claimantLastName: ''
  };
  advancedShown: boolean = false;
  searchButtonClickedOnce = false;
  alertType = AlertType;

  constructor() {
    super();
  }

  // UNTESTED: Could be helpful for future searches using error messages
  // getErrors(errorState) {
  //   if (errorState && this.formGroupValidationErrorMessages) {
  //     let errorMessage = Object.keys(errorState)
  //       .map((errorKey) => this.formGroupValidationErrorMessages[errorKey])
  //       .join('\n');
  //     return errorMessage ? errorMessage : '';
  //   }
  //   return '';
  // }

  ngOnInit() {
  }

  ngOnChanges(changes: ComponentChanges<AuthorizationsSearchFormStandaloneComponent>) {
    if (changes.simpleSearchFormConfig || changes.advancedSearchFormConfig) {
      this.initializeFormControls();
    }
    // UNTESTED: Could be helpful for future searches using error messages
    // if (changes.formGroupValidations) {
    //   this.formGroup.setValidators(this.formGroupValidations);
    // }
  }

  resetForm() {
    this.formGroup.reset(this.defaultValues);
  }

  doSearch() {
    this.searchButtonClickedOnce = true;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
    } else {
      this.searchNow.emit(this.formGroup.value);
    }
  }

  initializeFormControls() {
    this.formGroup = new FormGroup({});
    this.simpleSearchFormConfig.forEach((searchFormFieldConfigRow) =>
      searchFormFieldConfigRow.forEach((searchFormFieldConfig) => {
        this.formGroup.addControl(searchFormFieldConfig.formControlName, new FormControl(
          this.initialSearchFormValues[searchFormFieldConfig.formControlName],
          searchFormFieldConfig.validatorOrOpts
        ));
        this.defaultValues[searchFormFieldConfig.formControlName] = searchFormFieldConfig.defaultValue;
      })
    );

    if (this.advancedSearchFormConfig) {
      this.advancedSearchFormConfig.forEach((searchFormFieldConfigRow) =>
        searchFormFieldConfigRow.forEach((searchFormFieldConfig) => {
          this.formGroup.addControl(searchFormFieldConfig.formControlName, new FormControl(
            this.initialSearchFormValues[searchFormFieldConfig.formControlName],
            searchFormFieldConfig.validatorOrOpts
          ));
          this.defaultValues[searchFormFieldConfig.formControlName] = searchFormFieldConfig.defaultValue;
        })
      );
    }
  }

  getSpecificControlByName(formControlName: string): FormControl {
    return this.formGroup.get(formControlName) as FormControl;
  }
}
