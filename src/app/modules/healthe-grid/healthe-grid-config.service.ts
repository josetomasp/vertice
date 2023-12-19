import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { formatCurrency } from '@angular/common';
import {
  AbstractControlOptions,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import {
  PayeeInfoData
} from '../../claims/pbm/authorization/store/models/payee-info.data';
import { CompoundModalData } from '@shared';

/**
 * Configuration object for the overall container that holds the
 * grid.
 */
export interface HealtheGridContainerConfig {
  includeLabels: boolean;
  includeFormGroup: boolean;
  noAvailableValueTag?: boolean;
  containerPrefix?: string;
  defaultFlex?: string;
  flexGap?: string;
  flex: HealtheGridFlexConfig;
}

/**
 * @name HealtheGridComponentType
 * @description the types of the singular components in the grid. Each type can
 * have it's own separate config/functionality depending on what the
 * HealtheGridComponent has implemented
 * @see HealtheComponentGridComponent
 */
export enum HealtheGridComponentType {
  Text,
  Pharmacy,
  DrugOrCompound,
  Prescriber,
  FormControl,
  Button,
  Html,
  InfoAndActionsBanner,
  Payee,
  Input,
  PhoneNumber
}

export interface HealtheGridFlexConfig {
  gap: string;
  basis: string;
  justifyContent: string;
  alignItems: string;
  direction: string;
}

export const DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG: HealtheGridContainerConfig = Object.freeze(
  {
    includeLabels: true,
    includeFormGroup: false,
    flex: {
      gap: '24px',
      basis: '8',
      justifyContent: 'start',
      alignItems: 'center',
      direction: 'row'
    },
    noAvailableValueTag: false
  }
);

export interface PbmPharmacyModalOpenerData {
  nabp: string;
  displayText: string;
  phone: string;
  timezone: string;
}

export interface PbmGridInputConfig {
  value: any;
  type: string;
  formControlName: string;
  validators: ValidatorFn | ValidatorFn[] | AbstractControlOptions;
  errorMessages: Map<string, string>;
  id: string;
  placeHolder?: string;
  isRequired?: boolean;
  class?: string[];
}

export interface PbmDrugOrCompoundModalOpenerData {
  displayText: string;
  ndc: string;
  quantity: number;
  createdDate: string;
  compound: boolean;
  compoundModalData: CompoundModalData;
}

export interface PbmPrescriberModalOpenerData {
  displayText: string;
  prescriberId: string;
}

export interface PbmGridInformationIconConfig {
  position: 'label' | 'value';
  tooltipMessage: string;
  ngStyle?: { [klass: string]: any };
}

/**
 * The individual generic config for each component. the value changes depending
 * on the component type. The value could be a string or number for just displaying
 * data on a label or can contain an object for callbacks or modals data.
 */
export interface HealtheGridComponentConfig<T> {
  label: string;
  type: HealtheGridComponentType;
  value: T;
  flexBasis: string;
  flex: HealtheGridFlexConfig;
  ngStyle?: { [klass: string]: any };
  informationIcon?: PbmGridInformationIconConfig;
}

/**
 * An array of arrays where the first dimension specifies the row and the
 * second defines the columns in that row. This is created by the {@link HealtheComponentGridBuilder}
 * @see HealtheComponentGridBuilder
 * @see HealtheGridComponentConfig
 */
export type HealtheGridConfig = HealtheGridComponentConfig<any>[][];

/**
 * The config that is sent to the HealtheGridComponent
 * @see PbmComponentGridComponent
 */
export interface HealtheComponentConfig {
  container: HealtheGridContainerConfig;
  grid: HealtheGridComponentConfig<any>[][];
  formGroup: FormGroup;
}

/**
 * Provided by the HealtheComponentGridBuilder through the row method.
 * This class implements the individual component config methods.
 * @see HealtheComponentGridBuilder
 */
export class HealtheGridRowBuilder {
  constructor(
    private rowConfig: HealtheGridComponentConfig<any>[],
    public defaultFlex: string,
    private formGroup: FormGroup
  ) {}

  private registerControlToFormGroup(
    formControlName: string,
    value: any,
    validatorsOrOptions?: ValidatorFn[] | ValidatorFn | AbstractControlOptions
  ) {
    if (this.formGroup) {
      if (this.formGroup.get(formControlName)) {
        this.formGroup.patchValue({
          [formControlName]: value
        });
      } else {
        this.formGroup.addControl(
          formControlName,
          new FormControl(value, validatorsOrOptions)
        );
      }
    } else {
      console.warn('There is no FormGroup to assign inputs FormControl');
    }
  }

  /**
   * Add a bit of text to this row in the grid
   * @param value
   * @param label
   * @param flex
   * @param informationIcon
   * @param ngStyle style html attribute
   */
  text(
    value: string | number,
    label?: string,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig,
    ngStyle?: { [klass: string]: any }
  ): HealtheGridRowBuilder {
    return this.raw<string | number>({
      label,
      value,
      type: HealtheGridComponentType.Text,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      ngStyle,
      informationIcon
    });
  }

  /**
   * Prepends a '$' before the value
   * @param value
   * @param label
   * @param flex
   * @param informationIcon
   * @param ngStyle style html attribute
   */
  money(
    value: string | number,
    label?: string,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig,
    ngStyle?: { [klass: string]: any }
  ): HealtheGridRowBuilder {
    let mon = '';
    if (value) {
      mon = formatCurrency(parseFloat(value.toString()), 'en-US', '$');
    }
    return this.text(mon, label, flex, informationIcon, ngStyle);
  }

  /**
   * Inject html into the page
   * @param value
   * @param label
   * @param flex
   * @param informationIcon
   * @param ngStyle style html attribute
   */
  html(
    value: string,
    label?: string,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig,
    ngStyle?: { [klass: string]: any }
  ): HealtheGridRowBuilder {
    return this.raw<string>({
      label,
      value,
      type: HealtheGridComponentType.Html,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      ngStyle: ngStyle,
      informationIcon
    });
  }

  /**
   * Add input into the page
   * @param inputConfig
   * @param label
   * @param flex
   * @param informationIcon
   * @param ngStyle style html attribute
   */
  input(
    inputConfig: PbmGridInputConfig,
    label?: string,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig,
    ngStyle?: { [klass: string]: any }
  ): HealtheGridRowBuilder {
    this.registerControlToFormGroup(
      inputConfig.formControlName,
      inputConfig.value,
      inputConfig.validators
    );
    return this.raw<PbmGridInputConfig>({
      label,
      value: inputConfig,
      type: HealtheGridComponentType.Input,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      ngStyle: ngStyle,
      informationIcon
    });
  }

  phoneNumber(
    inputConfig: PbmGridInputConfig,
    label?: string,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig,
    ngStyle?: { [klass: string]: any }
  ): HealtheGridRowBuilder {
    this.registerControlToFormGroup(
      inputConfig.formControlName,
      inputConfig.value,
      inputConfig.validators
    );
    return this.raw<PbmGridInputConfig>({
      label,
      value: inputConfig,
      type: HealtheGridComponentType.PhoneNumber,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      ngStyle: ngStyle,
      informationIcon
    });
  }

  /**
   * Add a pharmacy link to this row in the grid
   * @param pharmacyConfig
   * @param label
   * @param flex
   * @param informationIcon
   */
  pharmacy(
    pharmacyConfig: PbmPharmacyModalOpenerData,
    label = 'PHARMACY',
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig
  ): HealtheGridRowBuilder {
    return this.raw<PbmPharmacyModalOpenerData>({
      label,
      value: pharmacyConfig,
      type: HealtheGridComponentType.Pharmacy,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      informationIcon
    });
  }

  /**
   * Add a drug modal link to this row in the grid
   * @param drugConfig
   * @param label
   * @param flex
   * @param informationIcon
   */
  drugOrCompound(
    drugConfig: PbmDrugOrCompoundModalOpenerData,
    label = null,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig
  ): HealtheGridRowBuilder {
    return this.raw<PbmDrugOrCompoundModalOpenerData>({
      label,
      value: drugConfig,
      type: HealtheGridComponentType.DrugOrCompound,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      informationIcon
    });
  }

  /**
   * Add a payee information modal link to this row in the grid
   * @param payeeInformation
   * @param label
   * @param flex
   * @param informationIcon
   */
  payee(
    payeeInformation: PayeeInfoData,
    label = null,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig
  ): HealtheGridRowBuilder {
    return this.raw<PayeeInfoData>({
      label,
      value: payeeInformation,
      type: HealtheGridComponentType.Payee,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      informationIcon
    });
  }

  /**
   * Add a prescriber modal link to this row in the grid
   * @param prescriberConfig
   * @param label
   * @param flex
   * @param informationIcon
   */
  prescriber(
    prescriberConfig: PbmPrescriberModalOpenerData,
    label = null,
    flex = this.defaultFlex,
    informationIcon?: PbmGridInformationIconConfig
  ): HealtheGridRowBuilder {
    return this.raw<PbmPrescriberModalOpenerData>({
      label,
      value: prescriberConfig,
      type: HealtheGridComponentType.Prescriber,
      flexBasis: flex,
      flex: {} as HealtheGridFlexConfig,
      informationIcon
    });
  }

  /**
   * Add a button to this row in the grid
   * @param buttonConfig
   * @param label
   * @param flex
   */
  button<P = any, R = any>(
    buttonConfig: HealtheGridButtonConfig<P, R>,
    label?: string,
    flexBasis = this.defaultFlex
  ) {
    return this.raw<HealtheGridButtonConfig<P, R>>({
      label,
      value: buttonConfig,
      type: HealtheGridComponentType.Button,
      flexBasis,
      flex: {} as HealtheGridFlexConfig
    });
  }

  /**
   * This actually sets the config in the row... don't expose this; We don't want
   * a bunch of raw json
   * @param config {HealtheGridComponentConfig}
   * @private
   */
  private raw<T>(config: HealtheGridComponentConfig<T>): HealtheGridRowBuilder {
    this.rowConfig.push(config);
    return this;
  }
}

/**
 * Helper class to build a grid of components that gets consumed by the
 * {@link HealtheGridComponent} best used through the {@link HealtheGridConfigService}
 * @see PbmComponentGridComponent
 * @see HealtheGridConfigService
 * @example typescript
 * new HealtheComponentGridBuilder()
 *      .configureGrid()
 *      .row(rowBuilder => rowBuilder.text(someData.value, 'LABEL'))
 *      .build()
 */
export class HealtheComponentGridBuilder {
  formGroup = new FormGroup({});

  constructor(
    private containerConfig: HealtheGridContainerConfig = cloneDeep(
      DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG
    ),
    private gridConfig: HealtheGridConfig = []
  ) {}

  /**
   * Adds a row to this grid. With the row index, you can specify a specific row
   * so you don't have to save the rowBuilder locally
   * @param rowBuilderFunc
   * @param defaultFlex
   * @param rowIndex
   *
   * @example typescript
   * // Get instance of builder
   * const gridBuilder = service.configureGrid()
   * // Add a row
   * gridBuilder.row(rowBuilder => rowBuilder.text(someData.value, 'LABEL'));
   * // For this special case, we want to add a cool button
   * if (specialCase) {
   *    gridBuilder.row(rowBuilder => rowBuilder.button(), 0);
   * }
   */
  row(
    rowBuilderFunc: (rowBuilder: HealtheGridRowBuilder) => void,
    defaultFlex?: string,
    rowIndex: number = null,
    formGroup: FormGroup = this.formGroup
  ) {
    let currentRow;
    if (rowIndex != null && this.gridConfig[rowIndex]) {
      currentRow = this.gridConfig[rowIndex];
    } else {
      currentRow = [];
      this.gridConfig.push(currentRow);
    }
    rowBuilderFunc(
      new HealtheGridRowBuilder(
        currentRow,
        defaultFlex || this.containerConfig.defaultFlex,
        formGroup
      )
    );
    return this;
  }

  flex(config: Partial<HealtheGridFlexConfig>) {
    this.containerConfig.flex = { ...this.containerConfig.flex, ...config };
    return this;
  }

  form(formGroup: FormGroup) {
    this.formGroup = formGroup;
    return this;
  }

  build(): HealtheComponentConfig {
    return {
      container: this.containerConfig,
      grid: this.gridConfig,
      formGroup: this.formGroup
    };
  }
}

export enum HealtheGridButtonType {
  Primary,
  Secondary,
  Info
}

export interface HealtheGridButtonConfig<P, R> {
  text: string;
  buttonType: HealtheGridButtonType;
  action: (args: P) => R;
}

/**
 *
 * A service to construct component configs, kind of like FormBuilder or SpecificDateFormBuilder.
 * It provides the HealtheComponentGridBuilder which is the class that holds all the
 * logic for creating the grid and configurations.
 *
 * @see HealtheComponentGridBuilder
 * @example typescript
 * class SomeComponentClass {
 * // In the constructor call in the service
 *   constructor(public configService: HealtheGridConfigService) {}
 * // then use in conjunction with a data observable or by itself
 *   someData$ = this.store$.pipe(select(getSomeData), map(someData=>
 *      this.configService.configureGrid()
 *      .row(rowBuilder => rowBuilder.text(someData.value, 'LABEL'))
 *      .build()
 *   ))
 * }

 */
@Injectable({ providedIn: 'root' })
export class HealtheGridConfigService {
  constructor() {}

  /**
   * Returns an instance of the HealtheComponentGridBuilder class.
   * @param config {HealtheGridContainerConfig}
   * @see HealtheComponentGridBuilder
   */
  configureGrid(config = cloneDeep(DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG)) {
    return new HealtheComponentGridBuilder(config);
  }
}
