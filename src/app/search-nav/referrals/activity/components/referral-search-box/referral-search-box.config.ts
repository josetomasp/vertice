import * as moment from 'moment';
import { DATE_PICKER_BASE_OPTIONS } from 'src/app/claim-view/activity/activity-table/date-picker-options';

export const NAV_DATE_LAST_THREE_MONTHS_RANGE = {
  fromDate: moment()
    .subtract(3, 'month')
    .toDate(),
  toDate: moment().toDate()
};

export const NAV_DATE_PRESENTS_TO_1_YEAR = [
  {
    presetLabel: 'Past Month',
    range: {
      fromDate: moment()
        .subtract(1, 'month')
        .toDate(),
      toDate: moment().toDate()
    }
  },
  {
    presetLabel: 'Past 3 Months',
    range: {
      fromDate: moment()
        .subtract(3, 'month')
        .toDate(),
      toDate: moment().toDate()
    }
  },
  {
    presetLabel: 'Past 6 Months',
    range: {
      fromDate: moment()
        .subtract(6, 'month')
        .toDate(),
      toDate: moment().toDate()
    }
  },
  {
    presetLabel: 'Past Year',
    range: {
      fromDate: moment()
        .subtract(1, 'year')
        .toDate(),
      toDate: moment().toDate()
    }
  }
];

export const NAV_DATE_PICKER_OPTIONS = {
  range: NAV_DATE_LAST_THREE_MONTHS_RANGE,
  ...DATE_PICKER_BASE_OPTIONS,
  applyLabel: 'APPLY',
  presets: NAV_DATE_PRESENTS_TO_1_YEAR
};

export const NAV_SEARCH_REFERRALS_LABELS = {
  referralId: 'Referral ID',
  claimNumber: 'Claim Number',
  claimantLastName: 'Claimant Last Name',
  claimantFirstName: 'Claimant First Name',
  assignedTo: 'Assigned To',
  status: 'Status',
  serviceType: 'Service Type'
};

export const REFERRAL_ACTIVITY_SEARCH_BOX_VALIDATOR = [
  (control) => {
    if (
      (control.get('referralId') && control.get('referralId').value) ||
      (control.get('claimNumber') && control.get('claimNumber').value)
    ) {
      return null;
    } else {
      return { invalidSearchParameters: true };
    }
  }
];
