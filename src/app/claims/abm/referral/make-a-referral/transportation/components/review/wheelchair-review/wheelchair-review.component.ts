import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME } from '../../../transportation-step-definitions';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../../../../store/models/root.models';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { takeWhile } from 'rxjs/operators';
import { FormatType, generalFormat } from '../../../../make-a-referral-shared';

@Component({
  selector: 'healthe-wheelchair-review',
  templateUrl: './wheelchair-review.component.html',
  styleUrls: ['./wheelchair-review.component.scss']
})
export class WheelchairReviewComponent implements OnInit, OnDestroy {
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME = TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME;
  sectionTitle: string;
  @Input()
  usingReturnedFormState = false;

  columnCount = 7;
  columnSpacing: number;
  isAlive: boolean = true;
  displayData = {};

  constructor(public store$: Store<RootState>) {
    this.columnSpacing = 100 / this.columnCount;
  }

  ngOnInit() {
    this.store$
      .pipe(
        select(
          getFormStateByName({
            formStateChild: this.TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((values) => {
        this.buildDisplayData(values);
        this.sectionTitle = 'Wheelchair Transport';
        if (this.usingReturnedFormState) {
          this.sectionTitle += ' - Referral #' + values.referralId;
        }
      });
  }

  buildDisplayData(values) {
    this.displayData['steps'] = generalFormat(
      values['steps'],
      '',
      FormatType.NONE
    );

    this.displayData['wheelchairType'] = generalFormat(
      values['wheelchairType'],
      '',
      FormatType.NONE
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
