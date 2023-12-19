import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import { RootState } from '../../../../../../store/models/root.models';
import { WizardDocumentStepComponent } from '../../components/wizard-document-step.component';

@Component({
  selector: 'healthe-transportation-documents-wizard-form',
  templateUrl: './transportation-documents-wizard-form.component.html',
  styleUrls: ['./transportation-documents-wizard-form.component.scss']
})
export class TransportationDocumentsWizardFormComponent
  extends WizardDocumentStepComponent
  implements OnInit {
  maximumFileSizeInMb = '26';
  sectionName = 'transportation';

  constructor(public store$: Store<RootState>) {
    super('transportation-documents', store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  cancel(): void {}

  get documents(): AbstractControl {
    return this.stepForm.get('documents');
  }

  loadForm() {
    console.warn('Unimplemented');
  }
}
