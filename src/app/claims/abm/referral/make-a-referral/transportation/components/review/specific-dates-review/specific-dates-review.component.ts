import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faInfoCircle, faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { RootState } from '../../../../../../../../store/models/root.models';
import { SetSpecificDateNote } from '../../../../../store/actions/make-a-referral.actions';
import {
  FormatType,
  generalFormat,
  referralLocationToFullString
} from '../../../../make-a-referral-shared';
import { MakeAReferralService } from '../../../../make-a-referral.service';
import { DateFormMode } from '../../../../../store/models/make-a-referral.models';

@Component({
  selector: 'healthe-specific-date-review',
  templateUrl: './specific-dates-review.component.html',
  styleUrls: ['./specific-dates-review.component.scss']
})
export class SpecificDatesReviewComponent implements OnInit {
  @Input()
  values$: Observable<any>;
  @Input()
  usingReturnedFormState = false;
  @Input()
  step: string = '';
  faStickyNote = faStickyNote;
  faInfoCircle = faInfoCircle;
  columnCount = 7;
  columnSpacing: number;
  isAlive: boolean = true;
  displayData = {};

  constructor(
    public dialog: MatDialog,
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService
  ) {
    this.columnSpacing = 100 / this.columnCount;
  }

  ngOnInit(): void {
    this.values$
      .pipe(
        takeWhile(
          (values) =>
            this.isAlive &&
            values['authorizationDateType'] === DateFormMode.SpecificDate
        )
      )
      .subscribe((values) => this.buildDisplayData(values));
  }

  buildDisplayData(values): void {
    this.displayData['driverLanguage'] = values['driverLanguage'];
    this.displayData['rushServiceNeeded'] = values['rushServiceNeeded'];
    this.displayData['paidAsExpense'] = values['paidAsExpense'];
    this.displayData['schedulingForm'] = this.buildSchedulingForm(
      values['schedulingForm']
    );
    this.displayData['specifiedLocations'] = this.buildSpecifiedLocations(
      values['schedulingForm']
    );
  }

  addNotes(index: number, note: string): void {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this ' + this.step.replace('-', ' ') + ' request',
        note,
        this.usingReturnedFormState
      )
      .subscribe((newNote) => {
        this.store$.dispatch(
          new SetSpecificDateNote({
            ngrxStepName: this.step,
            index: index,
            note: newNote
          })
        );
      });
  }

  private buildSchedulingForm(value: any): any[] {
    const data = [];
    if (value && value.constructor === Array) {
      value.forEach((item) => {
        const obj = {
          fromAddress: {
            columnText: '',
            tooltip: ''
          },
          toAddress: {
            columnText: '',
            tooltip: ''
          }
        };

        data.push(obj);

        obj['specificDate'] = generalFormat(
          item['specificDate'],
          '',
          FormatType.DATE
        );

        obj['pickupTime'] = generalFormat(
          item['pickupTime'],
          '',
          FormatType.TIME_12HR
        );

        obj['appointmentType'] = generalFormat(
          item['appointmentType'],
          '',
          FormatType.NONE
        );

        obj['appointmentTime'] = generalFormat(
          item['appointmentTime'],
          '',
          FormatType.TIME_12HR
        );

        if (item['fromAddress']) {
          obj['fromAddress'] = {
            columnText: generalFormat(
              item['fromAddress']['type'],
              '',
              FormatType.NONE
            ),
            tooltip:
              item['fromAddress']['name'] +
              ' - ' +
              item['fromAddress']['address']
          };
        }

        if (item['toAddress']) {
          obj['toAddress'] = {
            columnText: generalFormat(
              item['toAddress']['type'],
              '',
              FormatType.NONE
            ),
            tooltip:
              item['toAddress']['name'] + ' - ' + item['toAddress']['address']
          };
        }

        obj['notes'] = generalFormat(item['notes'], '', FormatType.NONE);
      });
    }

    return data;
  }

  private buildSpecifiedLocations(schedulingForms: Object[]): any[] {
    if (schedulingForms) {
      let locationsList: string[] = [];
      schedulingForms.forEach((schedulingForm) => {
        locationsList.push(
          referralLocationToFullString(schedulingForm['fromAddress'])
        );
        locationsList.push(
          referralLocationToFullString(schedulingForm['toAddress'])
        );
      });
      return [...new Set(locationsList)];
    } else {
      return [];
    }
  }
}
