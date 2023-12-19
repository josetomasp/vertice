export interface DocumentTableItem {
  fileName: string;
  fileSize: number;
  submitDate: string;
  file: File;
  documentType?: string;
  readOnly?: boolean;
  fileURL?: string;
}
