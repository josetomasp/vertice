import { Component, Input, OnInit } from '@angular/core';
import { translateServiceName } from '../../../../make-a-referral-shared';
import { LANGUAGE_VENDOR_STEP_NAME } from '../../../language-step-definitions';
import { select, Store } from '@ngrx/store';
import { getFormStateByName } from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';

@Component({
  selector: 'healthe-language-vendor-review',
  templateUrl: './language-vendor-review.component.html',
  styleUrls: ['./language-vendor-review.component.scss']
})
export class LanguageVendorReviewComponent implements OnInit {
  translateServiceName = translateServiceName;
  stepName = LANGUAGE_VENDOR_STEP_NAME;
  @Input()
  usingReturnedFormState = false;

  public vendorFormValues$;
  sectionName = 'Language';

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.vendorFormValues$ = this.store$.pipe(
      select(
        getFormStateByName({
          formStateChild: LANGUAGE_VENDOR_STEP_NAME,
          useReturnedValues: this.usingReturnedFormState
        })
      )
    );
  }
}
