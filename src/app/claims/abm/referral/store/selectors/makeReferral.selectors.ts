import { createSelector } from '@ngrx/store';
import { has } from 'lodash';
import { DIAGNOSTICS_ARCH_TYPE } from '../../make-a-referral/diagnostics/diagnostics-step-definitions';
import { DME_ARCH_TYPE } from '../../make-a-referral/dme/dme-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from '../../make-a-referral/home-health/home-health-step-definitions';
import { LANGUAGE_ARCH_TYPE } from '../../make-a-referral/language/language-step-definitions';
import {
  getAncilliaryServiceCodeFromArchType,
  MakeAReferralOptionsType,
  ServiceType
} from '../../make-a-referral/make-a-referral-shared';
import { PHYSICALMEDICINE_ARCH_TYPE } from '../../make-a-referral/physical-medicine/physical-medicine-step-definitions';
import { TRANSPORTATION_ARCH_TYPE } from '../../make-a-referral/transportation/transportation-step-definitions';
import { MakeReferralFusionOptions } from '../models/fusion/fusion-make-a-referral.models';
import {
  ClaimLocation,
  MakeReferralOptions,
  MakeReferralState,
  RequestorInformationOptions
} from '../models/make-a-referral.models';
import { ReferralState } from '../models/referral.models';
import { getReferralState } from './index';

export const getMakeReferralRootState = createSelector(
  getReferralState,
  (state: ReferralState) => state.makeReferral
);

export const getMakeReferralValidFormStates = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => state.validFormStates
);

export const getSelectableServices = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => {
    return state.selectableServices;
  }
);

export const getReferralReviewMode = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => {
    return state.inReviewMode;
  }
);

export const getSubmissionErrors = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => {
    return state.errors;
  }
);

// Default for transportation. Other services must provide
// the appropriate type.
export const getServiceOptions = (service?: ServiceType) =>
  createSelector(getReferralState, (state: ReferralState) => {
    switch (service) {
      case HOMEHEALTH_ARCH_TYPE:
      case DIAGNOSTICS_ARCH_TYPE:
      case PHYSICALMEDICINE_ARCH_TYPE:
      case DME_ARCH_TYPE:
      case LANGUAGE_ARCH_TYPE: {
        return state.fusionMakeReferral.referralOptions;
      }
      case TRANSPORTATION_ARCH_TYPE:
      default: {
        return state.makeReferral.transportationOptions;
      }
    }
  });

export const getApprovedLocations = (service: ServiceType) =>
  createSelector(
    getServiceOptions(service),
    (state: MakeAReferralOptionsType): ClaimLocation[] => {
      switch (service) {
        case HOMEHEALTH_ARCH_TYPE:
        case DIAGNOSTICS_ARCH_TYPE:
        case PHYSICALMEDICINE_ARCH_TYPE:
        case DME_ARCH_TYPE:
        case LANGUAGE_ARCH_TYPE: {
          if (
            state.approvedLocations &&
            (state as MakeReferralFusionOptions).approvedFusionLocations
          ) {
            return (state as MakeReferralFusionOptions).approvedFusionLocations[
              getAncilliaryServiceCodeFromArchType(service)
            ] as ClaimLocation[];
          } else {
            return [];
          }
        }
        case TRANSPORTATION_ARCH_TYPE:
        default: {
          return state.approvedLocations;
        }
      }
    }
  );
export const isMakeReferralOptionsLoaded = createSelector(
  getMakeReferralRootState,
  (state) => state.transportationOptions.isLoaded
);
export const getVendorSelectionMode = (service?: ServiceType) =>
  createSelector(
    getServiceOptions(service),
    (state: MakeAReferralOptionsType) => {
      // TRP is the default
      if (!service || service === TRANSPORTATION_ARCH_TYPE) {
        return (state as MakeReferralOptions).vendorMode;
      }
      const fusionVendor = (state as MakeReferralFusionOptions).vendorMode.find(
        (f) => f.serviceType === service
      );
      return fusionVendor !== undefined ? fusionVendor.mode : null;
    }
  );

export const getVendors = (service?: ServiceType) =>
  createSelector(
    getServiceOptions(service),
    // The fusion vendor expects the name and code.
    // We can't use a single string list.
    (state: MakeAReferralOptionsType) => {
      // TRP is the default
      if (!service || service === TRANSPORTATION_ARCH_TYPE) {
        return (state as MakeReferralOptions).vendors;
      }
      const fusionVendor = (state as MakeReferralFusionOptions).vendors.find(
        (f) => f.serviceType === service
      );
      return fusionVendor !== undefined ? fusionVendor.list : [];
    }
  );

export const getVendorAutoPopulation = (service?: ServiceType) =>
  createSelector(
    getServiceOptions(service),
    (state: MakeAReferralOptionsType) => {
      // TRP is the default
      if (!service || service === TRANSPORTATION_ARCH_TYPE) {
        return (state as MakeReferralOptions).vendorAutoPopulation;
      }
      const fusionVendor = (state as MakeReferralFusionOptions).vendorAutoPopulation.find(
        (f) => f.serviceType === service
      );
      return fusionVendor !== undefined ? fusionVendor.autoPopulation : null;
    }
  );

