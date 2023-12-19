import { Component, Optional } from '@angular/core';
import { GenericWizardStore } from '@modules/generic-wizard/generic-wizard.store';
import { concatAll, map, mergeMap, startWith } from 'rxjs/operators';
import {
  GenericFormFieldType,
  GenericStepType
} from '@modules/generic-wizard/generic-wizard.models';
import { MatStepper } from '@angular/material/stepper';
import { asapScheduler, scheduled } from 'rxjs';

enum GenericReviewSectionType {
  CompositeReviewSection,
  SimpleReviewSection
}

interface SimpleReviewSection {
  label: string;
  value: any;
}

interface CompositeReviewSection {
  reviewTitle: string;
}

export interface GenericReviewModel {
  reviewSections: CompositeReviewSection | SimpleReviewSection;
}

@Component({
  selector: 'healthe-generic-review-step',
  templateUrl: './generic-review-step.component.html',
  styleUrls: ['./generic-review-step.component.scss']
})
export class GenericReviewStepComponent<FormModel = { [key: string]: any }> {

  editSectionEnabled: boolean = false;

  constructor(
    public store: GenericWizardStore<FormModel>,
    @Optional() public matStepper: MatStepper
  ) {
    this.editSectionEnabled = !!matStepper;
  }

  reviewModel$ = this.store.formGroup.valueChanges.pipe(
    startWith(this.store.formGroup.value),
    mergeMap((formValues: FormModel) => {
      return this.store.vm$.pipe(
        map(({ steps, optionMap }) => {
          const reviewSections = [];
          steps
            .filter((step) => step.stepType !== GenericStepType.ReviewStep)
            .forEach((step, stepIndex) => {
              if (step.stepType == GenericStepType.ConfigurableStep) {
                const hydratedFormFields = step.formSections.map(
                  ({ formFieldConfigs }) => {
                    return formFieldConfigs.map((innerFields) => {
                      return innerFields.map((field) => {
                        (field as any).value =
                          formValues[step.stepName][field.formControlName];
                        return {
                          value:
                            formValues[step.stepName][field.formControlName],
                          label: field.reviewLabel ?? field.label,
                          formFieldType: field.formFieldType
                        };
                      });
                    });
                  }
                );
                reviewSections.push({
                  reviewType: GenericReviewSectionType.CompositeReviewSection,
                  stepIndex: stepIndex,
                  title: step.stepTitle,
                  hydratedFormFields
                });
              } else {
                switch (step.stepType) {
                  case GenericStepType.VendorStep:
                    reviewSections.push({
                      reviewType: GenericReviewSectionType.SimpleReviewSection,
                      label: step.stepTitle,
                      stepIndex: stepIndex,
                      type: GenericFormFieldType.MultiSelect,
                      value: formValues[step.stepName].map((valueName) => {
                        const optionIndex = optionMap[step.stepName]?.findIndex(
                          (option) => option.value === valueName
                        );
                        return (
                          optionMap[step.stepName][optionIndex]?.label ?? valueName
                        );
                      })
                    });
                    break;
                  case GenericStepType.DocumentStep:
                    reviewSections.push({
                      reviewType: GenericReviewSectionType.SimpleReviewSection,
                      label: step.stepTitle,
                      stepIndex: stepIndex,
                      type: GenericFormFieldType.MultiSelect,
                      value: formValues[step.stepName].map(({ file }) => {
                        return file.name;
                      })
                    });
                    break;
                }
              }
            });
          return reviewSections;
        })
      );
    })
  );
  public readonly GenericReviewSectionType = GenericReviewSectionType;

  goToSection(section: any) {
    if (this.editSectionEnabled) {
      this.matStepper.steps.get(section.stepIndex).select();
    }
  }
}
