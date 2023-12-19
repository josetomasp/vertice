export interface Drug {
  awpDrugPrices: Array<DrugAWPPrice>;
  awpCost: string;
  awpPackagePrice: string;
  ahfsTherapeuticClass: string;
  deaClass: string;
  displayName: string;
  dosageForm: string;
  dosageFormAbbr: string;
  gpi: string;
  gpiReference: DrugGPIReference;
  itemName: string;
  multiSource: string;
  multiSourceCode: string;
  ndc: string;
  packSize: string;
  productName: string;
  repackInd: string;
  routeOfAdministration: string;
  routeOfAdministrationAbbr: string;
  rxOtc: string;
  rxOtcCode: string;
  strength: string;
  strenghtUnit: string;
  teeCode: string;
  unitCost: string;
}

export interface DrugAWPPrice {
  effectiveDate: string;
  price: string;
  terminationDate: string;
}

export interface DrugGPIReference {
  gpi: string;
  nameWithPronunciation: string;
  fdaApprovedUses: Array<string>;
}
