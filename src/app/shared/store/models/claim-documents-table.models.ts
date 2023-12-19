import { alphaNumericComparator, dateComparator } from 'src/app/shared/lib';

export interface DocumentsFilters {
  documentDescription: string[];
  documentType: string[];
  serviceType: string[];
  submittedBy: string[];
  productType: string[];
}

export interface DocumentsFilterTriggerText {
  description: string;
  type: string;
  serviceType: string;
  submittedBy: string;
  productType: string;
}

export interface Document {
  documentDescription: string;
  documentURI: string;
  documentType: string;
  documentSource: string;
  relatedTransURL: string;
  serviceType: string;
  submittedBy: string;
  documentDate: string;
  productType: string;
  serviceCode?: string;
  sourceId?: string;
  isVertice30RelatedTransURL?: boolean;
  legacySource?: boolean;
}
export interface DocumentsApiResults {
  numberOfDocuments: number;
  documents: Array<Document>;
}

export interface DocumentsTableColumnDef {
  label: string;
  name: string;
  comparator?: (a: any, b: any, ascending: boolean) => number;
  link?: boolean;
}

export const DOCUMENTS_TABLE_COLUMNS: Partial<DocumentsTableColumnDef>[] = [
  {
    label: 'Description',
    name: 'documentDescription',
    comparator: alphaNumericComparator,
    link: true
  },
  {
    label: 'Type',
    name: 'documentType',
    comparator: alphaNumericComparator
  },
  {
    label: 'Source',
    name: 'documentSource',
    comparator: alphaNumericComparator,
    link: true
  },
  {
    label: 'Service',
    name: 'serviceType',
    comparator: alphaNumericComparator
  },
  {
    label: 'Submitted By',
    name: 'submittedBy',
    comparator: alphaNumericComparator
  },
  {
    label: 'Date',
    name: 'documentDate',
    comparator: dateComparator
  },
  {
    label: 'Product Type',
    name: 'productType',
    comparator: alphaNumericComparator
  }
];
