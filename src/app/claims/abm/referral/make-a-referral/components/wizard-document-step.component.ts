import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../store/models/root.models';
import { WizardBaseStepDirective } from './wizard-base-step.directive';
import { Directive, OnInit } from '@angular/core';
import { AddValidFormState } from '../../store/actions/make-a-referral.actions';

@Directive()
export abstract class WizardDocumentStepComponent
  extends WizardBaseStepDirective
  implements OnInit {
  abstract sectionName;

  stepForm = new FormGroup({
    documents: new FormControl([])
  });

  constructor(public stepName: string, public store$: Store<RootState>) {
    super(stepName, store$);
  }

  ngOnInit(): void {
    // this.reloadFormData();

    // Not calling super.ngOnInit as the distinctUntilChange on valueChanges
    // seems to always have the updated values for comparing when it comes to
    // the documents form
    this.stepForm.valueChanges.subscribe(() => {
      this.save();
    });

    // This is done here because there isn't an invalid state for the documents form.
    this.store$.dispatch(new AddValidFormState(this.stepName));

    this.save();
  }

  abstract cancel(): void;
}
