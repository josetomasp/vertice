import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { select, Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first
} from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState,
  UpdateSectionForm
} from '../../../store/actions/make-a-referral.actions';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { WizardBaseDirective } from '../../components/wizard-base.directive';
import { MAT_EXPANSION_PANEL_REF } from '../../make-a-referral-shared';
import {
  HOMEHEALTH_AIDES_STEP_NAME,
  HOMEHEALTH_ARCH_TYPE,
  HOMEHEALTH_DOCUMENTS_STEP_NAME,
  HOMEHEALTH_INFUSION_STEP_NAME,
  HOMEHEALTH_INHOMETHERAPY_STEP_NAME,
  HOMEHEALTH_NURSING_STEP_NAME,
  HOMEHEALTH_OTHER_STEP_NAME,
  HOMEHEALTH_REVIEW_STEP_NAME,
  HOMEHEALTH_SHARED_FORM,
  HOMEHEALTH_STEP_DEFINITIONS,
  HOMEHEALTH_VENDOR_STEP_NAME
} from '../home-health-step-definitions';
import { getFormStateByName } from '../../../store/selectors/makeReferral.selectors';
import { MatDialog } from '@angular/material/dialog';
import {
  MakeAReferralHelperService
} from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-home-health-wizard',
  templateUrl: './home-health-wizard.component.html',
  styleUrls: ['./home-health-wizard.component.scss']
})
export class HomeHealthWizardComponent extends WizardBaseDirective
  implements OnInit {
  nursingStepName = HOMEHEALTH_NURSING_STEP_NAME;
  inHomeTherapyStepName = HOMEHEALTH_INHOMETHERAPY_STEP_NAME;
  aidesStepName = HOMEHEALTH_AIDES_STEP_NAME;
  infusionStepName = HOMEHEALTH_INFUSION_STEP_NAME;
  otherStepName = HOMEHEALTH_OTHER_STEP_NAME;
  alertType = AlertType;

  sharedForm = new FormGroup({
    prescriberName: new FormControl(null, Validators.required),
    prescriberPhone: new FormControl(null, Validators.required),
    prescriberAddress: new FormControl(null)
  });

  sharedForm$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: HOMEHEALTH_SHARED_FORM,
        useReturnedValues: false
      })
    )
  );

  constructor(
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar,
    @Inject(MAT_EXPANSION_PANEL_REF) public expansionPanel: MatExpansionPanel
  ) {
    super(
      HOMEHEALTH_STEP_DEFINITIONS,
      {
        serviceName: HOMEHEALTH_ARCH_TYPE,
        documentsName: HOMEHEALTH_DOCUMENTS_STEP_NAME,
        vendorsName: HOMEHEALTH_VENDOR_STEP_NAME,
        reviewName: HOMEHEALTH_REVIEW_STEP_NAME
      },
      { [FusionServiceName.HomeHealth]: 'detailSelection' },
      FusionServiceName.HomeHealth,
      store$,
      expansionPanel,
      matDialog,
      makeAReferralHelperService,
      snackbar
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadForm();
    // Controls shared across all steps.
    this.stepWizardForm.setControl(HOMEHEALTH_SHARED_FORM, this.sharedForm);

    this.sharedForm.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe((status) => {
        if (status === 'VALID') {
          this.store$.dispatch(new AddValidFormState(HOMEHEALTH_SHARED_FORM));
        } else {
          this.store$.dispatch(
            new RemoveValidFormState(HOMEHEALTH_SHARED_FORM)
          );
        }
      });

    this.sharedForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(isEqual)
      )
      .subscribe(() => {
        this.save();
      });
    this.sharedForm.updateValueAndValidity();
  }

  loadForm() {
    this.sharedForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe((formValues) => {
        this.sharedForm = new FormGroup({
          prescriberName: new FormControl(
            formValues.prescriberName,
            Validators.required
          ),
          prescriberPhone: new FormControl(
            formValues.prescriberPhone,
            Validators.required
          ),
          prescriberAddress: new FormControl(formValues.prescriberAddress)
        });
      });
  }

  save() {
    this.store$.dispatch(
      new UpdateSectionForm({
        [HOMEHEALTH_SHARED_FORM]: this.sharedForm.value
      })
    );
  }
}