export const getLanguageOptions = createSelector(
  getServiceOptions(),
  (state: MakeReferralOptions) => {
    return state.languages;
  }
);

export const getTransportationAppointmentTypes = createSelector(
  getServiceOptions(),
  (state) => state.appointmentTypes
);

export const getTransportationTypes = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => state.transportationTypes
);

export const getSelectedServiceTypes = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => state.selectedServiceTypes
);

export const getFormState = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => state.formState
);

export const getDraftReferralId = createSelector(
  getMakeReferralRootState,
  (state) => state.referralId
);

export const getSectionStatuses = createSelector(
  getMakeReferralRootState,
  (state) => state.sectionStatuses
);

export const getValidFormStates = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState) => state.validFormStates
);

export const isReferralServiceCompleteByServiceName = (serviceName) =>
  createSelector(getMakeReferralRootState, (state: MakeReferralState) => {
    serviceName = serviceName
      .split(' ')
      .map((seg, i) => {
        if (i > 0) {
          seg = seg[0].toUpperCase() + seg.substr(1, seg.length);
        }
        return seg;
      })
      .join('');
    const validCount = state.validFormStates.filter((formName) =>
      formName.startsWith(serviceName)
    ).length;
    const totalCount = Object.keys(state.formState).filter((key) =>
      key.startsWith(serviceName)
    ).length;
    return totalCount !== 0 && validCount === totalCount;
  });

export const getSectionStatusByType = (type) =>
  createSelector(getMakeReferralRootState, (state: MakeReferralState) => {
    if (has(state.sectionStatuses, type)) {
      return state.sectionStatuses[type];
    } else {
      return false;
    }
  });
export const getSectionDirtyByType = (type) =>
  createSelector(getMakeReferralRootState, (state: MakeReferralState) => {
    if (has(state.sectionDirty, type)) {
      return state.sectionDirty[type];
    } else {
      return false;
    }
  });

export const getSelectedServiceDetailTypes = (serviceName: string) =>
  createSelector(
    getMakeReferralRootState,
    /**
     *
     * The OR is a failsafe if the particular service wasn't initialized in time
     */
    (state): string[] => state.selectedServiceDetailTypes[serviceName] || []
  );

export const getFormStateByName = (properties: {
  formStateChild: string;
  useReturnedValues: boolean;
}) =>
  createSelector(getMakeReferralRootState, (state: MakeReferralState) => {
    if (properties.useReturnedValues) {
      if (has(state.returnedFormState, properties.formStateChild)) {
        return state.returnedFormState[properties.formStateChild];
      }
    } else {
      if (has(state.formState, properties.formStateChild)) {
        return state.formState[properties.formStateChild];
      }
    }
    return {};
  });

export const getSpecificNotesByFormStateNameAndIndex = createSelector(
  getMakeReferralRootState,
  (
    state: MakeReferralState,
    properties: {
      formStateChild: string;
      useReturnedValues: boolean;
      index: number;
    }
  ) => {
    const formState = getFormStateByName({
      formStateChild: properties.formStateChild,
      useReturnedValues: properties.useReturnedValues
    }).projector(state);
    if (
      formState.schedulingForm &&
      formState.schedulingForm[properties.index] !== undefined
    ) {
      return formState.schedulingForm[properties.index].notes;
    }
    return '';
  }
);

export const getReferralLevelNotes = (useReturnedValues: boolean = false) =>
  createSelector(
    getMakeReferralRootState,
    (state: MakeReferralState): string => {
      if (useReturnedValues) {
        return state.returnedReferralLevelNotes;
      } else {
        return state.referralLevelNotes;
      }
    }
  );

export const isApprovedLocationsLoaded = createSelector(
  getReferralState,
  (state: ReferralState, serviceName: ServiceType) => {
    switch (serviceName) {
      case TRANSPORTATION_ARCH_TYPE:
        return state.makeReferral.approvedLocationsIsLoaded;
      case LANGUAGE_ARCH_TYPE:
      case DIAGNOSTICS_ARCH_TYPE:
      case PHYSICALMEDICINE_ARCH_TYPE:
      case HOMEHEALTH_ARCH_TYPE:
      case DME_ARCH_TYPE:
        return state.fusionMakeReferral.referralOptions
          .approvedLocationsIsLoaded;
    }
  }
);

export const getRequestorInformationOptions = createSelector(
  getMakeReferralRootState,
  (state: MakeReferralState): RequestorInformationOptions =>
    state.requestorInformationOptions
);

export const isLoadedFromDraft = createSelector(
  getMakeReferralRootState,
  (state) => state.loadedFromDraft
);

export const isSavingNewTransportationLocation = createSelector(
  getMakeReferralRootState,
  (state) => state.savingNewTransportationLocation
);
