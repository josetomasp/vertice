import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { select, Store } from '@ngrx/store';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import {
  FusionICDCode,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { AddNoteModalComponent } from '../../transportation/components/add-note-modal/add-note-modal.component';
import {
  PHYSICALMEDICINE_DOCUMENTS_STEP_NAME,
  PHYSICALMEDICINE_FCE_STEP_NAME,
  PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME,
  PHYSICALMEDICINE_OTHER_STEP_NAME,
  PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME,
  PHYSICALMEDICINE_REVIEW_STEP_NAME,
  PHYSICALMEDICINE_SHARED_FORM_NAME,
  PHYSICALMEDICINE_VENDOR_STEP_NAME
} from '../physical-medicine-step-definitions';
import { PhysicalMedicineWizardComponent } from '../physical-medicine-wizard/physical-medicine-wizard.component';

@Component({
  selector: 'healthe-physical-medicine-review',
  templateUrl: './physical-medicine-review-wizard.component.html',
  styleUrls: ['./physical-medicine-review-wizard.component.scss']
})
export class PhysicalMedicineReviewWizardComponent
  extends WizardBaseStepDirective
  implements OnInit {
  @Input()
  stepperCompleted: boolean;
  @Input()
  inReferralReviewMode: boolean = false;

  sectionName = 'Physical Medicine';
  sharedForm: FormGroup;
  //#region Step Definitions
  physicalTherapyStepName = PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME;
  occupationalTherapyStepName = PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME;
  fceStepName = PHYSICALMEDICINE_FCE_STEP_NAME;
  otherStepName = PHYSICALMEDICINE_OTHER_STEP_NAME;
  documentsStepName = PHYSICALMEDICINE_DOCUMENTS_STEP_NAME;
  vendorStepName = PHYSICALMEDICINE_VENDOR_STEP_NAME;
  //#endregion

  icdCodesDisplay: string = '';
  alertType = AlertType;

  public referralLevelNotes$;

  selectedDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: PHYSICALMEDICINE_DOCUMENTS_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );
  public vendorFormValues$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: PHYSICALMEDICINE_VENDOR_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );

  stepForm: FormGroup = new FormGroup({ notes: new FormControl('') });
  faStickyNote = faStickyNote;
  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.PhysicalMedicine))
  );
  selectedSharedFormGroup$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: PHYSICALMEDICINE_SHARED_FORM_NAME,
        useReturnedValues: false
      })
    )
  );
  public notesForm = new FormControl();
  private seenOnce: boolean;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional()
    @Inject(PhysicalMedicineWizardComponent)
    public wizard: PhysicalMedicineWizardComponent,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(PHYSICALMEDICINE_REVIEW_STEP_NAME, store$);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.inReferralReviewMode) {
      this.selectedSharedFormGroup$.subscribe((values) => {
        this.sharedForm = new FormGroup({
          surgeryDate: new FormControl(values.surgeryDate),
          postSurgical: new FormControl(values.postSurgical),
          scheduleNear: new FormControl(values.scheduleNear),
          diagnosisCodes: new FormControl(values.diagnosisCodes),
          prescriberName: new FormControl(values.prescriberName),
          prescriberPhone: new FormControl(values.prescriberPhone),
          prescriberAddress: new FormControl(values.prescriberAddress)
        });

        this.processIcdCodesDisplay(values.diagnosisCodes);
      });
    } else if (this.wizard) {
      this.sharedForm = this.wizard.sharedForm;
      this.wizard.sharedForm.controls['diagnosisCodes'].valueChanges.subscribe(
        (icdCodes) => {
          if (icdCodes) {
            if (icdCodes.length === 0) {
              this.icdCodesDisplay =
                'No Diagnosis Codes associated with this claim.';
            } else {
              this.icdCodesDisplay = icdCodes
                .map((icdCode) => icdCode.code.concat(' - ', icdCode.desc))
                .join(', ');
            }
          }
        }
      );
    }
    // All this is to detect the fact that a user has actually seen the review form at least once.
    if (!this.inReferralReviewMode && this.matStepper) {
      this.save();
      this.matStepper.selectionChange.subscribe(
        (value: StepperSelectionEvent) => {
          if (value.selectedIndex === this.matStepper.steps.length - 1) {
            if (!this.seenOnce) {
              this.seenOnce = true;
              // This dispatch will enable the submit button assuming all other steps are valid.
              this.store$.dispatch(
                new AddValidFormState(PHYSICALMEDICINE_REVIEW_STEP_NAME)
              );
            }
          }
        }
      );
    }

    this.referralLevelNotes$ = this.store$.pipe(
      select(getReferralLevelNotes(this.inReferralReviewMode))
    );

    this.referralLevelNotes$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((notes) => this.notesForm.setValue(notes));

    this.notesForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((newNote) =>
        this.store$.dispatch(new UpdateReferralLevelNote(newNote))
      );
  }

  cancel(): void {}

  viewNotes() {
    this.dialog.open(AddNoteModalComponent, {
      width: '50%',
      data: {
        serviceActionType: 'physical medicine review',
        notes: this.notesForm.value,
        readOnly: true
      }
    });
  }

  private processIcdCodesDisplay(icdCodes: Array<FusionICDCode>) {
    if (icdCodes) {
      if (icdCodes.length === 0) {
        this.icdCodesDisplay = 'No Diagnosis Codes associated with this claim.';
      } else {
        this.icdCodesDisplay = icdCodes
          .map((icdCode) => icdCode.code.concat(' - ', icdCode.desc))
          .join(', ');
      }
    }
  }

  loadForm() {
    console.warn('Unimplemented');
  }
}
