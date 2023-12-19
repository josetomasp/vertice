export interface CscNote {
  header: string;
  note: string;
}

export interface SaveCSCNote<ContextDataType> {
  contextData: ContextDataType;
  note: string;
}
