import { Component, OnInit } from '@angular/core';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';
import { PHYSICALMEDICINE_DOCUMENTS_STEP_NAME } from '../physical-medicine-step-definitions';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';

@Component({
  selector: 'healthe-physical-medicine-documents',
  templateUrl: './physical-medicine-documents.component.html',
  styleUrls: ['./physical-medicine-documents.component.scss']
})
export class PhysicalMedicineDocumentsComponent
  extends WizardDocumentStepComponent
  implements OnInit {
  sectionName = 'physical-medicine';

  loadForm() {
    console.warn('Unimplemented');
  }

  constructor(public store$: Store<RootState>) {
    super(PHYSICALMEDICINE_DOCUMENTS_STEP_NAME, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  cancel(): void {}
}
