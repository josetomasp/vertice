import { Component, OnInit } from '@angular/core';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { HOMEHEALTH_DOCUMENTS_STEP_NAME } from '../home-health-step-definitions';

@Component({
  selector: 'healthe-home-health-documents',
  templateUrl: './home-health-documents.component.html',
  styleUrls: ['./home-health-documents.component.scss']
})
export class HomeHealthDocumentsComponent extends WizardDocumentStepComponent
  implements OnInit {
  sectionName = 'home-health';
  constructor(public store$: Store<RootState>) {
    super(HOMEHEALTH_DOCUMENTS_STEP_NAME, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  cancel(): void {}

  loadForm() {
    console.warn('Unimplemented');
  }
}
