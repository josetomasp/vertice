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

import {
  FusionServiceName,
  PhysicalMedicineSharedForm
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import {
  getApprovedLocations,
  getFormStateByName
} from '../../../store/selectors/makeReferral.selectors';
import { WizardBaseDirective } from '../../components/wizard-base.directive';
import {
  MAT_EXPANSION_PANEL_REF,
  referralLocationToFullString
} from '../../make-a-referral-shared';
import {
  PHYSICALMEDICINE_ARCH_TYPE,
  PHYSICALMEDICINE_DOCUMENTS_STEP_NAME,
  PHYSICALMEDICINE_FCE_STEP_NAME,
  PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME,
  PHYSICALMEDICINE_OTHER_STEP_NAME,
  PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME,
  PHYSICALMEDICINE_REVIEW_STEP_NAME,
  PHYSICALMEDICINE_SHARED_FORM_NAME,
  PHYSICALMEDICINE_STEP_DEFINITIONS,
  PHYSICALMEDICINE_VENDOR_STEP_NAME
} from '../physical-medicine-step-definitions';
import { MatDialog } from '@angular/material/dialog';
import {
  MakeAReferralHelperService
} from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-physical-medicine-wizard',
  templateUrl: './physical-medicine-wizard.component.html',
  styleUrls: ['./physical-medicine-wizard.component.scss']
})
export class PhysicalMedicineWizardComponent extends WizardBaseDirective
  implements OnInit {
  physicalTherapyStepName = PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME;
  occupationalTherapyStepName = PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME;
  fceStepName = PHYSICALMEDICINE_FCE_STEP_NAME;
  otherStepName = PHYSICALMEDICINE_OTHER_STEP_NAME;
  alertType = AlertType;

  sharedFormState$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: PHYSICALMEDICINE_SHARED_FORM_NAME,
        useReturnedValues: false
      })
    )
  );

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
    select(getApprovedLocations(PHYSICALMEDICINE_ARCH_TYPE)),
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

  constructor(
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar,
    @Inject(MAT_EXPANSION_PANEL_REF) public expansionPanel: MatExpansionPanel
  ) {
    super(
      PHYSICALMEDICINE_STEP_DEFINITIONS,
      {
        serviceName: PHYSICALMEDICINE_ARCH_TYPE,
        reviewName: PHYSICALMEDICINE_REVIEW_STEP_NAME,
        vendorsName: PHYSICALMEDICINE_VENDOR_STEP_NAME,
        documentsName: PHYSICALMEDICINE_DOCUMENTS_STEP_NAME
      },
      { [FusionServiceName.PhysicalMedicine]: 'detailSelection' },
      FusionServiceName.PhysicalMedicine,
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
    this.stepWizardForm.setControl(
      PHYSICALMEDICINE_SHARED_FORM_NAME,
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
            new AddValidFormState(PHYSICALMEDICINE_SHARED_FORM_NAME)
          );
        } else {
          this.store$.dispatch(
            new RemoveValidFormState(PHYSICALMEDICINE_SHARED_FORM_NAME)
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

  save() {
    this.store$.dispatch(
      new UpdateSectionForm({
        [PHYSICALMEDICINE_SHARED_FORM_NAME]: this.sharedForm.value
      })
    );
  }

  loadForm() {
    this.sharedFormState$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe(
        ({
          surgeryDate,
          postSurgical,
          scheduleNear,
          diagnosisCodes,
          prescriberAddress,
          prescriberName,
          prescriberPhone
        }: PhysicalMedicineSharedForm) => {
          this.sharedForm = new FormGroup({
            surgeryDate: new FormControl(surgeryDate),
            postSurgical: new FormControl(postSurgical),
            scheduleNear: new FormControl(scheduleNear, [Validators.required]),
            diagnosisCodes: new FormControl(diagnosisCodes),
            prescriberName: new FormControl(
              prescriberName,
              Validators.required
            ),
            prescriberPhone: new FormControl(
              prescriberPhone,
              Validators.required
            ),
            prescriberAddress: new FormControl(prescriberAddress)
          });
        }
      );
  }

  protected readonly AlertType = AlertType;
}
