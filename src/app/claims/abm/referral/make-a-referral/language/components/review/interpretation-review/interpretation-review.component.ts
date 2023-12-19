import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faInfoCircle, faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { find } from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { SetSpecificDateNote } from 'src/app/claims/abm/referral/store/actions/make-a-referral.actions';
import {
  ClaimLocation,
  DateFormMode
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import {
  getApprovedLocations,
  getFormStateByName
} from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';
import {
  InterpretationDateRangeFormState,
  InterpretationFormState,
  InterpretationSpecificDateFormState
} from '../../../../../store/models/fusion/fusion-make-a-referral.models';
import { FormatType, generalFormat } from '../../../../make-a-referral-shared';
import { MakeAReferralService } from '../../../../make-a-referral.service';
import {
  buildLanguageSchedulingForm,
  buildLanguageSpecifiedLocations
} from '../../../language-shared';
import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_INTERPRETATION_STEP_NAME
} from '../../../language-step-definitions';

@Component({
  selector: 'healthe-interpretation-review',
  templateUrl: './interpretation-review.component.html',
  styleUrls: ['./interpretation-review.component.scss']
})
export class InterpretationReviewComponent implements OnInit, OnDestroy {
  interpretationStepName = LANGUAGE_INTERPRETATION_STEP_NAME;
  sectionTitle: string;
  specificDate = DateFormMode.SpecificDate;
  dateRange = DateFormMode.DateRange;
  dateMode: DateFormMode;
  displayData = {};
  columnCount = 5;
  columnSpacing: number;
  isAlive = true;
  faStickyNote = faStickyNote;
  faInfoCircle = faInfoCircle;

  public locations$ = this.store$.pipe(
    select(getApprovedLocations(LANGUAGE_ARCH_TYPE))
  );
  locations: ClaimLocation[] = [];

  @Input()
  usingReturnedFormState = false;
  sectionName = 'Language';

  constructor(
    public dialog: MatDialog,
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService
  ) {
    this.columnSpacing = 100 / this.columnCount;
  }

  private static buildDateRange(
    schedulingForm: InterpretationDateRangeFormState
  ): string {
    const date1 = generalFormat(schedulingForm.startDate, '', FormatType.DATE);

    const date2 = generalFormat(schedulingForm.endDate, '', FormatType.DATE);

    return date1 + ' - ' + date2;
  }

  ngOnInit() {
    this.locations$.subscribe((locations) => (this.locations = locations));

    this.store$
      .pipe(
        select(
          getFormStateByName({
            formStateChild: this.interpretationStepName,
            useReturnedValues: this.usingReturnedFormState
          })
        )
      )
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((values: InterpretationFormState) => {
        this.dateMode = values.authorizationDateType;
        /*
         Added this because sometimes the functions deep within the call stack error but don't log out
         Those errors close the observable causing the review screen to stop updating
        */
        try {
          this.buildDisplayData(values);
          this.sectionTitle = 'On-Site Interpretation';
          if (this.usingReturnedFormState) {
            this.sectionTitle += ' - Referral #' + values.referralId;
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  buildDisplayData(values: InterpretationFormState) {
    this.displayData['language'] = values.language;
    this.displayData['rushServiceNeeded'] = values.rushServiceNeeded;
    this.displayData['paidAsExpense'] = values.paidAsExpense;
    // Dates
    if (values.schedulingForm) {
      if (values.authorizationDateType === DateFormMode.SpecificDate) {
        const schedulingForm = values.schedulingForm as InterpretationSpecificDateFormState[];
        this.displayData['schedulingForm'] = buildLanguageSchedulingForm(
          schedulingForm as InterpretationSpecificDateFormState[]
        );
        this.displayData['locations'] = buildLanguageSpecifiedLocations(
          schedulingForm as InterpretationSpecificDateFormState[]
        );
      } else if (values['authorizationDateType'] === DateFormMode.DateRange) {
        const schedulingForm = values.schedulingForm as InterpretationDateRangeFormState;
        this.displayData['locations'] = this.buildApprovedLocations(
          schedulingForm as InterpretationDateRangeFormState
        );
        this.displayData[
          'dateRange'
        ] = InterpretationReviewComponent.buildDateRange(
          schedulingForm as InterpretationDateRangeFormState
        );
        this.displayData['numberOfTrips'] = schedulingForm.tripsAuthorized;
        this.displayData['notes'] = schedulingForm.notes;
        if (values.certification) {
          this.displayData['certification'] =
            values.certification.subTypeDescription;
        }
        if (schedulingForm.certification) {
          this.displayData['certification'] =
            schedulingForm.certification.subTypeDescription;
        }
      }
    }
  }

  addNotes(index: number, note: string) {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this language interpretation request',
        note,
        this.usingReturnedFormState
      )
      .subscribe((newNote) => {
        this.store$.dispatch(
          new SetSpecificDateNote({
            ngrxStepName: this.interpretationStepName,
            index: index,
            note: newNote
          })
        );
      });
  }

  private buildApprovedLocations({
    approvedLocations,
    noLocationRestrictions
  }: InterpretationDateRangeFormState): string[] {
    const locations: string[] = [];
    if (null != approvedLocations && !noLocationRestrictions) {
      approvedLocations.forEach((id) => {
        const chosenLocation: ClaimLocation = find(this.locations, {
          id
        });
        if (chosenLocation) {
          locations.push(chosenLocation.type + ' - ' + chosenLocation.address);
        }
      });
    } else if (noLocationRestrictions) {
      locations.push('No Location Restrictions');
    }
    return locations;
  }
}
