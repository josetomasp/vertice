import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faInfoCircle, faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { SetSpecificDateNote } from 'src/app/claims/abm/referral/store/actions/make-a-referral.actions';
import { DateFormMode } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { getFormStateByName } from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';
import { DocumentTranslationFormState } from '../../../../../store/models/fusion/fusion-make-a-referral.models';
import { MakeAReferralService } from '../../../../make-a-referral.service';
import {
  buildLanguageSchedulingForm,
  buildLanguageSpecifiedLocations
} from '../../../language-shared';
import { LANGUAGE_TRANSLATION_STEP_NAME } from '../../../language-step-definitions';

@Component({
  selector: 'healthe-translation-review',
  templateUrl: './translation-review.component.html',
  styleUrls: ['./translation-review.component.scss']
})
export class TranslationReviewComponent implements OnInit, OnDestroy {
  stepName = LANGUAGE_TRANSLATION_STEP_NAME;
  sectionTitle: string;
  specificDate = DateFormMode.SpecificDate;
  dateRange = DateFormMode.DateRange;
  displayData = {};
  columnCount = 3;
  columnSpacing: number;
  isAlive = true;
  faStickyNote = faStickyNote;
  faInfoCircle = faInfoCircle;
  public values$;

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

  ngOnInit() {
    this.values$ = this.store$.pipe(
      select(
        getFormStateByName({
          formStateChild: this.stepName,
          useReturnedValues: this.usingReturnedFormState
        })
      )
    );

    this.values$.pipe(takeWhile(() => this.isAlive)).subscribe((values) => {
      this.buildDisplayData(values);
      this.sectionTitle = 'Document Translation';
      if (this.usingReturnedFormState) {
        this.sectionTitle += ' - Referral #' + values.referralId;
      }
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  buildDisplayData(values: DocumentTranslationFormState) {
    this.displayData['language'] = values.language;
    this.displayData['rushServiceNeeded'] = values.rushServiceNeeded;
    this.displayData['paidAsExpense'] = values.paidAsExpense;
    // Dates
    const schedulingForm = values.schedulingForm;
    if (schedulingForm) {
      this.displayData['schedulingForm'] = buildLanguageSchedulingForm(
        schedulingForm
      );
      this.displayData['locations'] = buildLanguageSpecifiedLocations(
        schedulingForm
      );
    }
  }

  addNotes(index: number, note: string) {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this document translation request',
        note,
        this.usingReturnedFormState
      )
      .subscribe((newNote) => {
        this.store$.dispatch(
          new SetSpecificDateNote({
            ngrxStepName: this.stepName,
            index: index,
            note: newNote
          })
        );
      });
  }
}
