import { Component, OnInit } from '@angular/core';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { DIAGNOSTICS_DOCUMENTS_STEP_NAME } from '../diagnostics-step-definitions';

@Component({
  selector: 'healthe-diagnostics-documents',
  templateUrl: './diagnostics-documents.component.html',
  styleUrls: ['./diagnostics-documents.component.scss']
})
export class DiagnosticsDocumentsComponent extends WizardDocumentStepComponent
  implements OnInit {
  sectionName = 'diagnostics';

  constructor(public store$: Store<RootState>) {
    super(DIAGNOSTICS_DOCUMENTS_STEP_NAME, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  cancel(): void {}

  loadForm() {
    console.warn('Unimplemented');
  }
}
