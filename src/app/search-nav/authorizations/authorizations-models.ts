import { HealtheSelectOption, HealtheTableColumnDef } from '@shared';
import { AbstractControlOptions, ValidatorFn } from '@angular/forms';

export enum AuthorizationSearchFormFieldType {
  Text,
  Select,
  // Date, // NOT YET IMPLEMENTED
  DateRange
}

export interface AuthorizationSearchFormField<O, C> {
  type: AuthorizationSearchFormFieldType;
  label: string;
  placeholder?: string;
  formControlName: string;
  compareWith?: (option: O, selection: O) => boolean;
  options?: HealtheSelectOption<O>[];
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  componentConfig?: C;
  defaultValue?: string;
}

export enum ExportFormatOptions {
  PDF = 'PDF',
  EXCEL = 'EXCEL'
}

export interface DownloadExportResultsParameters {
  filename: string;
  exportFormatOption: ExportFormatOptions;
  columns: HealtheTableColumnDef[];
}
