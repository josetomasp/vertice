import { DocumentExportColumnDTO } from './documentExportColumnDTO';

export enum DocumentExportDocumentType {
  EXCEL = 'EXCEL',
  PDF = 'PDF'
}

export class DocumentExportDTO {
  constructor() {}

  // The kind of document to export.  Must be EXCEL or PDF
  public exportType: DocumentExportDocumentType;

  // The product type such as 'Pharmacy' or 'Clinical'.  'All' for all product types.
  public productType: string;

  // The claim number
  public claimNumber: string;

  // The customerId
  public customerId: string;

  // The earliest date to look for
  public fromDate: string;

  // The latest date to look for
  public toDate: string;

  // The List of columns to be exported
  public columns: DocumentExportColumnDTO[] = [];

  // The filter list of activity types.  Only activity types in this list will be exported.
  public activityType: string[] = [];

  // The filter list of outcomes.  Only outcomes in this list will be exported.
  public outcome: string[] = [];

  // The flilter list of prescribers.  Only prescribers in this list will be exported.
  // Supply an empty string to include fields without presrcribers.
  public prescriberName: string[] = [];

  // The filter list of item names.  Only item names in this list will be exported.
  public itemName: string[] = [];
}
