import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { combineLatest, from, Observable, zip } from 'rxjs';
import {
  distinct,
  filter,
  first,
  map,
  mergeMap,
  toArray
} from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev-remote';
import { DATE_PICKER_BASE_OPTIONS } from '../../../../../../../../claim-view/activity/activity-table/date-picker-options';
import { RootState } from '../../../../../../../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../../../store/selectors/router.selectors';
import {
  getActivityTableFilters,
  getCurrentActivityCards
} from '../../../../../store/selectors/referral-activity.selectors';
import {
  ReferralStage,
  ReferralStageUtil,
  ReferralTableDocumentExportRequest
} from '../../../../../store/models';
import {
  ExportTableView,
  UpdateTableFilters
} from '../../../../../store/actions/referral-activity.actions';
import { Router } from '@angular/router';

const REFERRAL_ACTIVITY_DATE_PICKER_OPTIONS = {
  range: null,
  ...DATE_PICKER_BASE_OPTIONS
};

const moment = _moment;

@Component({
  selector: 'healthe-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit {
  filterFormGroup = new FormGroup({
    stage: new FormControl(),
    status: new FormControl(),
    date: new FormControl()
  });
  stageOptions: Array<{ label: string; value: ReferralStage }> = [
    {
      value: ReferralStage.VENDOR_ASSIGNMENT,
      label: ReferralStageUtil.toString(ReferralStage.VENDOR_ASSIGNMENT)
    },
    {
      value: ReferralStage.SCHEDULE_SERVICE,
      label: ReferralStageUtil.toString(ReferralStage.SCHEDULE_SERVICE)
    },
    {
      value: ReferralStage.SERVICE_SCHEDULED,
      label: ReferralStageUtil.toString(ReferralStage.SERVICE_SCHEDULED)
    },
    {
      value: ReferralStage.RESULTS,
      label: ReferralStageUtil.toString(ReferralStage.RESULTS)
    },
    {
      value: ReferralStage.BILLING,
      label: ReferralStageUtil.toString(ReferralStage.BILLING)
    },
    {
      value: ReferralStage.AUTHORIZATION_HISTORY,
      label: ReferralStageUtil.toString(ReferralStage.AUTHORIZATION_HISTORY)
    }
  ];

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  statusOptions$: Observable<
    Array<{
      label: string;
      value: string;
    }>
  > = this.store$.pipe(
    select(getCurrentActivityCards),
    map((cardStateList) =>
      cardStateList.map((cardState) => cardState.tableRow)
    ),
    mergeMap((cardTableRow) =>
      from(cardTableRow).pipe(
        distinct((state) => state.status),
        map((state) => state.status),
        map((status: string) => {
          return { label: status, value: status };
        }),
        toArray(),
        map((array) => {
          array.sort((a, b) => a.label.localeCompare(b.label));
          return array;
        })
      )
    )
  );
  dateRangeOptions = REFERRAL_ACTIVITY_DATE_PICKER_OPTIONS;
  filterFormInitialValues$ = this.statusOptions$.pipe(
    filter((options) => !_.isEmpty(options)),
    map((statusOptions) => [
      statusOptions.map((option) => option.value),
      this.stageOptions.map((option) => option.value),
      this.dateRangeOptions.range
    ]),
    first()
  );

  activityTableFilter$ = this.store$.pipe(select(getActivityTableFilters));
  exportDropdownOptions = ['PDF', 'EXCEL'];

  exportMenuOpened: boolean = false;

  constructor(public store$: Store<RootState>, public router: Router) {}

  ngOnInit() {
    zip(this.filterFormInitialValues$, this.activityTableFilter$)
      .pipe(first())
      .subscribe(([[status, stage, date], filters]) => {
        if (filters.status == null) {
          this.filterFormGroup.setValue({ status, stage, date });
          this.store$.dispatch(
            new UpdateTableFilters(this.filterFormGroup.getRawValue())
          );
        } else {
          this.filterFormGroup.setValue(filters);
        }
      });

    this.filterFormGroup.valueChanges
      .pipe(filter((value) => value.stage != null))
      .subscribe((filters) => {
        this.store$.dispatch(new UpdateTableFilters(filters));
      });
  }

  getTriggerText(multiSelect, suffix: string) {
    if (multiSelect.ngControl.value && multiSelect.options) {
      const valueLength = multiSelect.ngControl.value.length;
      const optionLength = multiSelect.options.length;
      if (valueLength === optionLength) {
        return `All ${suffix}`;
      } else {
        return `Showing ${valueLength} of ${optionLength}`;
      }
    }
  }

  getTooltipText(multiSelect) {
    const values = multiSelect.ngControl.value;
    if (multiSelect.options) {
      return multiSelect.options
        .filter((option) => _.includes(values, option.value))
        .map((option) => option.viewValue)
        .join(', ');
    }
    return '';
  }

  doExport(exportType: string) {
    combineLatest(
      this.encodedCustomerId$,
      this.encodedClaimNumber$,
      this.encodedReferralId$
    )
      .pipe(first())
      .subscribe(([customerId, claimNumber, referralId]) => {
        const exportOptions: ReferralTableDocumentExportRequest = new ReferralTableDocumentExportRequest();

        exportOptions.encodedClaimNumber = claimNumber;
        exportOptions.encodedCustomerId = customerId;
        exportOptions.encodedReferralId = referralId;
        exportOptions.exportType = exportType;

        if (this.router.url.indexOf('transportation') !== -1) {
          exportOptions.isCore = true;
        }

        const { date, stage, status } = this.filterFormGroup.getRawValue();

        if (null != date) {
          exportOptions.fromDate = moment(date.fromDate).format(
            environment.dateFormat
          );

          exportOptions.toDate = moment(date.toDate).format(
            environment.dateFormat
          );
        }

        exportOptions.stages = stage;
        exportOptions.statuses = status;

        this.store$.dispatch(new ExportTableView(exportOptions));
      });
  }

  resetFilters() {
    this.filterFormInitialValues$
      .pipe(first())
      .subscribe(([status, stage, date]) => {
        this.filterFormGroup.reset({ status, stage, date });
      });
  }
}
