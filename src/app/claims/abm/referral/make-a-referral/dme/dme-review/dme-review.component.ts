import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import {
  DME_DOCUMENTS_STEP_NAME,
  DME_EQUIPMENT_STEP_NAME,
  DME_REVIEW_STEP_NAME,
  DME_VENDOR_STEP_NAME
} from '../dme-step-definitions';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { select, Store } from '@ngrx/store';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { RootState } from 'src/app/store/models/root.models';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { DmeWizardComponent } from '../dme-wizard/dme-wizard.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import { debounceTime, filter, first, takeWhile } from 'rxjs/operators';
import { AddNoteModalComponent } from '../../transportation/components/add-note-modal/add-note-modal.component';

@Component({
  selector: 'healthe-dme-review',
  templateUrl: './dme-review.component.html',
  styleUrls: ['./dme-review.component.scss']
})
export class DmeReviewComponent extends WizardBaseStepDirective
  implements OnInit {
  @Input()
  stepperCompleted: boolean;
  @Input()
  inReferralReviewMode: boolean = false;

  sectionName = 'DME';
  seenOnce = false;
  isAlive: boolean = true;

  public referralLevelNotes$;

  //#region Step names definition
  equipmentStepName = DME_EQUIPMENT_STEP_NAME;
  vendorsStepName = DME_VENDOR_STEP_NAME;
  documentsStepName = DME_DOCUMENTS_STEP_NAME;
  //#endregion

  alertType = AlertType;

  selectedDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: DME_DOCUMENTS_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );

  vendorFormValues$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: DME_VENDOR_STEP_NAME,
        useReturnedValues: this.inReferralReviewMode
      })
    )
  );

  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.DME))
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
  prescriberInformation;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper,
    @Optional() @Inject(DmeWizardComponent) public wizard: DmeWizardComponent
  ) {
    super(DME_REVIEW_STEP_NAME, store$);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadForm();
    // All this is to detect the fact that a user has actually seen the review form at least once.
    if (false === this.inReferralReviewMode && this.matStepper) {
      this.save();
      this.matStepper.selectionChange.subscribe(
        (values: StepperSelectionEvent) => {
          if (values.selectedIndex === this.matStepper.steps.length - 1) {
            if (false === this.seenOnce) {
              this.seenOnce = true;

              // This dispatch will enable the submit button assuming all other steps are valid.
              this.store$.dispatch(new AddValidFormState(DME_REVIEW_STEP_NAME));
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
        serviceActionType: 'DME review',
        notes: this.stepForm.controls['notes'].value,
        readonly: true
      }
    });
  }

  setPrescriberInformation(prescriberInformation) {
    this.prescriberInformation = prescriberInformation;
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
