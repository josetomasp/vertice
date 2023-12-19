import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../../../../store/models/root.models';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { TRANSPORTATION_FLIGHT_STEP_NAME } from '../../../transportation-step-definitions';
import { takeWhile } from 'rxjs/operators';
import { FormatType, generalFormat } from '../../../../make-a-referral-shared';

@Component({
  selector: 'healthe-flight-review',
  templateUrl: './flight-review.component.html',
  styleUrls: ['./flight-review.component.scss']
})
export class FlightReviewComponent implements OnInit, OnDestroy {
  @Input()
  usingReturnedFormState = false;
  stepName = TRANSPORTATION_FLIGHT_STEP_NAME;
  sectionTitle: string;
  sectionName = 'Transportation';

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
        takeWhile(() => this.isAlive),
        select(
          getFormStateByName({
            formStateChild: this.stepName,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .subscribe((values) => {
        this.buildDisplayData(values);
        this.sectionTitle = 'Flight Information';
        if (this.usingReturnedFormState) {
          this.sectionTitle += ' - Referral #' + values.referralId;
        }
      });
  }

  buildDisplayData(values) {
    this.displayData['flyingFrom'] = generalFormat(
      values['flyingFrom'],
      '',
      FormatType.NONE
    );
    this.displayData['flyingTo'] = generalFormat(
      values['flyingTo'],
      '',
      FormatType.NONE
    );
    this.displayData['appointmentTime'] = generalFormat(
      values['appointmentTime'],
      'N/A',
      FormatType.TIME_12HR
    );
    this.displayData['appointmentType'] = generalFormat(
      values['appointmentType'],
      'N/A',
      FormatType.NONE
    );
    this.displayData['departureDate'] = generalFormat(
      values['departureDate'],
      'N/A',
      FormatType.DATE
    );
    this.displayData['returnDate'] = generalFormat(
      values['returnDate'],
      '',
      FormatType.DATE
    );
    this.displayData['appointmentDate'] = generalFormat(
      values['appointmentDate'],
      'N/A',
      FormatType.DATE
    );
    this.displayData['notes'] = generalFormat(
      values['notes'],
      '',
      FormatType.NONE
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
