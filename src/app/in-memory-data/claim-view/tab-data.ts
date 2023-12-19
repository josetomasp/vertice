import {
  HealtheTableColumnDef,
  HealtheTableColumnType
} from '@healthe/vertice-library';
import { Tab } from '../../in-memory-data.service';

export const navigationTabs: Tab[] = [{ name: 'Activity', isSelected: true }];

export const activityTabs: Tab[] = [
  { name: 'All', isSelected: true },
  { name: 'Pharmacy', isSelected: false },
  { name: 'Clinical', isSelected: false }
];

export const allTabColumns: Array<Partial<HealtheTableColumnDef>> = [
  {
    defaultColumn: true,
    name: 'creationDate',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'itemName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'activityType',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'quantity',
    dataType: HealtheTableColumnType.NUMBER
  },
  {
    defaultColumn: true,
    name: 'daysSupply',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'pharmacy',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'prescriberName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'descriptionReason',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'outcome',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'paidAmount',
    dataType: HealtheTableColumnType.CURRENCY
  },
  {
    defaultColumn: true,
    name: 'modifiedByUser',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'dateModified',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'priorAuthDateRange',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'productType',
    dataType: HealtheTableColumnType.STRING
  }
];

export const pharmacyTabColumns: Array<Partial<HealtheTableColumnDef>> = [
  {
    defaultColumn: true,
    name: 'creationDate',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'itemName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'activityType',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'quantity',
    dataType: HealtheTableColumnType.NUMBER
  },
  {
    defaultColumn: true,
    name: 'daysSupply',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'pharmacy',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'prescriberName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'descriptionReason',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'outcome',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'paidAmount',
    dataType: HealtheTableColumnType.CURRENCY
  },
  {
    defaultColumn: false,
    name: 'modifiedByUser',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'dateModified',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'priorAuthDateRange',
    dataType: HealtheTableColumnType.STRING
  }
];

export const clinicalTabColumns: Array<Partial<HealtheTableColumnDef>> = [
  {
    defaultColumn: true,
    name: 'creationDate',
    dataType: HealtheTableColumnType.DATE
  },
  {
    defaultColumn: true,
    name: 'activityType',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'itemName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'prescriberName',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'descriptionReason',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'outcome',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'paidAmount',
    dataType: HealtheTableColumnType.CURRENCY
  },

  {
    defaultColumn: true,
    name: 'modifiedByUser',
    dataType: HealtheTableColumnType.STRING
  },
  {
    defaultColumn: true,
    name: 'dateModified',
    dataType: HealtheTableColumnType.DATE
  }
];
