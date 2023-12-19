import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { select, Store } from '@ngrx/store';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  AddValidFormState,
  UpdateReferralLevelNote
} from '../../../store/actions/make-a-referral.actions';
import {
  getFormStateByName,
  getReferralLevelNotes,
  getSelectedServiceDetailTypes
} from '../../../store/selectors/makeReferral.selectors';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import {
  TRANSPORTATION_DOCUMENTS_STEP_NAME,
  TRANSPORTATION_FLIGHT_STEP_NAME,
  TRANSPORTATION_LODGING_STEP_NAME,
  TRANSPORTATION_OTHER_STEP_NAME,
  TRANSPORTATION_REVIEW_STEP_NAME,
  TRANSPORTATION_SEDAN_STEP_NAME,
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME
} from '../transportation-step-definitions';
import {
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';

@Component({
  selector: 'healthe-transportation-review-wizard',
  templateUrl: './transportation-review-wizard.component.html',
  styleUrls: ['./transportation-review-wizard.component.scss']
})
export class TransportationReviewWizardComponent extends WizardBaseStepDirective
  implements OnInit, OnDestroy {
  @Input()
  usingReturnedFormState = false;

  @Input() stepperCompleted = false;

  isAlive: boolean = true;

  public referralLevelNotes$;

  sectionName = 'Transportation';
  documentsStepName = TRANSPORTATION_DOCUMENTS_STEP_NAME;
  sedanStepName = TRANSPORTATION_SEDAN_STEP_NAME;
  wheelchairStepName = TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME;
  flightStepName = TRANSPORTATION_FLIGHT_STEP_NAME;
  lodgingStepName = TRANSPORTATION_LODGING_STEP_NAME;
  otherStepName = TRANSPORTATION_OTHER_STEP_NAME;
  alertType = AlertType;
  seenOnce = false;

  selectedServiceDetailTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.Transportation))
  );

  transportationDocuments$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.documentsStepName,
        useReturnedValues: false
      })
    )
  );

  stepForm: FormGroup = new FormGroup({});
  notesForm: FormControl = new FormControl('');

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(TRANSPORTATION_REVIEW_STEP_NAME, store$);
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
                new AddValidFormState(TRANSPORTATION_REVIEW_STEP_NAME)
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

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  cancel(): void {}

  loadForm() {
    console.warn('Unimplemented');
  }
}
