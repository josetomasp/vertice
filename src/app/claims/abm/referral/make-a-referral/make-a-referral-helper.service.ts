import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import {
  SetSelectedServiceDetailTypes,
  SetSelectedServiceTypes
} from '../store/actions/make-a-referral.actions';
import {
  FusionServiceName,
  InterpretationDateRangeFormState,
  InterpretationFormState,
  InterpretationSpecificDateFormState,
  PhysicalMedicineCommonForm
} from '../store/models/fusion/fusion-make-a-referral.models';
import {
  fusionSaveAsDraft,
  loadDiagnosticsCustomerServiceConfigurations,
  loadDMECustomerServiceConfigurations,
  loadFusionApprovedLocations,
  loadHomeHealthCustomerServiceConfigurations,
  loadLanguageCustomerServiceConfigurations,
  loadLocationTypes,
  loadPhysicalMedicineCustomerServiceConfigurations
} from '../store/actions/fusion/fusion-make-a-referral.actions';
import {
  CustomerServiceGroupSubType,
  DateFormMode,
  ReferralSubmitMessage
} from '../store/models/make-a-referral.models';
import { getDefaultSubTypeMap } from '../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { LANGUAGE_ARCH_TYPE } from './language/language-step-definitions';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_CTSCAN_STEP_NAME,
  DIAGNOSTICS_MRI_STEP_NAME,
  DIAGNOSTICS_OTHER_STEP_NAME,
  DIAGNOSTICS_STEP_NAME_CATEGORY_MAP
} from './diagnostics/diagnostics-step-definitions';
import { PHYSICALMEDICINE_ARCH_TYPE } from './physical-medicine/physical-medicine-step-definitions';
import { TRANSPORTATION_ARCH_TYPE } from './transportation/transportation-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from './home-health/home-health-step-definitions';
import {
  DME_ARCH_TYPE,
  DME_EQUIPMENT_STEP_NAME
} from './dme/dme-step-definitions';
import { AncilliaryServiceCode, ServiceType } from './make-a-referral-shared';
import { cloneDeep, isEmpty } from 'lodash';

// This is an auxiliary service class because we have too many things in the
// make a referral service and started getting circular dependency errors

@Injectable({
  providedIn: 'root'
})
export class MakeAReferralHelperService {
  constructor(private store$: Store<RootState>) {}

