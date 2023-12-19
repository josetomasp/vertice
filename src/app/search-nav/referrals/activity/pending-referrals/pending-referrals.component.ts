import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { hexEncode } from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import { Observable } from 'rxjs';
import { filter, first, map, mergeMap, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { VerbiageService } from 'src/app/verbiage.service';
import { UserInfoSetInternalUserCustomer } from '../../../../user/store/actions/user.actions';
import { UserInfo } from '../../../../user/store/models/user.models';
import { getUserInfo } from '../../../../user/store/selectors/user.selectors';
import { SearchNavService } from '../../../search-nav.service';
import {
  loadAssignedAdjustersRequest,
  loadPendingReferrals,
  savePendingSearchForm
} from '../../../store/actions';
import {
  getAssignedAdjusters,
  getNavSearchState,
  getNeedToLoadAssignedAdjusters,
  getPendingReferrals,
  getPendingReferralSearchForm,
  getPendingReferralsErrors,
  getPendingReferralsLoading
} from '../../../store/selectors';

import { ReferralsSearchBaseComponent } from '../referrals-search-base.component';

@Component({
  selector: 'healthe-pending-referrals',
  templateUrl: './pending-referrals.component.html',
  styleUrls: ['./pending-referrals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingReferralsComponent
  extends ReferralsSearchBaseComponent
  implements OnInit
{
  searchHelperText =
    'This screen displays Referrals in an “Internal Pend” and “Pended to Vendor” status.';

  errorsMessages$: Observable<string[]>;

  navSearchState$ = this.store$.pipe(
    select(getNavSearchState),
    takeUntil(this.onDestroy$),
    filter((navSearchState) => !navSearchState.searchOptions.isOptionsLoading)
  );

  assignedAdjusters$ = this.store$.pipe(
    select(getAssignedAdjusters),
    takeUntil(this.onDestroy$)
  );

  constructor(
    protected fb: FormBuilder,
    protected store$: Store<RootState>,
    protected verbiageService: VerbiageService,
    private pageTitleService: PageTitleService,
    private datePipe: DatePipe,
    private searchNavService: SearchNavService
  ) {
    super(fb, store$, verbiageService);
    // Not re-using the string value to not confuse intention as it's not expected to match
    this.pageTitleService.setTitle('Pending Referrals');
    this.searchFormName = 'Pending Referrals';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.registeredEvents();
    if (this.isInternal) {
      const customerIdFormControl: FormControl = new FormControl(
        null,
        Validators.required
      );
      this.searchformGroup.addControl('customerId', customerIdFormControl);

      this.users$ = customerIdFormControl.valueChanges.pipe(
        mergeMap((customerId) => {
          this.store$.dispatch(new UserInfoSetInternalUserCustomer(customerId));
          this.searchTableConfig.customerID = customerId;
          this.searchformGroup.get('assignedTo').setValue('All');
          this.defaultAssignedAdjuster = 'All';
          return this.searchNavService.getActiveAdjustersByCustomer(
            hexEncode(customerId)
          );
        }),
        takeUntil(this.onDestroy$)
      );
    } else {
      this.searchformGroup
        .get('assignedTo')
        .setValidators([Validators.required]);

      this.users$ = this.store$.pipe(
        select(getUserInfo),
        mergeMap(({ customerID, username }: UserInfo) => {
          this.store$
            .pipe(select(getNeedToLoadAssignedAdjusters), first())
            .subscribe((needToLoad) => {
              if (needToLoad) {
                this.store$.dispatch(
                  loadAssignedAdjustersRequest({
                    encodedCustomerId: hexEncode(customerID)
                  })
                );
              }
            });

          this.searchformGroup.get('assignedTo').setValue(username);
          this.defaultAssignedAdjuster = username;

          return this.assignedAdjusters$;
        })
      );
    }

    this.store$
      .select(getPendingReferralSearchForm)
      .pipe(first())
      .subscribe((values) => {
        if (null != values) {
          this.searchformGroup.setValue(values);
        }
      });

    this.errorsMessages$ = this.store$.pipe(
      select(getPendingReferralsErrors),
      map((errors) => (errors ? errors : null))
    );
  }

  search(form: FormGroup): void {
    this.store$.dispatch(savePendingSearchForm({ form: form.value }));
    const searchValues = { ...form.value, status: 'Pending' };
    if (null != searchValues.doiStartDate) {
      searchValues.doiStartDate = this.datePipe.transform(
        new Date(searchValues.doiStartDate),
        'yyyy-MM-dd'
      );
    }

    if (null != searchValues.doiEndDate) {
      searchValues.doiEndDate = this.datePipe.transform(
        new Date(searchValues.doiEndDate),
        'yyyy-MM-dd'
      );
    }

    if (null != searchValues.assignedTo) {
      if ('all' === searchValues.assignedTo.toLowerCase()) {
        searchValues.assignedTo = null;
      }
    }

    if (null != searchValues.serviceType) {
      if ('all' === searchValues.serviceType.toLowerCase()) {
        searchValues.serviceType = null;
      }
    }

    this.store$.dispatch(
      loadPendingReferrals({
        searchValues
      })
    );
  }

  protected registeredEvents(): void {
    this.isLoadingResults$ = this.store$.pipe(
      select(getPendingReferralsLoading)
    );
    this.results$ = this.store$.pipe(select(getPendingReferrals));
  }
}
