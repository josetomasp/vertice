import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TRANSPORTATION_SEDAN_STEP_NAME } from '../../../transportation-step-definitions';
import { select, Store } from '@ngrx/store';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { RootState } from '../../../../../../../../store/models/root.models';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-sedan-review',
  templateUrl: './sedan-review.component.html',
  styleUrls: ['./sedan-review.component.scss']
})
export class SedanReviewComponent implements OnInit, OnDestroy {
  TRANSPORTATION_SEDAN_STEP_NAME = TRANSPORTATION_SEDAN_STEP_NAME;
  sectionTitle: string;
  isAlive = true;

  @Input()
  usingReturnedFormState = false;

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.store$
      .pipe(
        select(
          getFormStateByName({
            formStateChild: this.TRANSPORTATION_SEDAN_STEP_NAME,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((values) => {
        this.sectionTitle = 'Sedan Travel';
        if (this.usingReturnedFormState) {
          this.sectionTitle += ' - Referral #' + values.referralId;
        }
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
