import { createReducer, on } from '@ngrx/store';
import { mergeClone } from '@shared';
import { cloneDeep } from 'lodash';
import { DIAGNOSTICS_ARCH_TYPE } from '../../../make-a-referral/diagnostics/diagnostics-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from '../../../make-a-referral/home-health/home-health-step-definitions';
import { LANGUAGE_ARCH_TYPE } from '../../../make-a-referral/language/language-step-definitions';
import { buildLocationAddressDisplayText } from '../../../make-a-referral/make-a-referral-shared';
import { PHYSICALMEDICINE_ARCH_TYPE } from '../../../make-a-referral/physical-medicine/physical-medicine-step-definitions';
import {
  addFusionLocation,
  addFusionLocationFail,
  addFusionLocationSuccess,
  fusionSaveAsDraft,
  fusionSaveAsDraftFail,
  fusionSaveAsDraftSuccess,
  loadDiagnosticsCustomerServiceConfigurations,
  loadDiagnosticsCustomerServiceConfigurationsFail,
  loadDiagnosticsCustomerServiceConfigurationsSuccess,
  loadDMECustomerServiceConfigurations,
  loadDMECustomerServiceConfigurationsFail,
  loadDMECustomerServiceConfigurationsSuccess,
  loadFusionApprovedLocationsFail,
  loadFusionApprovedLocationsSuccess,
  loadFusionBodyPartsSuccess,
  loadFusionICDCodesSuccess,
  loadFusionLanguageFail,
  loadFusionLanguages,
  loadFusionLanguageSuccess,
  loadFusionVendorAllocations,
  loadFusionVendorAllocationsFail,
  loadFusionVendorAllocationsSuccess,
  loadHomeHealthCustomerServiceConfigurations,
  loadHomeHealthCustomerServiceConfigurationsFail,
  loadHomeHealthCustomerServiceConfigurationsSuccess,
  loadLanguageCustomerServiceConfigurations,
  loadLanguageCustomerServiceConfigurationsFail,
  loadLanguageCustomerServiceConfigurationsSuccess,
  loadLocationTypesSuccess,
  loadPhysicalMedicineCustomerServiceConfigurations,
  loadPhysicalMedicineCustomerServiceConfigurationsFail,
  loadPhysicalMedicineCustomerServiceConfigurationsSuccess,
  resetFusionMakeAReferral
} from '../../actions/fusion/fusion-make-a-referral.actions';
import {
  fusionMakeReferralInitial,
  FusionMakeReferralState
} from '../../models/fusion/fusion-make-a-referral.models';
import { CustomerServiceGroupSubType } from '../../models/make-a-referral.models';

