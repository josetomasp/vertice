export interface AllDrugData {
  ahfsTherapeuticClass: string;
  deaClass: string;
  displayName: string;
  dosageForm: string;
  gpi: string;
  itemName: string;
  multiSourceCode: string;
  multiSource: string;
  ndc: string;
  packSize: string;
  productName: string;
  repackInd: string;
  routeOfAdministration: string;
  rxOtcCode: string;
  rxOtc: string;
  strength: boolean;
  strengthUnit: string;
  teeCode: string;
}

export interface DrugDTO {
  drugs: Array<AllDrugData>;
  serverErrors: Array<string>;
}

export interface DrugResponse {
  drugs: AllDrugData[];
  serverErrors: string[];
}

export interface DrugRequest {
  ndc: String;
  fromDate: String;
  AWPQuantity: number;
}

export interface FilterPredicates {
  prescriberName: Array<string>;
  outcome: Array<string>;
  activityType: Array<string>;
  itemName: Array<string>;
}
