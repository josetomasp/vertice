export interface LabelValue {
  label: string;
  value: string | string[];
  elementName?: string;
  editable?: boolean;
}

export interface EligibilityTabState {
  claimInfo: LabelValue[];
  idInfo: LabelValue[];
  claimDates: LabelValue[];
  pbmDates: LabelValue[];
  abmDates: LabelValue[];
}

export const eligibilityTabInitialState: EligibilityTabState = {
  claimInfo: [],
  idInfo: [],
  claimDates: [],
  pbmDates: [],
  abmDates: []
};
