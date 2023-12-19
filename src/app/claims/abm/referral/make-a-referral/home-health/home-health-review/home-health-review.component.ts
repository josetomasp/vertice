import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { RootState } from 'src/app/store/models/root.models';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { HomeHealthWizardComponent } from '../home-health-wizard/home-health-wizard.component';
import { select, Store } from '@ngrx/store';
import {
  HOMEHEALTH_AIDES_STEP_NAME,
  HOMEHEALTH_DOCUMENTS_STEP_NAME,
  HOMEHEALTH_INFUSION_STEP_NAME,
  HOMEHEALTH_INHOMETHERAPY_STEP_NAME,
  HOMEHEALTH_NURSING_STEP_NAME,
  HOMEHEALTH_OTHER_STEP_NAME,
  HOMEHEALTH_REVIEW_STEP_NAME,
  HOMEHEALTH_SHARED_FORM,
  HOMEHEALTH_VENDOR_STEP_NAME
} from '../home-health-step-definitions';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import { AddNoteModalComponent } from '../../transportation/components/add-note-modal/add-note-modal.component';
import { debounceTime, filter, first, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-home-health-review',
  templateUrl: './home-health-review.component.html',
  styleUrls: ['./home-health-review.component.scss']
})
export class HomeHealthReviewComponent extends WizardBaseStepDirective
  implements OnInit {
  @Input()
  stepperCompleted: boolean;
  @Input()
  inReferralReviewMode: boolean = false;

  sectionName = 'Home Health';
  seenOnce = false;
  isAlive: boolean = true;

  public referralLevelNotes$;

  //#region Step names definition
  aidesStepName = HOMEHEALTH_AIDES_STEP_NAME;
  inHomeTherapyStepNames = HOMEHEALTH_INHOMETHERAPY_STEP_NAME;
  infusionStepName = HOMEHEALTH_INFUSION_STEP_NAME;
  nursingStepName = HOMEHEALTH_NURSING_STEP_NAME;
  otherStepName = HOMEHEALTH_OTHER_STEP_NAME;
  documentsStepName = HOMEHEALTH_DOCUMENTS_STEP_NAME;
  vendorStepName = HOMEHEALTH_VENDOR_STEP_NAME;
  //#endregion

  alertType = AlertType;

  selectedDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: HOMEHEALTH_DOCUMENTS_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );
  vendorFormValues$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: HOMEHEALTH_VENDOR_STEP_NAME,
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
  notesForm: FormControl = new FormControl('');

  faStickyNote = faStickyNote;
  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.HomeHealth))
  );
  sharedForm: FormGroup = new FormGroup({});
  private selectedSharedFormGroup$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: HOMEHEALTH_SHARED_FORM,
        useReturnedValues: false
      })
    )
  );

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper,
    @Optional()
    public wizard: HomeHealthWizardComponent
  ) {
    super(HOMEHEALTH_REVIEW_STEP_NAME, store$);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadForm();
    if (this.inReferralReviewMode) {
      this.selectedSharedFormGroup$.subscribe((values) => {
        this.sharedForm = new FormGroup({
          prescriberName: new FormControl(values.prescriberName),
          prescriberPhone: new FormControl(values.prescriberPhone),
          prescriberAddress: new FormControl(values.prescriberAddress)
        });
      });
    } else if (this.wizard) {
      this.sharedForm = this.wizard.sharedForm;
    }
    // All this is to detect the fact that a user has actually seen the review form at least once.
    if (!this.inReferralReviewMode && this.matStepper) {
      this.save();
      this.matStepper.selectionChange.subscribe(
        (values: StepperSelectionEvent) => {
          if (values.selectedIndex === this.matStepper.steps.length - 1) {
            if (false === this.seenOnce) {
              this.seenOnce = true;

              // This dispatch will enable the submit button assuming all other steps are valid.
              this.store$.dispatch(
                new AddValidFormState(HOMEHEALTH_REVIEW_STEP_NAME)
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

  cancel(): void {}

  viewNotes() {
    this.dialog.open(AddNoteModalComponent, {
      width: '50%',
      data: {
        serviceActionType: 'Home Health review',
        notes: this.stepForm.controls['notes'].value,
        readonly: true
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
