export interface GeneralExporterExtraDocumentHeader {
  label: string;
  value: string;
}


export interface GeneralExportRequest {
  outputFormat: string;
  sheetName: string;
  // A full file name will be created by the exporter, but this should be filled in with a meaningful template stub.
  // ie: if the file name supplied is "AllSearch" the final result may be like "AllSearch_10-15-2020.pdf"
  fileName: string;
  displayNameColumnList: string[];
  // The key must match a value from the displayNameColumnList
  tableData: { [key: string]: string[] };
  // There is a Standard Healthe disclaimer which will be added to bottom of the exported document if this is set to true
  displayDisclaimer?: boolean;
  // This adds a speical title which appears at the top of PDF pages (does not show up in Excel)
  headerTitle?: string;
  // These are just some extra fake rows which can be added to the top of the exported document (in Excel) or appear as a header in a PDF document.
  extraDocumentHeaders?: GeneralExporterExtraDocumentHeader[];
}
