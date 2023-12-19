import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { RootState } from '../../../../../../../../store/models/root.models';
import { TRANSPORTATION_VENDOR_STEP_NAME } from '../../../transportation-step-definitions';
import { translateServiceName } from '../../../../make-a-referral-shared';

@Component({
  selector: 'healthe-transportation-vendor-review',
  templateUrl: './transportation-vendor-review.component.html',
  styleUrls: ['./transportation-vendor-review.component.scss']
})
export class TransportationVendorReviewComponent implements OnInit {
  translateServiceName = translateServiceName;
  stepName = TRANSPORTATION_VENDOR_STEP_NAME;
  @Input()
  usingReturnedFormState = false;

  public vendorFormValues$;
  sectionName = 'Transportation';

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.vendorFormValues$ = this.store$.pipe(
      select(
        getFormStateByName({
          formStateChild: this.stepName,
          useReturnedValues: this.usingReturnedFormState
        })
      )
    );
  }

  cancel(): void {}
}
