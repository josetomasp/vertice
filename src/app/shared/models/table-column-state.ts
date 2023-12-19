import { HealtheSelectOption } from '../lib';

export enum TableColumnState {
  TruncateText = 'truncateText',
  WrapText = 'wrapText',
  ExpandColumns = 'expandColumns'
}

export const columnViewOptionLabels = {
  [TableColumnState.TruncateText]: 'Truncate Text',
  [TableColumnState.WrapText]: 'Wrap Text',
  [TableColumnState.ExpandColumns]: 'Expand to Fit Text'
};

export const columnViewOptions: Array<HealtheSelectOption<TableColumnState>> = [
  {
    value: TableColumnState.TruncateText,
    label: columnViewOptionLabels[TableColumnState.TruncateText]
  },
  {
    value: TableColumnState.WrapText,
    label: columnViewOptionLabels[TableColumnState.WrapText]
  },
  {
    value: TableColumnState.ExpandColumns,
    label: columnViewOptionLabels[TableColumnState.ExpandColumns]
  }
];
