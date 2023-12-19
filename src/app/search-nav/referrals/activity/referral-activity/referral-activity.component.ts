import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { first, map, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { VerbiageService } from 'src/app/verbiage.service';

import { ReferralsSearchBaseComponent } from '../referrals-search-base.component';
import {
  loadActivityReferrals,
  saveActivitySearchForm
} from '../../../store/actions';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  getActivityReferrals,
  getActivityReferralSearchForm,
  getActivityReferralsErrors,
  getActivityReferralsLoading
} from '../../../store/selectors';
import { DatePipe } from '@angular/common';
import { UserInfoSetInternalUserCustomer } from '../../../../user/store/actions/user.actions';
import { REFERRAL_ACTIVITY_SEARCH_BOX_VALIDATOR } from '../components/referral-search-box/referral-search-box.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'healthe-referral-activity',
  templateUrl: './referral-activity.component.html',
  styleUrls: ['./referral-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralActivityComponent extends ReferralsSearchBaseComponent
  implements OnInit {
  resultsLoadedFirstTime: boolean = false;
  searchHelperText =
    'Search for a referral to view the activity. Fill out referral ID or claim number, and a date range no greater than one year to search.';
  errorsMessages$: Observable<string[]>;

  constructor(
    protected fb: FormBuilder,
    protected store$: Store<RootState>,
    protected verbiageService: VerbiageService,
    private pageTitleService: PageTitleService,
    private datePipe: DatePipe
  ) {
    super(fb, store$, verbiageService);
    this.pageTitleService.setTitle('Active Referrals');
    this.searchFormName = 'Referral Activity';
  }

  ngOnInit(): void {
    super.ngOnInit();
    super.setThreeMonthsRange();
    this.registeredEvents();
    this.searchformGroup.addControl('displayLimit', new FormControl(200));
    if (this.isInternal) {
      const customerId: FormControl = new FormControl(
        null,
        Validators.required
      );
      this.searchformGroup.addControl('customerId', customerId);

      customerId.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((value) => {
          this.store$.dispatch(new UserInfoSetInternalUserCustomer(value));
          this.searchTableConfig.customerID = value;
        });
    }

    this.searchformGroup.setValidators(REFERRAL_ACTIVITY_SEARCH_BOX_VALIDATOR);

    this.store$
      .select(getActivityReferralSearchForm)
      .pipe(first())
      .subscribe((values) => {
        if (null != values) {
          this.searchformGroup.setValue(values);
        }
      });

    this.errorsMessages$ = this.store$.pipe(
      select(getActivityReferralsErrors),
      map((errors) => (errors ? errors : null))
    );
  }

  search(form: FormGroup): void {
    this.store$.dispatch(saveActivitySearchForm({ form: form.value }));
    let formValues = { ...form.value };
    formValues.includeRfsResults = true;
    formValues.doiStartDate = this.datePipe.transform(
      new Date(formValues.doiStartDate),
      'yyyy-MM-dd'
    );
    formValues.doiEndDate = this.datePipe.transform(
      new Date(formValues.doiEndDate),
      'yyyy-MM-dd'
    );
    formValues.assignedTo = null;
    this.store$.dispatch(loadActivityReferrals({ searchValues: formValues }));
  }

  protected registeredEvents(): void {
    this.isLoadingResults$ = this.store$.pipe(
      select(getActivityReferralsLoading)
    );
    this.results$ = this.store$.pipe(select(getActivityReferrals));
  }
}
