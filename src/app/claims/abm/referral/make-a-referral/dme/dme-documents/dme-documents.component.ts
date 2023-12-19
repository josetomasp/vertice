import { Component, OnInit } from '@angular/core';
import { DME_DOCUMENTS_STEP_NAME } from '../dme-step-definitions';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';
import { RootState } from 'src/app/store/models/root.models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'healthe-dme-documents',
  templateUrl: './dme-documents.component.html',
  styleUrls: ['./dme-documents.component.scss']
})
export class DmeDocumentsComponent extends WizardDocumentStepComponent
  implements OnInit {
  sectionName = 'dme';
  constructor(public store$: Store<RootState>) {
    super(DME_DOCUMENTS_STEP_NAME, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  cancel(): void {}
  loadForm() {
    console.warn('Unimplemented');
  }
}
