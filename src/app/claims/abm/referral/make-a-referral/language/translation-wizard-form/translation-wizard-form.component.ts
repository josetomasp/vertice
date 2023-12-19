import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first, map } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  DocumentTranslationFormState,
  DocumentTranslationSchedulingForm,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import {
  getFusionReferralOptions,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import { generateLanguageDateRangeForm } from '../generateLanguageDateRangeForm';
import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_TRANSLATION_STEP_NAME
} from '../language-step-definitions';

@Component({
  selector: 'healthe-translation-wizard-form',
  templateUrl: './translation-wizard-form.component.html',
  styleUrls: ['./translation-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(TranslationWizardFormComponent)]
})
export class TranslationWizardFormComponent extends WizardDateStepComponent
  implements OnInit {
  public languages$ = this.store$.pipe(
    select(getFusionReferralOptions),
    map((options) => options.languages.list)
  );
  LANGUAGE_ARCH_TYPE = LANGUAGE_ARCH_TYPE;
  /**
   * This field/value is not shown in the UI but is
   * required to submit a language referral
   */
  subTypeValues$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.Language,
        LANGUAGE_ARCH_TYPE
      ),
      'Document Translation'
    ),
    first()
  );
  faInfoCircle = faInfoCircle;
  booleanRadioValues: HealtheSelectOption<boolean>[] = [
    { label: 'No', value: false },
    { label: 'Yes', value: true }
  ];
  specificDateConfig = {
    formTitle: 'Translate Document Information',
    serviceActionType: 'Document Translation',
    stepName: this.stepName,
    addDateButtonLabel: 'Add Row',
    addLocationButtonLabel: 'ADD LOCATION',
    actionConfig: {
      enableAddNote: true,
      enableAddStop: false,
      enableDelete: true,
      enableDuplicate: false,
      deleteLabel: 'Delete Row'
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete Translate Document Information?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected Translate Document Information?'
    },
    controls: [
      [
        {
          formControlName: 'appointmentDate',
          type: SpecificDateFormFieldType.Date,
          formState: null,
          validatorOrOpts: [Validators.required],
          label: 'DATE',
          placeholder: 'MM/DD/YYYY',
          errorMessages: {
            required: 'Select a date for the session'
          }
        },
        {
          formControlName: 'appointmentAddress',
          formState: null,
          type: SpecificDateFormFieldType.Location,
          validatorOrOpts: [Validators.required],
          label: 'SERVICE ADDRESS',
          placeholder: 'Select a location',
          errorMessages: {
            required: "Select a value for 'Address' "
          }
        }
      ]
    ]
  };

  stepForm = new FormGroup({
    rushServiceNeeded: new FormControl(this.booleanRadioValues[0].value),
    paidAsExpense: new FormControl(this.booleanRadioValues[0].value),
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    language: new FormControl('Spanish'),
    subType: new FormControl(null)
  });

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      LANGUAGE_TRANSLATION_STEP_NAME,
      store$,
      confirmationModalService,
      generateLanguageDateRangeForm
    );
  }
  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe(
        ({
          language,
          rushServiceNeeded,
          paidAsExpense,
          subType,
          schedulingForm
        }: DocumentTranslationFormState) => {
          this.stepForm = new FormGroup({
            language: new FormControl(language),
            rushServiceNeeded: new FormControl(rushServiceNeeded),
            paidAsExpense: new FormControl(paidAsExpense),
            subType: new FormControl(subType),
            schedulingForm: this.loadSchedulingForm(
              schedulingForm,
              this.specificDateConfig
            )
          });
        }
      );
  }

  get schedulingForm() {
    return this.stepForm.get('schedulingForm') as FormGroup | FormArray;
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.subTypeValues$.subscribe((dataArr) => {
      if (dataArr.length > 0) {
        this.stepForm.get('subType').setValue(dataArr[0].value);
      } else {
        console.warn(
          `Didn't find a subType for Document Translation! This is probably going to break something...`
        );
      }
    });
  }

  private loadSchedulingForm(
    schedulingForm: DocumentTranslationSchedulingForm[],
    config: SpecificDateFormArrayConfig
  ): FormArray {
    return new FormArray(
      schedulingForm.map((lineItem) =>
        this.generateSpecificDateFormGroup<DocumentTranslationSchedulingForm>(
          config,
          lineItem
        )
      )
    );
  }
}
