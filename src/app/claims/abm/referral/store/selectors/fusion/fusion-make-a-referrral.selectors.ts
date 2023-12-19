import { createSelector } from '@ngrx/store';
import { find } from 'lodash';
import {
  FusionMakeReferralState,
  FusionServiceName,
  MakeReferralFusionOptions
} from '../../models/fusion/fusion-make-a-referral.models';
import {
  CustomerServiceConfiguration
} from '../../models/make-a-referral.models';
import { ReferralState } from '../../models/referral.models';
import { getReferralState } from '../index';
import { ServiceType } from '../../../make-a-referral/make-a-referral-shared';

export const getFusionMakeAReferralState = createSelector(
  getReferralState,
  (state: ReferralState) => state.fusionMakeReferral
);

export const getFusionReferralOptions = createSelector(
  getFusionMakeAReferralState,
  (state: FusionMakeReferralState) => state.referralOptions
);

export const hasFusionLanguagesLoaded = createSelector(
  getFusionReferralOptions,
  (state) => state.languages.isLoaded
);

export const isLanguageCustomerServiceGroupConfigsLoading = createSelector(
  getFusionMakeAReferralState,
  (state) => state.languageCustomerServiceConfigurationState.isLoading
);

export const isDiagnosticsCustomerServiceGroupConfigsLoading = createSelector(
  getFusionMakeAReferralState,
  (state) => state.diagnosticsCustomerServiceConfigurationState.isLoading
);

export const isHomeHealthCustomerServiceGroupConfigsLoading = createSelector(
  getFusionMakeAReferralState,
  (state) => state.homeHealthCustomerServiceConfigurationState.isLoading
);

export const isPhysicalMedicineCustomerServiceGroupConfigsLoading = createSelector(
  getFusionMakeAReferralState,
  (state) => state.physicalMedicineCustomerServiceConfigurationState.isLoading
);

export const getFusionServiceGroupNamesByServiceName = (
  archType: ServiceType
) =>
  createSelector(
    getFusionMakeAReferralState,
    (state: FusionMakeReferralState, serviceName: FusionServiceName) => {
      const serviceConfig: CustomerServiceConfiguration = find(
        state[archType.concat('CustomerServiceConfigurationState')].list,
        {
          serviceName
        }
      );
      if (serviceConfig) {
        return serviceConfig.groupConfigurations.map(
          ({ groupName }) => groupName
        );
      } else {
        return [];
      }
    }
  );

export const getPhysicalMedicineCustomerServiceGroupConfigs = createSelector(
  getFusionMakeAReferralState,
  (state) => {
    const serviceConfig: CustomerServiceConfiguration = find(
      state.physicalMedicineCustomerServiceConfigurationState.list,
      {
        serviceName: FusionServiceName.PhysicalMedicine
      }
    );
    return serviceConfig ? serviceConfig.groupConfigurations : [];
  }
);

export const getFusionServiceGroupOptionsByGroupName = (
  service: FusionServiceName,
  archType: ServiceType
) =>
  createSelector(
    getFusionMakeAReferralState,
    (state: FusionMakeReferralState, groupName: string) => {
      const serviceConfig: CustomerServiceConfiguration = find(
        state[archType.concat('CustomerServiceConfigurationState')].list,
        {
          serviceName: service
        }
      );
      if (serviceConfig) {
        const serviceGroup = find(serviceConfig.groupConfigurations, {
          groupName
        });
        if (serviceGroup && serviceGroup.subTypes.length > 0) {
          return serviceGroup.subTypes.map((subType) => ({
            label: subType.subTypeDescription,
            value: subType
          }));
        }
      }
      return [];
    }
  );

export const getDMECategoriesAndProducts = createSelector(
  getFusionMakeAReferralState,
  (state) => state.dmeCustomerServiceConfigurationState.list
);

export const getFusionICDCodes = createSelector(
  getFusionReferralOptions,
  (state: MakeReferralFusionOptions) => {
    return state.icdCodes;
  }
);

export const getFusionBodyPartsForClaim = createSelector(
  getFusionReferralOptions,
  (state: MakeReferralFusionOptions) => {
    return state.bodyParts;
  }
);

export const isFusionSavingDraft = createSelector(
  getFusionMakeAReferralState,
  (state) => state.savingDraft
);

export const getDefaultSubTypeMap = createSelector(
  getFusionMakeAReferralState,
  (state) => state.defaultSubTypeValues
);
