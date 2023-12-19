import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { select, Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  takeUntil
} from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState,
  UpdateSectionForm
} from '../../../store/actions/make-a-referral.actions';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';

import { WizardBaseDirective } from '../../components/wizard-base.directive';
import {
  MAT_EXPANSION_PANEL_REF,
  referralLocationToFullString
} from '../../make-a-referral-shared';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_CTSCAN_STEP_NAME,
  DIAGNOSTICS_DOCUMENTS_STEP_NAME,
  DIAGNOSTICS_EMG_STEP_NAME,
  DIAGNOSTICS_MRI_STEP_NAME,
  DIAGNOSTICS_OTHER_STEP_NAME,
  DIAGNOSTICS_REVIEW_STEP_NAME,
  DIAGNOSTICS_SHARED_FORM_NAME,
  DIAGNOSTICS_STEP_DEFINITIONS,
  DIAGNOSTICS_ULTRASOUND_STEP_NAME,
  DIAGNOSTICS_VENDOR_STEP_NAME,
  DIAGNOSTICS_XRAY_STEP_NAME
} from '../diagnostics-step-definitions';
import {
  getApprovedLocations,
  getFormStateByName
} from '../../../store/selectors/makeReferral.selectors';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import { MatDialog } from '@angular/material/dialog';
import {
  MakeAReferralHelperService
} from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-diagnostics-wizard',
  templateUrl: './diagnostics-wizard.component.html',
  styleUrls: ['./diagnostics-wizard.component.scss']
})
export class DiagnosticsWizardComponent extends WizardBaseDirective
  implements OnInit {
  mriStepName = DIAGNOSTICS_MRI_STEP_NAME;
  emgStepName = DIAGNOSTICS_EMG_STEP_NAME;
  xRayStepName = DIAGNOSTICS_XRAY_STEP_NAME;
  ctScanStepName = DIAGNOSTICS_CTSCAN_STEP_NAME;
  ultrasoundStepName = DIAGNOSTICS_ULTRASOUND_STEP_NAME;
  otherStepName = DIAGNOSTICS_OTHER_STEP_NAME;
  alertType = AlertType;

  sharedForm = new FormGroup({
    surgeryDate: new FormControl(null),
    postSurgical: new FormControl(false),
    scheduleNear: new FormControl(null, [Validators.required]),
    diagnosisCodes: new FormControl(null),
    prescriberName: new FormControl(null, Validators.required),
    prescriberPhone: new FormControl(null, Validators.required),
    prescriberAddress: new FormControl(null)
  });

  locations$ = this.store$.pipe(
    select(getApprovedLocations(DIAGNOSTICS_ARCH_TYPE)),
    map((values: ClaimLocation[]) => {
      let options = values.map((referralLocation) => ({
        label: referralLocationToFullString(referralLocation),
        value: referralLocation
      }));
      const defaultLocation = options.find(
        (location) => location.value.type === 'Home'
      );
      if (defaultLocation) {
        this.sharedForm.controls['scheduleNear'].setValue(
          defaultLocation.value
        );
      }
      return options;
    })
  );

  sharedForm$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: DIAGNOSTICS_SHARED_FORM_NAME,
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
      DIAGNOSTICS_STEP_DEFINITIONS,
      {
        serviceName: DIAGNOSTICS_ARCH_TYPE,
        documentsName: DIAGNOSTICS_DOCUMENTS_STEP_NAME,
        vendorsName: DIAGNOSTICS_VENDOR_STEP_NAME,
        reviewName: DIAGNOSTICS_REVIEW_STEP_NAME
      },
      { Diagnostics: 'detailSelection' },
      FusionServiceName.Diagnostics,
      store$,
      expansionPanel,
      matDialog,
      makeAReferralHelperService,
      snackbar
    );
  }

  ngOnInit() {
    // Controls shared across all steps.
    super.ngOnInit();
    this.loadForm();
    this.stepWizardForm.setControl(
      DIAGNOSTICS_SHARED_FORM_NAME,
      this.sharedForm
    );

    this.sharedForm.statusChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe((status) => {
        if (status === 'VALID') {
          this.store$.dispatch(
            new AddValidFormState(DIAGNOSTICS_SHARED_FORM_NAME)
          );
        } else {
          this.store$.dispatch(
            new RemoveValidFormState(DIAGNOSTICS_SHARED_FORM_NAME)
          );
        }
      });

    this.sharedForm.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(500),
        distinctUntilChanged(isEqual)
      )
      .subscribe(() => {
        this.save();
      });
  }

  loadForm() {
    this.sharedForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe((formValues) => {
        this.sharedForm = new FormGroup({
          surgeryDate: new FormControl(formValues.surgeryDate),
          postSurgical: new FormControl(formValues.postSurgical),
          scheduleNear: new FormControl(formValues.scheduleNear, [
            Validators.required
          ]),
          diagnosisCodes: new FormControl(formValues.diagnosisCodes),
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
        [DIAGNOSTICS_SHARED_FORM_NAME]: this.sharedForm.value
      })
    );
  }

  protected readonly AlertType = AlertType;
}
