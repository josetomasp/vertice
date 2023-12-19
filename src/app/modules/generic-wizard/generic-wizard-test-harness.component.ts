import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  GenericErrorCardState,
} from '@modules/generic-wizard/generic-wizard.models';
import { GenericWizardComponent } from '@modules/generic-wizard/generic-wizard/generic-wizard.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'healthe-generic-wizard-test-harness',
  template: `
    <div [formGroup]="formGroup">
      <healthe-textarea formControlName="vendorsList"></healthe-textarea>
      <select formControlName="serviceSelection">
        <option value="CBT">CBT</option>
        <option value="TEST_SERVICE">Test Service</option>
      </select>
    </div>
    <button (click)="setVendors()" mat-raised-button>SET VENDORS</button>
    <healthe-generic-wizard
      #wizard
      *ngIf="formGroup.get('serviceSelection').value"
      [serviceType]="formGroup.get('serviceSelection').value"
      [errorInfoCardState]="errors"
      (submitEvent)="submit()"
      (deleteService)="deleteService()"
    ></healthe-generic-wizard>
  `,
})
export class GenericWizardTestHarnessComponent
  implements OnInit, AfterViewInit
{
  formGroup = new FormGroup({
    serviceSelection: new FormControl('TEST_SERVICE'),
    vendorsList: new FormControl('')
  });
  errors: GenericErrorCardState;
  @ViewChild('wizard', { static: false, read: GenericWizardComponent })
  genericWizard: GenericWizardComponent;
  validationErrorSubscription: Subscription;

  ngOnInit() {}

  constructor() {}
  submit() {
    if (!this.validationErrorSubscription) {
      this.validationErrorSubscription =
        this.genericWizard.formValidationExtractorService.errorMessages$.subscribe(
          (messages) => {
            if (this.errors) {
              let cleanedErrors = this.errors;
              this.errors.errorInfoList = cleanedErrors.errorInfoList.filter(
                (error) => !error.errorCategories.includes('validation')
              );
              cleanedErrors.errorInfoList.push(
                ...messages.map((validationError) => {
                  return {
                    errorMessage: validationError.message,
                    errorCategories: ['validation'],
                    actions: [
                      {
                        actionLabel: 'GO TO FIELD',
                        actionCallback: () => {
                          this.genericWizard.goToStepByFormPath(
                            validationError.path
                          );
                          validationError.for.focus();
                        }
                      }
                    ]
                  };
                })
              );
            }
          }
        );
    }

    if (Math.random() * 10 > 5) {
      this.errors = {
        errorTitle: 'Something Went Wrong...',
        errorInfoList: [
          {
            errorMessage: "Something didn't work...",
            actions: [
              {
                actionCallback: () => {
                  this.genericWizard.clearErrors();
                  this.genericWizard.submit(
                    'You have successfully submitted this service referral Referral ID: f28jf38239f823-8923f98j3f823f-f8923fjj32',
                    "Please note that further communication regarding this referral must be directed towards the referral's assigned vendor."
                  );
                },
                actionLabel: 'RETRY'
              }
            ],
            errorCategories: ['server']
          }
        ]
      };
    } else {
      this.genericWizard.clearErrors();
      this.genericWizard.submit(
        'You have successfully submitted this service referral with Referral ID: f28jf38239f823-8923f98j3f823f-f8923fjj32',
        "Please note that further communication regarding this referral must be directed towards the referral's assigned vendor."
      );
    }
  }

  deleteService() {}

  ngAfterViewInit(): void {
    this.genericWizard.store
      .getOptionByFormControlName('vendors')
      .pipe(first())
      .subscribe((vendors) => {
        this.formGroup.get('vendorsList').setValue(JSON.stringify(vendors));
      });
  }
  setVendors() {
    this.genericWizard.store.setOptionsByFormControlName({
      formControlName: 'vendors',
      options: JSON.parse(this.formGroup.get('vendorsList').value)
    });
  }
}
