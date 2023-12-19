export enum GenericStepType {
  VendorStep,
  DocumentStep,
  ReviewStep,
  ConfigurableStep
}

export interface GenericErrorInfoAction {
  actionLabel: string;
  actionCallback: () => void;
}

export interface GenericErrorInfo {
  errorMessage: string;
  errorCategories: string[];
  actions: GenericErrorInfoAction[];
}

export interface GenericErrorCardState {
  errorTitle: string;
  errorInfoList: GenericErrorInfo[];
}

export interface GenericStepConfigBase {
  stepType: GenericStepType;
  // Used for formGroup name
  stepName: string;
  stepTitle: string;
}

export enum GenericFormFieldType {
  Input,
  TextArea,
  Select,
  MultiSelect,
  RadioGroup,
  Autocomplete
}

export interface GenericFormFieldConfig<OptionsType> {
  formFieldType: GenericFormFieldType;
  label: string;
  placeholder?: string;
  formControlName: string;
  validators?: ([string, number] | string)[];
  flex?: object;
  options?: OptionsType;
  initialState?: any;
  // optional, I kind of don't want this field to exist. I'm thinking we could
  // convince the business to just use the label
  reviewLabel?: string;
}

export interface GenericConfigurableFormSection {
  formSectionTitle: string;
  formFieldConfigs: GenericFormFieldConfig<any>[][];
}

export interface GenericConfigurableStepConfig<StepConfig>
  extends GenericStepConfigBase {
  stepType: GenericStepType.ConfigurableStep;
  config?: StepConfig;
  formSections: GenericConfigurableFormSection[];
}

export interface VendorStepConfig extends GenericStepConfigBase {
  stepType: GenericStepType.VendorStep;
  stepName: 'vendors';
  stepTitle: 'Vendors';
  // APP-962 Added support for model in api/v1/partners/{partnerId}/contexts/vertice-1/reference-groups/customer-vendor-selection-config
  autoPopulation: boolean;
  vendorChangeAllowed: boolean;
  priorityChangeAllowed: boolean;
}

export interface DocumentsStepConfig extends GenericStepConfigBase {
  stepType: GenericStepType.DocumentStep;
  stepName: 'documents';
  stepTitle: 'Documents';
}

export interface ReviewStepConfig extends GenericStepConfigBase {
  stepType: GenericStepType.ReviewStep;
  stepTitle: 'Review';
}

export type GenericStepConfig =
  | GenericConfigurableStepConfig<any>
  | VendorStepConfig
  | DocumentsStepConfig
  | ReviewStepConfig;

export interface GenericWizardConfig {
  serviceType: string;
  serviceDisplayName: string;
  referralOnly: boolean;
  steps: GenericStepConfig[];
}

export enum GenericWizardStatus {
  NotStarted = 'Section Not Started',
  InProgress = 'Section In Progress',
  // Completed = 'Section Complete',
  Submitted = 'Section Submitted',
  Error = 'Section has Error'
}

export interface GenericStepperStoreState<FormState> {
  serviceType: string;
  serviceDisplayName: string;
  referralOnly: boolean;

  wizardStatus: GenericWizardStatus;
  wizardOpen: boolean;
  expansionToggleLabel: string;

  optionMap: { [key: string]: any };
  steps: GenericStepConfig[];
  formState: FormState;

  activeStepIndex: number;
  touchedSteps: number[];
  validSteps: number[];

  successMessage: string | null;
  warningMessage: string | null;

  displaySubmit: boolean;
  displayPreviousButton: boolean;
}

export interface GenericWizardServiceConfigMap {
  [serviceName: string]: GenericWizardConfig;
}
