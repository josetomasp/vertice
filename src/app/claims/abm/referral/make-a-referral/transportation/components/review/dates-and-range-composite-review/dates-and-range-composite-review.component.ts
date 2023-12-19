import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { RootState } from '../../../../../../../../store/models/root.models';
import { DateFormMode } from '../../../../../store/models/make-a-referral.models';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';

@Component({
  selector: 'healthe-dates-and-range-composite-review',
  templateUrl: './dates-and-range-composite-review.component.html',
  styleUrls: ['./dates-and-range-composite-review.component.scss']
})
export class DatesAndRangeCompositeReviewComponent
  implements OnInit, OnDestroy {
  @Input()
  sectionTitle: string;
  sectionName = 'Transportation';
  @Input()
  usingReturnedFormState = false;

  @Input()
  step: string = '';

  specificDate = DateFormMode.SpecificDate;
  dateRange = DateFormMode.DateRange;
  dateMode = '';

  isAlive = true;

  public values$: Observable<{ [key: string]: string }>;

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.values$ = this.store$.pipe(
      select(
        getFormStateByName({
          formStateChild: this.step,
          useReturnedValues: this.usingReturnedFormState
        })
      )
    );

    this.values$.pipe(takeWhile(() => this.isAlive)).subscribe((values) => {
      this.dateMode = values['authorizationDateType'];
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