  prepareServices(
    services: string[],
    encodedCustomerId: string,
    encodedClaimNumber: string
  ) {
    this.store$.dispatch(new SetSelectedServiceTypes(services));
    services.forEach((service) => {
      switch (service) {
        case FusionServiceName.Language:
          this.store$.dispatch(
            loadLanguageCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.Diagnostics:
          this.store$.dispatch(
            loadDiagnosticsCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.PhysicalMedicine:
          this.store$.dispatch(
            loadPhysicalMedicineCustomerServiceConfigurations({
              encodedCustomerId
            })
          );
          break;
        case FusionServiceName.HomeHealth:
          this.store$.dispatch(
            loadHomeHealthCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.DME:
          {
            this.store$.dispatch(
              loadDMECustomerServiceConfigurations({ encodedCustomerId })
            );
            // Simulate the user selected the DME selection step.
            // Dispatch the selection action for DME
            this.store$.dispatch(
              new SetSelectedServiceDetailTypes({
                [FusionServiceName.DME]: [DME_EQUIPMENT_STEP_NAME]
              })
            );
            // Get all the locations for DME.
            this.store$.dispatch(
              loadFusionApprovedLocations({
                serviceCode: AncilliaryServiceCode.DME,
                encodedClaimNumber,
                encodedCustomerId
              })
            );
            this.store$.dispatch(loadLocationTypes({ encodedCustomerId }));
          }
          break;
      }
    });
  }

  getPrepareServiceActions(
    services: string[],
    encodedCustomerId: string,
    encodedClaimNumber: string
  ): Action[] {
    const actions = [new SetSelectedServiceTypes(services) as Action];
    services.forEach((service) => {
      switch (service) {
        case FusionServiceName.Language:
          actions.push(
            loadLanguageCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.Diagnostics:
          actions.push(
            loadDiagnosticsCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.PhysicalMedicine:
          actions.push(
            loadPhysicalMedicineCustomerServiceConfigurations({
              encodedCustomerId
            })
          );
          break;
        case FusionServiceName.HomeHealth:
          actions.push(
            loadHomeHealthCustomerServiceConfigurations({ encodedCustomerId })
          );
          break;
        case FusionServiceName.DME:
          {
            actions.push(
              loadDMECustomerServiceConfigurations({ encodedCustomerId })
            );
            // Simulate the user selected the DME selection step.
            // Dispatch the selection action for DME
            actions.push(
              new SetSelectedServiceDetailTypes({
                [FusionServiceName.DME]: [DME_EQUIPMENT_STEP_NAME]
              })
            );
            // Get all the locations for DME.
            actions.push(
              loadFusionApprovedLocations({
                serviceCode: AncilliaryServiceCode.DME,
                encodedCustomerId,
                encodedClaimNumber
              })
            );
            actions.push(loadLocationTypes({ encodedCustomerId }));
          }
          break;
      }
    });
    return actions;
  }

  hasFusionFormState(formState): boolean {
    const formKeys = Object.keys(formState);
    let hasState = false;
    for (let i = 0; i < formKeys.length; i++) {
      const [archType] = formKeys[i].split('-');
      if (
        archType === LANGUAGE_ARCH_TYPE ||
        archType === DIAGNOSTICS_ARCH_TYPE ||
        archType === PHYSICALMEDICINE_ARCH_TYPE ||
        archType === HOMEHEALTH_ARCH_TYPE ||
        archType === DME_ARCH_TYPE
      ) {
        hasState = true;
        break;
      }
    }
    return hasState;
  }

  hasCoreFormState(formState): boolean {
    const formKeys = Object.keys(formState);
    let hasState = false;
    for (let i = 0; i < formKeys.length; i++) {
      const [archType] = formKeys[i].split('-');
      if (archType === TRANSPORTATION_ARCH_TYPE) {
        hasState = true;
        break;
      }
    }
    return hasState;
  }

  parseAncilliaryServiceCodeToServiceType(
    serviceCode: AncilliaryServiceCode
  ): ServiceType {
    switch (serviceCode) {
      case AncilliaryServiceCode.DME: {
        return DME_ARCH_TYPE;
      }
      case AncilliaryServiceCode.HH: {
        return HOMEHEALTH_ARCH_TYPE;
      }
      case AncilliaryServiceCode.PM: {
        return PHYSICALMEDICINE_ARCH_TYPE;
      }
      case AncilliaryServiceCode.DX: {
        return DIAGNOSTICS_ARCH_TYPE;
      }
      case AncilliaryServiceCode.LAN: {
        return LANGUAGE_ARCH_TYPE;
      }
      case AncilliaryServiceCode.TRP: {
        return TRANSPORTATION_ARCH_TYPE;
      }
      default: {
        return null;
      }
    }
  }

  saveFusionDraft(submitMessage: ReferralSubmitMessage) {
    const { formValues } = cloneDeep(submitMessage);
    this.store$
      .pipe(select(getDefaultSubTypeMap))
      .pipe(
        first(),
        map((defaultSubTypeMap) => {
          Object.keys(formValues).forEach((serviceName) => {
            if (serviceName.includes(LANGUAGE_ARCH_TYPE)) {
              setLanguageDefaultSubtypes(
                serviceName,
                formValues[serviceName],
                defaultSubTypeMap
              );
            } else if (serviceName.includes(HOMEHEALTH_ARCH_TYPE)) {
              setHomeHealthDefaultSubtypes(
                serviceName,
                formValues[serviceName],
                defaultSubTypeMap
              );
            } else if (serviceName.includes(DIAGNOSTICS_ARCH_TYPE)) {
              setDiagnosticsDefaultSubtypes(
                serviceName,
                formValues[serviceName],
                defaultSubTypeMap[DIAGNOSTICS_ARCH_TYPE]
              );
            } else if (serviceName.includes(PHYSICALMEDICINE_ARCH_TYPE)) {
              setPhysicalMedicineDefaultSubtypes(
                serviceName,
                formValues[serviceName],
                defaultSubTypeMap
              );
            }
          });
          return formValues;
        })
      )
      .subscribe((updatedFormValues) => {
        submitMessage.formValues = updatedFormValues;
        this.store$.dispatch(fusionSaveAsDraft({ submitMessage }));
      });
  }
}

function setLanguageDefaultSubtypes(
  subServiceFormName,
  formState,
  defaultSubTypeMap
) {
  if (subServiceFormName === 'language-interpretation') {
    setInterpretationsDefaultSubType(
      formState as InterpretationFormState,
      defaultSubTypeMap[LANGUAGE_ARCH_TYPE]
    );
  }
}

function setInterpretationsDefaultSubType(
  formValues: InterpretationFormState,
  defaultSubTypes: { [key: string]: CustomerServiceGroupSubType }
) {
  if (formValues.authorizationDateType === DateFormMode.DateRange) {
    if (isEmpty((formValues.schedulingForm as any).certification)) {
      (formValues.schedulingForm as InterpretationDateRangeFormState).certification =
        defaultSubTypes['On-Site Interpretation'];
    }
  } else {
    (formValues.schedulingForm as InterpretationSpecificDateFormState[]).forEach(
      (form) => {
        if (!form.certification) {
          form.certification = defaultSubTypes['On-Site Interpretation'];
        }
      }
    );
  }
}
function setHomeHealthDefaultSubtypes(
  serviceName: string,
  formValue: { [p: string]: any },
  defaultSubTypeMap: {
    [p: string]: { [p: string]: CustomerServiceGroupSubType };
  }
) {
  let hhDefaults = defaultSubTypeMap.homeHealth;
  let subServiceFormName = serviceName.split('-')[1];
  let hhDefaultsFiltered = null;

  switch (subServiceFormName) {
    case 'nursing':
      {
        hhDefaultsFiltered = hhDefaults['Nursing'];
      }
      break;
    case 'inHomeTherapy':
      {
        hhDefaultsFiltered = hhDefaults['In-Home Therapy'];
      }
      break;
    case 'aides':
      {
        hhDefaultsFiltered = hhDefaults['Aides'];
      }
      break;
    case 'infusion':
      {
        hhDefaultsFiltered = hhDefaults['Infusion'];
      }
      break;
    case 'other':
      {
        hhDefaultsFiltered = hhDefaults['Other'];
      }
      break;
  }

  if (formValue.schedulingForm && hhDefaultsFiltered !== null) {
    formValue.schedulingForm.forEach((schedulingForm) => {
      if (!schedulingForm.serviceType) {
        schedulingForm.serviceType = hhDefaultsFiltered;
      }
    });
  }
}
function setDiagnosticsDefaultSubtypes(
  serviceName: string,
  formValue,
  defaultSubTypeMap: { [p: string]: CustomerServiceGroupSubType }
) {
  if (
    serviceName === DIAGNOSTICS_CTSCAN_STEP_NAME ||
    serviceName === DIAGNOSTICS_MRI_STEP_NAME ||
    serviceName === DIAGNOSTICS_OTHER_STEP_NAME
  ) {
    formValue.schedulingForm.forEach((form) => {
      if (
        (serviceName === DIAGNOSTICS_CTSCAN_STEP_NAME ||
          serviceName === DIAGNOSTICS_MRI_STEP_NAME) &&
        isEmpty(form.contrastType)
      ) {
        form.contrastType =
          defaultSubTypeMap[DIAGNOSTICS_STEP_NAME_CATEGORY_MAP[serviceName]];
      } else if (DIAGNOSTICS_OTHER_STEP_NAME && isEmpty(form.otherTypes)) {
        form.otherTypes =
          defaultSubTypeMap[DIAGNOSTICS_STEP_NAME_CATEGORY_MAP[serviceName]];
      } else if (isEmpty(form.subType)) {
        form.subType =
          defaultSubTypeMap[DIAGNOSTICS_STEP_NAME_CATEGORY_MAP[serviceName]];
      }
    });
  }
}
function setPhysicalMedicineDefaultSubtypes(
  subServiceFormName,
  formState,
  defaultSubTypeMap
) {
  if (subServiceFormName === 'physicalMedicine-other') {
    setOtherPMDefaultSubType(
      formState as PhysicalMedicineCommonForm,
      defaultSubTypeMap[PHYSICALMEDICINE_ARCH_TYPE]
    );
  }
}

function setOtherPMDefaultSubType(
  formValues: PhysicalMedicineCommonForm,
  defaultSubTypes: { [key: string]: CustomerServiceGroupSubType }
) {
  formValues.schedulingForm.forEach((form) => {
    if (!form.subType) {
      form.subType = defaultSubTypes['Other'];
    }
  });
}
