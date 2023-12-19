import * as _moment from 'moment';

const moment = _moment;
export const DATE_PICKER_BASE_OPTIONS = {
  fromMinMax: { fromDate: null, toDate: new Date() },
  toMinMax: { fromDate: null, toDate: new Date() },
  calendarOverlayConfig: {
    panelClass: 'ngx-mat-drp-overlay',
    hasBackdrop: true,
    backdropClass: 'ngx-mat-drp-overlay-backdrop',
    shouldCloseOnBackdropClick: true
  },
  applyLabel: 'SUBMIT',
  presets: [
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
    },
    {
      presetLabel: 'Past 2 Years',
      range: {
        fromDate: moment()
          .subtract(2, 'year')
          .toDate(),
        toDate: moment().toDate()
      }
    }
  ],
  format: 'mediumDate'
};
