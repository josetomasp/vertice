import { HealtheTableColumnType } from '@healthe/vertice-library';
import { HealtheTableColumnDef } from '@shared/models/table-column';
import {
  alphaNumericComparator,
  coPayStringComparator,
  currencyStringComparator,
  dateComparator,
  numericComparator
} from '@shared/lib/comparators';

export const BILLING_TAB_COLUMNS: HealtheTableColumnDef[] = [
  {
    label: 'Product Type',
    classes: ['healthe-table-cell'],
    name: 'productType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Service Date',
    classes: ['healthe-table-cell'],
    name: 'serviceDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Vendor/Provider Name',
    classes: ['healthe-table-cell'],
    name: 'providerName',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Provider ID',
    classes: ['healthe-table-cell'],
    name: 'providerID',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: alphaNumericComparator
  },
  {
    label: 'Item Name',
    classes: ['healthe-table-cell'],
    name: 'itemName',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },

  {
    label: 'Prescriber',
    classes: ['healthe-table-cell'],
    name: 'prescriberName',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Billed Amount',
    classes: [
      'healthe-table-cell',

      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    align: 'right',
    name: 'billedAmount',
    defaultColumn: true,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },
  {
    label: 'UC/Fee Amount',
    classes: [
      'healthe-table-cell',

      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    align: 'right',
    name: 'ucFeeAmount',
    defaultColumn: true,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },
  {
    label: 'Paid Amt',
    classes: [
      'healthe-table-cell',

      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    align: 'right',
    name: 'paidAmount',
    defaultColumn: true,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },
  {
    label: 'Paid Date',
    classes: ['healthe-table-cell'],
    name: 'paidDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
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
    label: 'Bill Image',
    classes: ['healthe-table-cell'],
    headerStyles: { width: '50px' },
    name: 'imagePath',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'EOB',
    classes: ['healthe-table-cell'],
    headerStyles: { width: '50px' },
    name: 'eobPath',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },

  {
    label: 'Fee Paid',
    classes: [
      'healthe-table-cell',

      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    align: 'right',
    name: 'paidFee',
    defaultColumn: false,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },

  {
    label: 'Code',
    classes: ['healthe-table-cell'],
    name: 'code',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Days Supply',
    classes: ['healthe-table-cell', 'healthe-table-cell_right'],
    headerStyles: { width: '3vw' },
    name: 'daysSupply',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Qty',
    classes: ['healthe-table-cell', 'healthe-table-cell_right'],
    headerStyles: { width: '3vw' },
    name: 'quantity',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Bill Source',
    classes: ['healthe-table-cell'],
    name: 'billSource',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Data Source',
    classes: ['healthe-table-cell'],

    name: 'dataSource',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Modified by',
    classes: ['healthe-table-cell'],
    name: 'modifiedBy',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Copay',
    classes: ['healthe-table-cell'],
    headerStyles: { width: '60px' },
    name: 'copayPercentage',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: coPayStringComparator
  }
];
