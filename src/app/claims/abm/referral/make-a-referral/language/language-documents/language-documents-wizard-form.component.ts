import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../../store/models/root.models';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';
import { LANGUAGE_DOCUMENTS_STEP_NAME } from '../language-step-definitions';

@Component({
  selector: 'healthe-language-documents-wizard-form',
  templateUrl: './language-documents-wizard-form.component.html',
  styleUrls: ['./language-documents-wizard-form.component.scss']
})
export class LanguageDocumentsWizardFormComponent
  extends WizardDocumentStepComponent
  implements OnInit {
  sectionName = 'language';
  loadForm() {
    console.warn('unimplemented');
  }

  constructor(public store$: Store<RootState>) {
    super(LANGUAGE_DOCUMENTS_STEP_NAME, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  cancel(): void {}
}
