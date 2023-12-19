import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormatType,
  generalFormat,
  referralLocationToFullString
} from '../../../../make-a-referral-shared';
import { select, Store } from '@ngrx/store';
import { getApprovedLocations } from '../../../../../store/selectors/makeReferral.selectors';
import { RootState } from '../../../../../../../../store/models/root.models';
import { TRANSPORTATION_ARCH_TYPE } from '../../../transportation-step-definitions';
import {
  ClaimLocation,
  DateFormMode
} from '../../../../../store/models/make-a-referral.models';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'healthe-date-range-review',
  templateUrl: './date-range-review.component.html',
  styleUrls: ['./date-range-review.component.scss']
})
export class DateRangeReviewComponent implements OnInit, OnDestroy {
  @Input()
  values$: Observable<any>;

  @Input()
  step: string = '';

  public claimLocations$ = this.store$.pipe(
    select(getApprovedLocations(TRANSPORTATION_ARCH_TYPE))
  );
  claimLocations: ClaimLocation[] = [];

  columnCount = 3;
  columnSpacing: number;
  isAlive: boolean = true;
  displayData = { approvedLocations: [] };

  constructor(public store$: Store<RootState>) {
    this.columnSpacing = 100 / this.columnCount;
  }

  ngOnInit() {
    this.claimLocations$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((locations) => (this.claimLocations = locations));

    this.values$
      .pipe(
        takeWhile(
          (values) =>
            this.isAlive &&
            values['authorizationDateType'] === DateFormMode.DateRange
        )
      )
      .subscribe((values) => this.buildDisplayData(values));
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  private buildDisplayData(values: any) {
    const schedulingForm = values['schedulingForm'];
    if (null != schedulingForm) {
      this.displayData['approvedLocations'] = this.buildApprovedLocations(
        schedulingForm
      );

      this.displayData['dateRange'] = this.buildDateRange(schedulingForm);
      if (true === schedulingForm['unlimitedTrips']) {
        this.displayData['numberOfTrips'] = 'Unlimited';
      } else {
        this.displayData['numberOfTrips'] = schedulingForm['tripsAuthorized'];
      }

      this.displayData['notes'] = schedulingForm['notes'];
    }

    this.displayData['driverLanguage'] = values['driverLanguage'];
    this.displayData['rushServiceNeeded'] = values['rushServiceNeeded'];
    this.displayData['paidAsExpense'] = values['paidAsExpense'];
  }

  private buildApprovedLocations(value: any) {
    const locations: string[] = [];

    const approvedLocations = value['approvedLocations'];
    if (null != approvedLocations && !value['noLocationRestrictions']) {
      approvedLocations.forEach((locationId: string) =>
        locations.push(
          referralLocationToFullString(
            this.claimLocations.find(
              (location: ClaimLocation) =>
                parseInt(location.id, 10) === parseInt(locationId, 10)
            )
          )
        )
      );
    } else if (value['noLocationRestrictions']) {
      locations.push('No Location Restrictions');
    }

    return locations;
  }

  private buildDateRange(schedulingForm: any) {
    const date1 = generalFormat(
      schedulingForm['startDate'],
      '',
      FormatType.DATE
    );

    const date2 = generalFormat(schedulingForm['endDate'], '', FormatType.DATE);

    return date1 + ' - ' + date2;
  }
}