export const fusionMakeAReferralReducer = createReducer(
  fusionMakeReferralInitial, // Languages
  on(loadFusionLanguages, (state: FusionMakeReferralState) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.referralOptions.languages.isLoaded = false;
    return cloneState;
  }),
  on(
    loadFusionLanguageSuccess,
    (state: FusionMakeReferralState, { languages }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.referralOptions.languages.list = [...languages];
      return cloneState;
    }
  ),
  on(
    loadFusionLanguageFail,
    loadFusionLanguageSuccess,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.referralOptions.languages.isLoaded = true;
      return cloneState;
    }
  ),
  // Language Service Configurations
  on(loadLanguageCustomerServiceConfigurations, (state) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.languageCustomerServiceConfigurationState.isLoading = true;
    return cloneState;
  }),
  on(
    loadLanguageCustomerServiceConfigurationsSuccess,
    (state: FusionMakeReferralState, { customerServiceConfigurations }) => {
      const subServiceGroupConfigs =
        customerServiceConfigurations[0].groupConfigurations;
      const defaultSubTypes = getDefaultSubType(subServiceGroupConfigs);

      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.defaultSubTypeValues = {
        ...state.defaultSubTypeValues,
        [LANGUAGE_ARCH_TYPE]: defaultSubTypes
      };
      cloneState.languageCustomerServiceConfigurationState.isLoading = false;
      cloneState.languageCustomerServiceConfigurationState.list = customerServiceConfigurations;
      return cloneState;
    }
  ),
  on(
    loadLanguageCustomerServiceConfigurationsSuccess,
    loadLanguageCustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.languageCustomerServiceConfigurationState.isLoading = false;
      return cloneState;
    }
  ),
  // Diagnostics Service Configurations
  on(loadDiagnosticsCustomerServiceConfigurations, (state) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.diagnosticsCustomerServiceConfigurationState.isLoading = true;
    return cloneState;
  }),
  on(
    loadDiagnosticsCustomerServiceConfigurationsSuccess,
    (state: FusionMakeReferralState, { customerServiceConfigurations }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      const subServiceGroupConfigs =
        customerServiceConfigurations[0].groupConfigurations;
      const defaultSubTypes = getDefaultSubType(subServiceGroupConfigs);
      cloneState.defaultSubTypeValues = {
        ...state.defaultSubTypeValues,
        [DIAGNOSTICS_ARCH_TYPE]: defaultSubTypes
      };
      cloneState.diagnosticsCustomerServiceConfigurationState.list = customerServiceConfigurations;
      return cloneState;
    }
  ),
  on(
    loadDiagnosticsCustomerServiceConfigurationsSuccess,
    loadDiagnosticsCustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.diagnosticsCustomerServiceConfigurationState.isLoading = false;
      return cloneState;
    }
  ),
  // Physical Medicine Service Configurations
  on(loadPhysicalMedicineCustomerServiceConfigurations, (state) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.physicalMedicineCustomerServiceConfigurationState.isLoading = true;
    return cloneState;
  }),
  on(
    loadPhysicalMedicineCustomerServiceConfigurationsSuccess,
    (state: FusionMakeReferralState, { customerServiceConfigurations }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      const subServiceGroupConfigs =
        customerServiceConfigurations[0].groupConfigurations;
      const defaultSubTypes = getDefaultSubType(subServiceGroupConfigs);
      cloneState.defaultSubTypeValues = {
        ...state.defaultSubTypeValues,
        [PHYSICALMEDICINE_ARCH_TYPE]: defaultSubTypes
      };
      cloneState.physicalMedicineCustomerServiceConfigurationState.list = customerServiceConfigurations;
      return cloneState;
    }
  ),
  on(
    loadPhysicalMedicineCustomerServiceConfigurationsSuccess,
    loadPhysicalMedicineCustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.physicalMedicineCustomerServiceConfigurationState.isLoading = false;
      return cloneState;
    }
  ),
  // Home Health Service Configurations
  on(loadHomeHealthCustomerServiceConfigurations, (state) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.homeHealthCustomerServiceConfigurationState.isLoading = true;
    return cloneState;
  }),
  on(
    loadHomeHealthCustomerServiceConfigurationsSuccess,
    (state: FusionMakeReferralState, { customerServiceConfigurations }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      const subServiceGroupConfigs =
        customerServiceConfigurations[0].groupConfigurations;
      const defaultSubTypes = getDefaultSubType(subServiceGroupConfigs);
      cloneState.defaultSubTypeValues = {
        ...state.defaultSubTypeValues,
        [HOMEHEALTH_ARCH_TYPE]: defaultSubTypes
      };
      cloneState.homeHealthCustomerServiceConfigurationState.list = customerServiceConfigurations;
      return cloneState;
    }
  ),
  on(
    loadHomeHealthCustomerServiceConfigurationsSuccess,
    loadHomeHealthCustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.homeHealthCustomerServiceConfigurationState.isLoading = false;
      return cloneState;
    }
  ),
  // DME Service Configurations
  on(loadDMECustomerServiceConfigurations, (state) => {
    const cloneState: FusionMakeReferralState = cloneDeep(state);
    cloneState.dmeCustomerServiceConfigurationState.isLoading = true;
    return cloneState;
  }),
  on(
    loadDMECustomerServiceConfigurationsSuccess,
    (state: FusionMakeReferralState, { customerServiceConfigurations }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.dmeCustomerServiceConfigurationState.list = customerServiceConfigurations;
      return cloneState;
    }
  ),
  on(
    loadDMECustomerServiceConfigurationsSuccess,
    loadDMECustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.dmeCustomerServiceConfigurationState.isLoading = false;
      return cloneState;
    }
  ),
  // Approved Locations
  on(
    loadFusionApprovedLocationsSuccess,
    (state: FusionMakeReferralState, { referralLocations }) => {
      return mergeClone(state, {
        referralOptions: {
          approvedFusionLocations: referralLocations
        }
      });
    }
  ),
  // Approved Locations
  on(
    loadFusionICDCodesSuccess,
    (state: FusionMakeReferralState, { icdCodes }) => {
      return mergeClone(state, {
        referralOptions: {
          icdCodes: icdCodes
        }
      });
    }
  ),
  // Location Types
  on(
    loadLocationTypesSuccess,
    (state: FusionMakeReferralState, { locationTypes }) => {
      return mergeClone(state, {
        referralOptions: {
          locationTypes: locationTypes
        }
      });
    }
  ),
  // Add Location
  on(
    addFusionLocationSuccess,
    (
      state: FusionMakeReferralState,
      { status, newLocation, encodedClaimNumber, encodedCustomerId }
    ) => {
      const location = {
        id: newLocation.id + '',
        type: newLocation.typeDescription,
        name: newLocation.locationName,
        address: buildLocationAddressDisplayText(newLocation.address)
      };
      // TODO: Figure out method of reloading locations outside of reducer
      for (let service in state.referralOptions.approvedFusionLocations) {
        // if (service) {
        //   store$.dispatch(
        //     loadFusionApprovedLocations({
        //       serviceCode: service as AncilliaryServiceCode,
        //       encodedClaimNumber,
        //       encodedCustomerId
        //     })
        //   );
        // }
      }
      return cloneDeep(state);
    }
  ),
  on(addFusionLocation, (state: FusionMakeReferralState) => {
    return mergeClone(state, {
      referralOptions: {
        approvedLocationsIsLoaded: false
      }
    });
  }),
  on(addFusionLocationFail, addFusionLocationSuccess, (state) => {
    return mergeClone(state, {
      referralOptions: {
        approvedLocationsIsLoaded: true
      }
    });
  }),
  // Get Fusion ICD Code list
  on(
    loadFusionICDCodesSuccess,
    (state: FusionMakeReferralState, { icdCodes }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.referralOptions.icdCodes = icdCodes;
      return cloneState;
    }
  ),
  on(
    loadFusionVendorAllocations,
    (
      state: FusionMakeReferralState,
      {
        ancillaryServiceCode,
        encodedClaimNumber,
        encodedCustomerId,
        serviceType
      }
    ) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);

      // Check if there's already a vendor list
      const fusionVendors = cloneState.referralOptions.vendors.find(
        (f) => f.serviceType === serviceType
      );

      if (fusionVendors !== undefined) {
        fusionVendors.list = [];
        // Update the vendor mode
        const fusionVendorModes = cloneState.referralOptions.vendorMode.find(
          (f) => f.serviceType === serviceType
        );
        fusionVendorModes.mode = null;

        // Update the vendorAutoPopulation flag
        const fusionVendorAutoPopulation = cloneState.referralOptions.vendorAutoPopulation.find(
          (f) => f.serviceType === serviceType
        );

        fusionVendorAutoPopulation.autoPopulation = null;
      }

      return cloneState;
    }
  ),
  // Get Fusion Allocated Vendors
  on(
    loadFusionVendorAllocationsSuccess,
    (state: FusionMakeReferralState, { vendorAllocation }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);

      // Check if there's already a vendor list
      const fusionVendors = cloneState.referralOptions.vendors.find(
        (f) => f.serviceType === vendorAllocation.serviceType
      );

      // Update the reference
      if (fusionVendors !== undefined) {
        fusionVendors.list = [...vendorAllocation.allocatedVendors];

        // Update the vendor mode
        const fusionVendorModes = cloneState.referralOptions.vendorMode.find(
          (f) => f.serviceType === vendorAllocation.serviceType
        );
        fusionVendorModes.mode = vendorAllocation.vendorMode;

        // Update the vendorAutoPopulation flag
        const fusionVendorAutoPopulation = cloneState.referralOptions.vendorAutoPopulation.find(
          (f) => f.serviceType === vendorAllocation.serviceType
        );

        fusionVendorAutoPopulation.autoPopulation =
          vendorAllocation.autoPopulation;
      } else {
        // Add vendor list
        cloneState.referralOptions.vendors.push({
          serviceType: vendorAllocation.serviceType,
          list: vendorAllocation.allocatedVendors
        });

        // Add the vendor mode
        cloneState.referralOptions.vendorMode.push({
          serviceType: vendorAllocation.serviceType,
          mode: vendorAllocation.vendorMode
        });

        // Add the vendorAutoPopulation flag
        cloneState.referralOptions.vendorAutoPopulation.push({
          serviceType: vendorAllocation.serviceType,
          autoPopulation: vendorAllocation.autoPopulation
        });
      }
      return cloneState;
    }
  ),
  // Get Fusion Body Parts
  on(
    loadFusionBodyPartsSuccess,
    (state: FusionMakeReferralState, { bodyParts }) => {
      const cloneState: FusionMakeReferralState = cloneDeep(state);
      cloneState.referralOptions.bodyParts = [...bodyParts];
      return cloneState;
    }
  ),
  on(fusionSaveAsDraft, (state) => ({ ...state, savingDraft: true })),
  on(fusionSaveAsDraftSuccess, fusionSaveAsDraftFail, (state) => ({
    ...state,
    savingDraft: false
  })),
  // Reset Fusion make a referral
  on(resetFusionMakeAReferral, (state: FusionMakeReferralState) => {
    state = cloneDeep(fusionMakeReferralInitial);
    return state;
  }),
  // Errors
  on(
    fusionSaveAsDraftFail,
    loadFusionLanguageFail,
    loadLanguageCustomerServiceConfigurationsFail,
    loadFusionApprovedLocationsFail,
    loadFusionVendorAllocationsFail,
    loadHomeHealthCustomerServiceConfigurationsFail,
    loadDMECustomerServiceConfigurationsFail,
    (state: FusionMakeReferralState, { errors }) => {
      return mergeClone(state, {
        errors: [...state.errors, ...errors]
      });
    }
  )
);

function getDefaultSubType(
  subServiceGroupConfigs
): { [key: string]: CustomerServiceGroupSubType } {
  const defaultSubTypes = {};
  subServiceGroupConfigs.forEach((config) => {
    let defaultValue;

    const list = config.subTypes;
    const option = list.find((type) => !type.subTypeDescription);
    if (option) {
      defaultValue = option;
    } else {
      defaultValue = list[0]
        ? {
            customerSubTypeId: undefined,
            customerTypeId: list[0].customerTypeId,
            subTypeDescription: undefined
          }
        : undefined;
    }

    defaultSubTypes[config.groupName] = defaultValue;
  });
  return defaultSubTypes;
}
