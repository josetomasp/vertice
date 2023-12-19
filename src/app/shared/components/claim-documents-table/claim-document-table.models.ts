import {
  DocumentsFilters,
  DocumentsFilterTriggerText
} from '@shared/store/models/claim-documents-table.models';

export interface DocumentTableViewModel {
  pageSize: number;
  numberOfDocuments: number;
  errors: string[];
  isLoading: boolean;
}

export interface DocumentTableFilterViewModel {
  allDocumentsFilters: DocumentsFilters;
  documentsTriggerTexts: DocumentsFilterTriggerText;
}
