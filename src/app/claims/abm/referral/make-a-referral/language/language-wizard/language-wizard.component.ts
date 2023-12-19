import { Component, Inject } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';

import { WizardBaseDirective } from '../../components/wizard-base.directive';
import { MAT_EXPANSION_PANEL_REF } from '../../make-a-referral-shared';
import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_DOCUMENTS_STEP_NAME,
  LANGUAGE_INTERPRETATION_STEP_NAME,
  LANGUAGE_REVIEW_STEP_NAME,
  LANGUAGE_STEP_DEFINITIONS,
  LANGUAGE_TRANSLATION_STEP_NAME,
  LANGUAGE_VENDOR_STEP_NAME
} from '../language-step-definitions';
import { MatDialog } from '@angular/material/dialog';
import {
  MakeAReferralHelperService
} from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-language-wizard',
  templateUrl: './language-wizard.component.html',
  styleUrls: ['./language-wizard.component.scss']
})
export class LanguageWizardComponent extends WizardBaseDirective {
  translationStepName = LANGUAGE_TRANSLATION_STEP_NAME;
  interpretationStepName = LANGUAGE_INTERPRETATION_STEP_NAME;
  alertType = AlertType;

  constructor(
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar,
    @Inject(MAT_EXPANSION_PANEL_REF) public expansionPanel: MatExpansionPanel
  ) {
    super(
      LANGUAGE_STEP_DEFINITIONS,
      {
        serviceName: LANGUAGE_ARCH_TYPE,
        reviewName: LANGUAGE_REVIEW_STEP_NAME,
        documentsName: LANGUAGE_DOCUMENTS_STEP_NAME,
        vendorsName: LANGUAGE_VENDOR_STEP_NAME
      },
      { Language: 'detailSelection' },
      'Language',
      store$,
      expansionPanel,
      matDialog,
      makeAReferralHelperService,
      snackbar
    );
  }
}
