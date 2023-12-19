import * as moment from 'moment';
import { DATE_PICKER_BASE_OPTIONS } from 'src/app/claim-view/activity/activity-table/date-picker-options';
import { NgxDrpOptions } from '@healthe/vertice-library';
import { PbmAuthorizationDatePickerPreset } from './store/models/pbm-authorization-information/authorization-line-item.models';

export const POS_AUTH_DEFAULT_RANGE = {
  fromDate: moment().toDate(),
  toDate: moment().toDate()
};

export const POS_AUTH_DATE_PRESENTS_TO_1_YEAR = [
  {
    presetLabel: '1 Month',
    range: {
      fromDate: moment().toDate(),
      toDate: moment()
        .add(1, 'month')
        .toDate()
    }
  },
  {
    presetLabel: '3 Months',
    range: {
      fromDate: moment().toDate(),
      toDate: moment()
        .add(3, 'month')
        .toDate()
    }
  },
  {
    presetLabel: '6 Months',
    range: {
      fromDate: moment().toDate(),
      toDate: moment()
        .add(6, 'month')
        .toDate()
    }
  },
  {
    presetLabel: '1 Year',
    range: {
      fromDate: moment().toDate(),
      toDate: moment()
        .add(1, 'year')
        .toDate()
    }
  }
];

export const POS_AUTH_DATE_PICKER_OPTIONS = {
  range: POS_AUTH_DEFAULT_RANGE,
  ...DATE_PICKER_BASE_OPTIONS,
  toMinMax: {
    fromDate: new Date(),
    toDate: moment()
      .add(1, 'year')
      .toDate()
  },
  applyLabel: 'APPLY',
  presets: POS_AUTH_DATE_PRESENTS_TO_1_YEAR
};

export function generateSingleDatePickerConfig(
  fromDate: Date,
  presets: PbmAuthorizationDatePickerPreset[],
  maxDate: Date,
  useAllPresets = false
): NgxDrpOptions {
  const numberOfDaysIndex = useAllPresets ? -1 : 0;
  let config: NgxDrpOptions = {
    ...POS_AUTH_DATE_PICKER_OPTIONS,
    toMinMax: {
      fromDate: moment(fromDate).toDate(),
      toDate: maxDate
    },
    presets: presets
      ? presets
          .filter((present) => present.numberOfDays > numberOfDaysIndex)
          .map((preset) => {
            return {
              presetLabel: preset.displayString,
              range: {
                fromDate: moment(fromDate).toDate(),
                toDate: moment(fromDate)
                  .add(preset.numberOfDays, 'day')
                  .toDate()
              }
            };
          })
      : POS_AUTH_DATE_PRESENTS_TO_1_YEAR
  };
  return config;
}
