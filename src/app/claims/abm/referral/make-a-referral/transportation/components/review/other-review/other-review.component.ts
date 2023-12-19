import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TRANSPORTATION_OTHER_STEP_NAME } from '../../../transportation-step-definitions';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../../../../store/models/root.models';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-other-review',
  templateUrl: './other-review.component.html',
  styleUrls: ['./other-review.component.scss']
})
export class OtherReviewComponent implements OnInit, OnDestroy {
  TRANSPORTATION_OTHER_STEP_NAME = TRANSPORTATION_OTHER_STEP_NAME;
  sectionTitle: string;
  @Input()
  usingReturnedFormState = false;

  title = '';
  isAlive: boolean = true;

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.store$
      .pipe(
        takeWhile(() => this.isAlive),

        select(
          getFormStateByName({
            formStateChild: this.TRANSPORTATION_OTHER_STEP_NAME,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .subscribe((values) => {
        this.title = values['typeOfTransportation'];

        if (null == this.title) {
          this.title = '';
        }

        this.sectionTitle = this.title + ' Transportation';

        if (this.usingReturnedFormState) {
          this.sectionTitle += ' - Referral #' + values.referralId;
        }
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
