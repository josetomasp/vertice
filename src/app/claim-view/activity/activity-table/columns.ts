import { HealtheTableColumnType } from '@healthe/vertice-library';
import { alphaNumericComparator } from '@shared/lib/comparators/alphaNumericComparator';
import { currencyStringComparator } from '@shared/lib/comparators/currencyStringComparator';
import { dateComparator } from '@shared/lib/comparators/dateComparator';
import { numericComparator } from '@shared/lib/comparators/numericComparator';
import { HealtheTableColumnDef } from '@shared/models/table-column';
export const ALL_TAB_COLUMNS: Partial<HealtheTableColumnDef>[] = [
  {
    label: 'Creation Date',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'creationDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Type',
    classes: ['healthe-table-cell'],
    name: 'activityType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Outcome / Status',
    classes: ['healthe-table-cell'],
    name: 'outcome',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Description / Reason',
    classes: ['healthe-table-cell'],
    name: 'descriptionReason',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
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
    label: 'Pharmacy / Vendor',
    classes: ['healthe-table-cell'],
    name: 'pharmacy',
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
    label: 'Modified by User',
    classes: ['healthe-table-cell'],
    name: 'modifiedByUser',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Modified',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'dateModified',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Product Type',
    classes: ['healthe-table-cell'],
    name: 'productType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Filled',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'dateFilled',
    defaultColumn: false,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Qty',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_2vw',
      'healthe-table-cell_right',
      'healthe-quantity-body-cell_position',
      'healthe-table-column_quantityWidth'
    ],
    name: 'quantity',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Days Supply',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_3vw',
      'healthe-table-cell_right',
      'healthe-daysSupply-body-cell_position',
      'healthe-table-column_daysSupplyWidth'
    ],
    name: 'daysSupply',
    defaultColumn: false,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Paid Amt',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_5vw',
      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    align: 'right',
    name: 'paidAmount',
    defaultColumn: false,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },
  {
    label: 'Prior Auth Dates',
    classes: ['healthe-table-cell'],
    name: 'priorAuthDateRange',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Requestor / Role',
    classes: ['healthe-table-cell'],
    name: 'requestorRole',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  }
];
export const PHARMACY_TAB_COLUMNS: Partial<HealtheTableColumnDef>[] = [
  {
    label: 'Creation Date',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'creationDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Activity Type',
    classes: ['healthe-table-cell'],
    name: 'activityType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Outcome',
    classes: ['healthe-table-cell'],
    name: 'outcome',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Description / Reason',
    classes: ['healthe-table-cell'],
    name: 'descriptionReason',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
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
    label: 'Pharmacy',
    classes: ['healthe-table-cell'],
    name: 'pharmacy',
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
    label: 'Modified by User',
    classes: ['healthe-table-cell'],
    name: 'modifiedByUser',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Modified',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'dateModified',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Product Type',
    classes: ['healthe-table-cell'],
    name: 'productType',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Filled',
    classes: ['healthe-table-cell', 'healthe-table-column_dateWidth'],
    name: 'dateFilled',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Qty',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_2vw',
      'healthe-table-cell_right',
      'healthe-quantity-body-cell_position',
      'healthe-table-column_quantityWidth'
    ],
    name: 'quantity',
    defaultColumn: true,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Days Supply',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_3vw',
      'healthe-table-cell_right',
      'healthe-daysSupply-body-cell_position',
      'healthe-table-column_dateWidth'
    ],
    name: 'daysSupply',
    defaultColumn: true,
    dataType: HealtheTableColumnType.NUMBER,
    comparator: numericComparator
  },
  {
    label: 'Paid Amt',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_5vw',
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
    label: 'Prior Auth Dates',
    classes: ['healthe-table-cell'],
    name: 'priorAuthDateRange',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  }
];
export const CLINICAL_TAB_COLUMNS: Partial<HealtheTableColumnDef>[] = [
  {
    label: 'Creation Date',
    classes: ['healthe-table-column_dateWidth'],
    name: 'creationDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Activity Type',
    classes: ['healthe-table-cell'],
    name: 'activityType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Outcome',
    classes: ['healthe-table-cell'],
    name: 'outcome',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Description / Reason',
    classes: ['healthe-table-cell', 'healthe-table-column_15vw'],
    name: 'descriptionReason',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
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
    label: 'Pharmacy',
    classes: ['healthe-table-cell'],
    name: 'pharmacy',
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
    label: 'Modified by User',
    classes: ['healthe-table-cell'],
    name: 'modifiedByUser',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Modified',
    classes: ['healthe-table-column_dateWidth'],
    name: 'dateModified',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Product Type',
    classes: ['healthe-table-cell'],
    name: 'productType',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Paid Amt',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_5vw',
      'healthe-table-column_paidAmount',
      'healthe-table-cell_right',
      'healthe-paidAmount-body-cell_position'
    ],
    name: 'paidAmount',
    defaultColumn: true,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  }
];
export const ANCILLARY_TAB_COLUMNS: Partial<HealtheTableColumnDef>[] = [
  {
    label: 'Creation Date',
    classes: ['healthe-table-column_dateWidth'],
    name: 'creationDate',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Service Type',
    classes: ['healthe-table-cell'],
    name: 'activityType',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Status',
    classes: ['healthe-table-cell'],
    name: 'outcome',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Description / Reason',
    classes: ['healthe-table-cell', 'healthe-table-column_15vw'],
    name: 'descriptionReason',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
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
    label: 'Vendor',
    classes: ['healthe-table-cell'],
    name: 'pharmacy',
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
    label: 'Modified by User',
    classes: ['healthe-table-column_modifiedByUser'],
    name: 'modifiedByUser',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Date Modified',
    classes: ['healthe-table-column_dateWidth'],
    name: 'dateModified',
    defaultColumn: true,
    dataType: HealtheTableColumnType.DATE,
    comparator: dateComparator
  },
  {
    label: 'Product Type',
    classes: ['healthe-table-cell'],
    name: 'productType',
    defaultColumn: false,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  },
  {
    label: 'Paid Amt',
    classes: [
      'healthe-table-cell',
      'healthe-table-column_5vw',
      'healthe-table-cell_right',
      'healthe-table-column_paidAmount',
      'healthe-paidAmount-body-cell_position'
    ],
    name: 'paidAmount',
    defaultColumn: true,
    dataType: HealtheTableColumnType.CURRENCY,
    comparator: currencyStringComparator
  },
  {
    label: 'Requestor / Role',
    classes: ['healthe-table-cell'],
    name: 'requestorRole',
    defaultColumn: true,
    dataType: HealtheTableColumnType.STRING,
    comparator: alphaNumericComparator
  }
];
