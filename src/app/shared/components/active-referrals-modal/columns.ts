import { HealtheTableColumnType } from '@healthe/vertice-library';
import { alphaNumericComparator } from 'src/app/shared/lib/comparators';
import { HealtheTableColumnDef } from '@shared';

export const ACTIVE_REFERRAL_MODAL_COLUMNS: HealtheTableColumnDef[] = [
  {
    label: 'Referral Id',
    classes: ['healthe-table-cell'],
    name: 'referralId',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Service Type',
    classes: ['healthe-table-cell'],
    name: 'serviceType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'DOS/Date Range',
    classes: ['healthe-table-cell'],
    name: 'datesOfService',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Vendor',
    classes: ['healthe-table-cell'],
    name: 'vendor',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Status',
    classes: ['healthe-table-cell'],
    name: 'status',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Submitted By',
    classes: ['healthe-table-cell'],
    name: 'submittedBy',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  }
];

export const PM_EXTEND_ACTIVE_REFERRAL_MODAL_COLUMN: HealtheTableColumnDef = {
  label: ' ',
  classes: ['healthe-table-cell'],
  name: 'extendButton',
  defaultColumn: true,
  dataType: HealtheTableColumnType.STRING,
  comparator: alphaNumericComparator
};
