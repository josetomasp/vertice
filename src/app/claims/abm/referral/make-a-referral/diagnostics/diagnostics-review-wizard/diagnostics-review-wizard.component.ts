import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import {
  FusionICDCode,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import {
  DIAGNOSTICS_CTSCAN_STEP_NAME,
  DIAGNOSTICS_DOCUMENTS_STEP_NAME,
  DIAGNOSTICS_EMG_STEP_NAME,
  DIAGNOSTICS_MRI_STEP_NAME,
  DIAGNOSTICS_OTHER_STEP_NAME,
  DIAGNOSTICS_REVIEW_STEP_NAME,
  DIAGNOSTICS_SHARED_FORM_NAME,
  DIAGNOSTICS_ULTRASOUND_STEP_NAME,
  DIAGNOSTICS_VENDOR_STEP_NAME,
  DIAGNOSTICS_XRAY_STEP_NAME
} from '../diagnostics-step-definitions';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl, FormGroup } from '@angular/forms';
import { AddNoteModalComponent } from '../../transportation/components/add-note-modal/add-note-modal.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import { faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { DiagnosticsWizardComponent } from '../diagnostics-wizard/diagnostics-wizard.component';
import { debounceTime, filter, first, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-diagnostics-review-wizard',
  templateUrl: './diagnostics-review-wizard.component.html',
  styleUrls: ['./diagnostics-review-wizard.component.scss']
})
export class DiagnosticsReviewWizardComponent extends WizardBaseStepDirective
  implements OnInit {
  @Input()
  stepperCompleted: boolean;
  @Input()
  inReferralReviewMode = false;
  faStickyNote = faStickyNote;
  seenOnce = false;
  icdCodesDisplay: string = '';
  mriStepName = DIAGNOSTICS_MRI_STEP_NAME;
  emgStepName = DIAGNOSTICS_EMG_STEP_NAME;
  xRayStepName = DIAGNOSTICS_XRAY_STEP_NAME;
  ctScanStepName = DIAGNOSTICS_CTSCAN_STEP_NAME;
  ultrasoundStepName = DIAGNOSTICS_ULTRASOUND_STEP_NAME;
  otherStepName = DIAGNOSTICS_OTHER_STEP_NAME;
  documentsStepName = DIAGNOSTICS_DOCUMENTS_STEP_NAME;
  sectionName = 'Diagnostics';
  alertType = AlertType;
  isAlive: boolean = true;

  public referralLevelNotes$;

  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.Diagnostics))
  );

  selectedDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.documentsStepName,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );

  selectedSharedFormGroup$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: DIAGNOSTICS_SHARED_FORM_NAME,
        useReturnedValues: false
      })
    )
  );

  public vendorFormValues$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: DIAGNOSTICS_VENDOR_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );
  stepForm$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.stepName,
        useReturnedValues: false
      })
    )
  );

  stepForm: FormGroup = new FormGroup({ notes: new FormControl('') });

  sharedForm: FormGroup = new FormGroup({});
  notesForm: FormControl = new FormControl('');

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper,
    @Optional()
    @Inject(DiagnosticsWizardComponent)
    public wizard: DiagnosticsWizardComponent
  ) {
    super(DIAGNOSTICS_REVIEW_STEP_NAME, store$);
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
    } else {
      this.sharedForm = this.wizard.sharedForm;

      // ICD Codes
      this.sharedForm.controls['diagnosisCodes'].valueChanges.subscribe(
        (icdCodes) => {
          this.processIcdCodesDisplay(icdCodes);
        }
      );
    }

    // All this is to detect the fact that a user has actually seen the review form at least once.
    if (false === this.inReferralReviewMode && this.matStepper) {
      this.save();
      this.matStepper.selectionChange.subscribe(
        (value: StepperSelectionEvent) => {
          if (value.selectedIndex === this.matStepper.steps.length - 1) {
            if (false === this.seenOnce) {
              this.seenOnce = true;

              // This dispatch will enable the submit button assuming all other steps are valid.
              this.store$.dispatch(
                new AddValidFormState(DIAGNOSTICS_REVIEW_STEP_NAME)
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
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((notes) => this.notesForm.setValue(notes));

    this.notesForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((newNote) =>
        this.store$.dispatch(new UpdateReferralLevelNote(newNote))
      );
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

  cancel(): void {}

  viewNotes() {
    this.dialog.open(AddNoteModalComponent, {
      width: '50%',
      data: {
        serviceActionType: 'diagnostics review',
        notes: this.stepForm.controls['notes'].value,
        readOnly: true
      }
    });
  }

  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe((formValues) => {
        this.store$.dispatch(new UpdateReferralLevelNote(formValues.notes));
      });
  }
}
