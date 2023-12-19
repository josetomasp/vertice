import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../../../../store/models/root.models';
import { getFormStateByName } from '../../../../../store/selectors/makeReferral.selectors';
import { TRANSPORTATION_LODGING_STEP_NAME } from '../../../transportation-step-definitions';
import { takeWhile } from 'rxjs/operators';
import { FormatType, generalFormat } from '../../../../make-a-referral-shared';

@Component({
  selector: 'healthe-lodging-review',
  templateUrl: './lodging-review.component.html',
  styleUrls: ['./lodging-review.component.scss']
})
export class LodgingReviewComponent implements OnInit {
  @Input()
  usingReturnedFormState = false;
  sectionTitle: string;
  stepName = TRANSPORTATION_LODGING_STEP_NAME;
  isAlive: boolean = true;
  displayData = {};
  sectionName = 'Transportation';

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.store$
      .pipe(
        select(
          getFormStateByName({
            formStateChild: this.stepName,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((values) => {
        this.buildDisplayData(values);
        this.sectionTitle = 'Lodging Information';
        if (this.usingReturnedFormState) {
          this.sectionTitle += ' - Referral #' + values.referralId;
        }
      });
  }

  buildDisplayData(values) {
    this.displayData['destination'] = {
      value: generalFormat(values['destination'], 'N/A', FormatType.NONE),
      label: 'Destination'
    };
    this.displayData['checkInDate'] = {
      value: generalFormat(values['checkInDate'], 'N/A', FormatType.DATE),
      label: 'Check In Date'
    };
    this.displayData['checkOutDate'] = {
      value: generalFormat(values['checkOutDate'], 'N/A', FormatType.DATE),
      label: 'Check Out Date'
    };
    this.displayData['numberOfGuests'] = {
      value: generalFormat(values['numberOfGuests'], 'N/A', FormatType.NONE),
      label: 'Number Of Guests'
    };
    this.displayData['numberOfRooms'] = {
      value: generalFormat(values['numberOfRooms'], 'N/A', FormatType.NONE),
      label: 'Number of Rooms'
    };
    this.displayData['priceOfRoom'] = {
      value: generalFormat(values['priceOfRoom'], 'N/A', FormatType.NONE),
      label: 'Price of Room'
    };
    this.displayData['numberOfNights'] = {
      value: generalFormat(values['numberOfNights'], 'N/A', FormatType.NONE),
      label: 'Number of Nights'
    };
    this.displayData['appointmentType'] = {
      value: generalFormat(values['appointmentType'], 'N/A', FormatType.NONE),
      label: 'Appointment Type'
    };

    this.displayData['appointmentTime'] = {
      value: generalFormat(
        values['appointmentTime'],
        'N/A',
        FormatType.TIME_12HR
      ),
      label: 'Appointment Time'
    };
    this.displayData['appointmentDate'] = {
      value: generalFormat(values['appointmentDate'], 'N/A', FormatType.DATE),
      label: 'Appointment Date'
    };
    this.displayData['notes'] = {
      value: generalFormat(values['notes'], '', FormatType.NONE),
      label: 'Notes'
    };
  }
}
