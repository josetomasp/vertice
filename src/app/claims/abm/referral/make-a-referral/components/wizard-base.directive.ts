import {
  AfterViewInit,
  Directive,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatExpansionPanel } from '@angular/material/expansion';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { find } from 'lodash';
import { first, map, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  saveAsDraft,
  SetSectionStatus
} from '../../store/actions/make-a-referral.actions';
import {
  ReferralSubmitMessage,
  SubServiceStep,
  WizardBaseStepConfig,
  WizardStep
} from '../../store/models/make-a-referral.models';
import {
  getDraftReferralId,
  getFormState,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../store/selectors/makeReferral.selectors';
import { WizardBaseStepDirective } from './wizard-base-step.directive';
import { HealtheWizard } from './wizard.interface';
import { SubmitConfirmationModalComponent } from './submit-confirmation-modal/submit-confirmation-modal.component';
import {
  getSuccessfulServices,
  isSubmittingReferrals
} from '../../store/selectors/shared-make-a-referral.selectors';
import { combineLatest, zip } from 'rxjs';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import { MatDialog } from '@angular/material/dialog';
import { FusionServiceName } from '../../store/models/fusion/fusion-make-a-referral.models';
import { MakeAReferralHelperService } from '../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getClaimBannerFields } from '@shared/store/selectors/claim.selectors';

@Directive()
export abstract class WizardBaseDirective
  extends DestroyableComponent
  implements OnInit, HealtheWizard, AfterViewInit
{
  subServiceSteps: SubServiceStep[] = [];
  stepperCompleted = false;
  sharedForm: FormGroup;
  MAKE_A_REFERRAL_SECTION_ID = 'make-a-referral-review-section-';
  claimNumber: string;
  claimantName: string;

  @ViewChild(MatStepper) stepper: MatStepper;
  selectedServiceTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(this.serviceName)),
    map((services) =>
      services.map((name) => find(this.wizardStepDefinitions, { name }))
    )
  );
  stepWizardForm = new FormGroup({});
  @ViewChildren(MatStep) matSteps: QueryList<MatStep>;

  claimNumber$ = this.store$.pipe(first(), select(getDecodedClaimNumber));
  customerId$ = this.store$.pipe(first(), select(getDecodedCustomerId));
  formState$ = this.store$.pipe(first(), select(getFormState));
  draftReferralId$ = this.store$.pipe(first(), select(getDraftReferralId));
  referralLevelNotes$ = this.store$.pipe(select(getReferralLevelNotes()));

  submitMessage$ = zip(
    this.customerId$,
    this.claimNumber$,
    this.draftReferralId$,
    this.formState$,
    this.referralLevelNotes$.pipe(first())
  );

  isServiceSuccessfullySubmitted$ = this.store$.pipe(
    select(getSuccessfulServices),
    map((services) => services.includes(this.serviceName))
  );

  protected constructor(
    public wizardStepDefinitions: WizardStep[],
    public wizardStepConfig: WizardBaseStepConfig,
    public sectionStation: any,
    public serviceName: string,
    public store$: Store<RootState>,
    public expansionPanel: MatExpansionPanel,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar
  ) {
    super();
  }

  @ViewChildren(WizardBaseStepDirective)
  set wizardSteps(steps: QueryList<WizardBaseStepDirective>) {
    steps.forEach((step: WizardBaseStepDirective, index) => {
      const matStep = this.matSteps.find((s, stepIndex) => stepIndex === index);
      step.stepIndex = index;
      this.stepWizardForm.setControl(step.stepName, step.stepForm);
      matStep.stepControl = step.stepForm as any;
    });
  }

  ngOnInit() {
    this.subServiceSteps = this.generateSubServiceSteps();
    combineLatest([
      this.store$.pipe(select(getDecodedClaimNumber)),
      this.store$.pipe(select(getClaimBannerFields))
    ])
      .pipe(first())
      .subscribe(([claim, fields]) => {
        this.claimNumber = claim;
        this.claimantName =
          fields.find((f) => f.elementName === 'claimantName')?.value ?? '';
      });
  }

  ngAfterViewInit() {
    this.registeredEvents();
  }

  previous() {
    if (this.stepper.selectedIndex === 0) {
      this.store$.dispatch(new SetSectionStatus(this.sectionStation));
    } else {
      this.stepper.previous();
    }
  }

  continue() {
    this.stepper.next();
  }

  getAtTypeDiscriminator(): string {
    switch (this.serviceName) {
      case FusionServiceName.Transportation:
        return 'transportation';
      case FusionServiceName.Diagnostics:
        return 'diagnostics';
      case FusionServiceName.DME:
        return 'dme';
      case FusionServiceName.HomeHealth:
        return 'homeHealth';
      case FusionServiceName.Language:
        return 'language';
      case FusionServiceName.PhysicalMedicine:
        return 'physicalMedicine';
      default:
        return 'unsupported';
    }
  }

  submit() {
    this.submitMessage$
      .pipe(first())
      .subscribe(
        ([
          customerId,
          claimNumber,
          referralId,
          formState,
          referralLevelNotes
        ]) => {
          this.matDialog.open(SubmitConfirmationModalComponent, {
            autoFocus: false,
            width: '750px',
            height: '225px',
            minHeight: '220px',
            disableClose: true,
            data: {
              submitMessage: {
                saveAsDraft: false,
                claimNumber,
                referralId,
                customerId,
                formValues: {
                  '@type': this.getAtTypeDiscriminator(),
                  ...formState
                },
                referralLevelNotes
              },
              submittingReferral$: this.store$.pipe(
                select(isSubmittingReferrals)
              )
            }
          });
        }
      );
  }

  saveReferralAsDraft() {
    this.submitMessage$
      .pipe(first())
      .subscribe(
        ([
          customerId,
          claimNumber,
          referralId,
          formState,
          referralLevelNotes
        ]) => {
          const submitMessage: ReferralSubmitMessage = {
            saveAsDraft: true,
            customerId,
            referralId,
            claimNumber,
            formValues: {
              '@type': this.getAtTypeDiscriminator(),
              ...formState
            },
            referralLevelNotes
          };

          if (this.serviceName === FusionServiceName.Transportation) {
            this.store$.dispatch(saveAsDraft({ submitMessage }));
          } else {
            this.makeAReferralHelperService.saveFusionDraft(submitMessage);
          }
        }
      );
  }

  isSubmitDisabled(): boolean {
    return !(this.stepWizardForm && this.stepWizardForm.valid);
  }

  showCloseButton() {
    if (this.stepper && this.stepper.selected) {
      if (this.stepper.selectedIndex === this.stepper._steps.length - 1) {
        return true;
      }
    }
    return false;
  }

  private generateSubServiceSteps(): SubServiceStep[] {
    const steps: SubServiceStep[] = [];
    this.selectedServiceTypes$
      .pipe(first())
      .subscribe((services: WizardStep[]) => {
        services.forEach((service, i) => {
          if (service) {
            steps.push({
              label: service.label,
              name: service.name,
              iconClass: 'default',
              labelClass: i === 0 ? 'selected' : 'default'
            });
          }
        });

        steps.push({
          label: 'Vendors',
          name: this.wizardStepConfig.vendorsName,
          iconClass: 'default',
          labelClass: 'default'
        });

        steps.push({
          label: 'Documents',
          name: this.wizardStepConfig.documentsName,
          iconClass: 'default',
          labelClass: 'default'
        });

        steps.push({
          label: 'Review',
          name: this.wizardStepConfig.reviewName,
          iconClass: 'default',
          labelClass: 'default'
        });
      });

    return steps;
  }

  private registeredEvents(): void {
    const subServiceSteps: SubServiceStep[] = this.subServiceSteps;
    this.stepper.selectionChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (selection: {
          previouslySelectedIndex: number;
          previouslySelectedStep: MatStep;
          selectedIndex: number;
          selectedStep: MatStep;
        }) => {
          this.stepperCompleted = this.isStepperValid();
          const previousIndex = selection.previouslySelectedIndex;
          const reviewStepIndex = subServiceSteps.length - 1;

          // For Previous Step Icon and Label
          this.stepHeaderValidation(
            selection.previouslySelectedStep,
            previousIndex
          );
          // For Selected Step Label
          subServiceSteps[selection.selectedIndex].labelClass = 'selected';
          // For Review Icon Class
          if (selection.selectedIndex === reviewStepIndex) {
            this.stepperCompleted
              ? (subServiceSteps[reviewStepIndex].iconClass = 'valid')
              : (subServiceSteps[reviewStepIndex].iconClass = 'invalid');
          }
        }
      );
  }

  stepHeaderValidation(step: MatStep, index: number) {
    const reviewStepIndex = this.subServiceSteps.length - 1;
    const docsStepIndex = this.subServiceSteps.length - 2;
    const vendorsStepIndex = this.subServiceSteps.length - 3;
    const previousStep = this.subServiceSteps[index];

    let iconClass = 'invalid';
    if (index !== reviewStepIndex) {
      if (!step.hasError) {
        if (this.sharedForm) {
          if (
            this.sharedForm.valid ||
            index === vendorsStepIndex ||
            index === docsStepIndex
          ) {
            iconClass = 'valid';
          }
        } else {
          iconClass = 'valid';
        }
      } else if (step.hasError === undefined) {
        iconClass = 'valid';
      }
    } else if (this.stepperCompleted) {
      iconClass = 'valid';
    }
    previousStep.labelClass = previousStep.iconClass = iconClass;
    this.subServiceSteps[index] = previousStep;
  }

  private isStepperValid(): boolean {
    let totalStepsValid = 0;
    this.stepper.steps.forEach((step) => {
      if (!step.hasError) {
        totalStepsValid++;
      }
    });
    if (this.sharedForm) {
      return (
        totalStepsValid === this.stepper.steps.length &&
        this.sharedForm.status === 'VALID'
      );
    } else {
      return totalStepsValid === this.stepper.steps.length;
    }
  }

  copyToClipboard() {
    let reviewScreenText = document.getElementById(
      this.MAKE_A_REFERRAL_SECTION_ID + this.serviceName
    ).innerText;

    this.copyText(
      `Claim Number: ${this.claimNumber} Claimant Name: ${this.claimantName} ${reviewScreenText}`
    );

    this.snackbar.open('Copied to Clipboard!', null, {
      duration: 1500,
      panelClass: ['success', 'snackbar']
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
