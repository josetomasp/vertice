import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import {
  LANGUAGE_DOCUMENTS_STEP_NAME,
  LANGUAGE_INTERPRETATION_STEP_NAME,
  LANGUAGE_REVIEW_STEP_NAME,
  LANGUAGE_TRANSLATION_STEP_NAME
} from '../language-step-definitions';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { select, Store } from '@ngrx/store';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';
import { AddNoteModalComponent } from '../../transportation/components/add-note-modal/add-note-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import { debounceTime, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-language-review-wizard',
  templateUrl: './language-review-wizard.component.html',
  styleUrls: ['./language-review-wizard.component.scss']
})
export class LanguageReviewWizardComponent extends WizardBaseStepDirective
  implements OnInit {
  @Input()
  stepperCompleted: boolean;
  @Input()
  usingReturnedFormState = false;
  isAlive: boolean = true;
  public referralLevelNotes$;
  interpretationStepName = LANGUAGE_INTERPRETATION_STEP_NAME;
  translateStepName = LANGUAGE_TRANSLATION_STEP_NAME;
  documentsStepName = LANGUAGE_DOCUMENTS_STEP_NAME;
  alertType = AlertType;
  seenOnce = false;
  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.Language))
  );
  languageDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.documentsStepName,
        useReturnedValues: false
      })
    )
  );
  stepForm: FormGroup = new FormGroup({ notes: new FormControl('') });
  notesForm: FormControl = new FormControl('');
  sectionName = 'Language';

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(LANGUAGE_REVIEW_STEP_NAME, store$);
  }

  loadForm() {
    console.warn('unimplemented');
  }

  ngOnInit() {
    super.ngOnInit();

    // All this is to detect the fact that a user has actually seen the review form at least once.
    if (false === this.usingReturnedFormState && this.matStepper) {
      this.save();
      this.matStepper.selectionChange.subscribe(
        (value: StepperSelectionEvent) => {
          if (value.selectedIndex === this.matStepper.steps.length - 1) {
            if (false === this.seenOnce) {
              this.seenOnce = true;

              // This dispatch will enable the submit button assuming all other steps are valid.
              this.store$.dispatch(
                new AddValidFormState(LANGUAGE_REVIEW_STEP_NAME)
              );
            }
          }
        }
      );
    }

    this.referralLevelNotes$ = this.store$.pipe(
      select(getReferralLevelNotes(this.usingReturnedFormState))
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
        serviceActionType: 'language review',
        notes: this.stepForm.controls['notes'].value,
        readonly: true
      }
    });
  }
}
