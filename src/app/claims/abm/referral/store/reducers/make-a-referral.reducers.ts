import { mergeClone } from '@shared';
import { cloneDeep, remove } from 'lodash';

import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_REVIEW_STEP_NAME
} from '../../make-a-referral/diagnostics/diagnostics-step-definitions';
import {
  DME_ARCH_TYPE,
  DME_REVIEW_STEP_NAME
} from '../../make-a-referral/dme/dme-step-definitions';
import {
  HOMEHEALTH_ARCH_TYPE,
  HOMEHEALTH_REVIEW_STEP_NAME
} from '../../make-a-referral/home-health/home-health-step-definitions';
import { LANGUAGE_ARCH_TYPE } from '../../make-a-referral/language/language-step-definitions';
import { buildLocationAddressDisplayText } from '../../make-a-referral/make-a-referral-shared';
import { PHYSICALMEDICINE_ARCH_TYPE } from '../../make-a-referral/physical-medicine/physical-medicine-step-definitions';
import {
  TRANSPORTATION_ARCH_TYPE,
  TRANSPORTATION_OTHER_STEP_NAME,
  TRANSPORTATION_SEDAN_STEP_NAME,
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME
} from '../../make-a-referral/transportation/transportation-step-definitions';
import { fusionSubmitReferralSuccess } from '../actions/fusion/fusion-make-a-referral.actions';
import {
  clearLoadedFromDraftFlag,
  loadDiagnosticsDraft,
  loadDiagnosticsDraftSuccessful,
  loadDMEDraft,
  loadDMEDraftSuccessful,
  loadHomeHealthDraft,
  loadHomeHealthDraftSuccessful,
  loadLanguageDraft,
  loadLanguageDraftSuccessful,
  loadPhysicalMedicineDraft,
  loadPhysicalMedicineDraftSuccessful,
  loadTRPDraft,
  loadTRPDraftSuccessful
} from '../actions/make-a-referral-draft.actions';
import {
  Action,
  ActionType,
  addTransportationLocation,
  addTransportationLocationFailure,
  addTransportationLocationSuccess,
  removeFailedDocument,
  removeSuccessServicesFormState,
  requestRequestorInformationOptionsSuccess,
  submitTransportationReferralFailure,
  submitTransportationReferralSuccess
} from '../actions/make-a-referral.actions';
import {
  ClaimLocation,
  DateFormMode,
  makeReferralInitialState,
  MakeReferralState,
  REFERRAL_REQUESTOR_INFORMATION,
  ReferralLocationCreateRequest,
  RequestorInformationOptions
} from '../models/make-a-referral.models';
import { ErrorSharedMakeAReferral } from '../models/shared-make-a-referral.models';

export function makeReferralReducer(state: MakeReferralState, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE_SECTION_FORM: {
      const newState = cloneDeep(state);
      Object.keys(action.payload).forEach((key) => {
        newState.formState[key] = cloneDeep(action.payload[key]);
      });
      return newState;
    }

    case ActionType.GET_SERVICE_SELECTION_VALUES_SUCCESS:
      return mergeClone(state, {
        selectableServices: action.payload
      });

    case ActionType.GET_TRANSPORTATION_OPTIONS_SUCCESS:
      let newState = {
        transportationOptions: { ...action.payload, isLoaded: true },
        approvedLocationsIsLoaded: true
      };
      let getTransportationOptionsSuccessLocations =
        newState.transportationOptions.approvedLocations;
      let getTransportationOptionsSuccessCurrentFormState = state.formState;

      // If we're loading a MAR draft the draft data only has locationIds instead of location objects, so when we get the approvedLocations
      //  options data we can merge the two to update the fromAddress & toAddress values
      // This only applies to detailed (not open) authorizations because we currently store open locations purely as IDs, but detailed
      //  locations are objects
      fixFromToAddressLocationsForStep(
        TRANSPORTATION_SEDAN_STEP_NAME,
        getTransportationOptionsSuccessCurrentFormState,
        getTransportationOptionsSuccessLocations
      );
      fixFromToAddressLocationsForStep(
        TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME,
        getTransportationOptionsSuccessCurrentFormState,
        getTransportationOptionsSuccessLocations
      );
      fixFromToAddressLocationsForStep(
        TRANSPORTATION_OTHER_STEP_NAME,
        getTransportationOptionsSuccessCurrentFormState,
        getTransportationOptionsSuccessLocations
      );

      return mergeClone(state, newState);

    case ActionType.GET_TRANSPORTATION_TYPES_SUCCESS:
      return mergeClone(state, {
        transportationTypes: { types: action.payload, isLoaded: true }
      });
    case ActionType.SET_SPECIFIC_DATE_NOTE:
      const obj = { formState: {} };
      obj.formState[action.payload.ngrxStepName] = cloneDeep(
        state.formState[action.payload.ngrxStepName]
      );
      obj.formState[action.payload.ngrxStepName].schedulingForm[
        action.payload.index
      ].notes = action.payload.note;

      return mergeClone(state, obj);

    case addTransportationLocation.type:
      return mergeClone(state, {
        approvedLocationsIsLoaded: false,
        savingNewTransportationLocation: true
      });
    case addTransportationLocationSuccess.type:
      let newLocation: ReferralLocationCreateRequest = action['newLocation'];
      let addTransportationlocations =
        state.transportationOptions.approvedLocations;

      addTransportationlocations.push({
        id: newLocation.id + '',
        name: newLocation.locationName,
        // Since we're storing location objects with their descriptions for the
        // type, we need to translate the code used to create a location to the description
        type: state.transportationOptions.locationTypes.find(
          (type) => type.code === newLocation.type
        ).description,
        address: buildLocationAddressDisplayText(newLocation.address)
      });
      return mergeClone(state, {
        transportationOptions: {
          approvedTransportationLocationsByType: addTransportationlocations
        },
        approvedLocationsIsLoaded: true,
        savingNewTransportationLocation: false
      });
    case addTransportationLocationFailure.type:
      return mergeClone(state, {
        approvedLocationsIsLoaded: true,
        savingNewTransportationLocation: false
      });
    case ActionType.RESET_MAKE_A_REFERRAL:
      const resetState: MakeReferralState = cloneDeep(makeReferralInitialState);
      resetState.selectableServices = cloneDeep(state.selectableServices);

      // The transportation options is not strictly necessary, as it would reload naturally.  However doing this saves a service call.
      resetState.transportationOptions = cloneDeep(state.transportationOptions);

      resetState.requestorInformationOptions = cloneDeep(
        state.requestorInformationOptions
      );
      return resetState;

    case ActionType.SET_SELECTED_SERVICE_TYPES:
      return mergeClone(state, {
        selectedServiceTypes: action.payload
      });
    case ActionType.SET_SELECTED_SERVICE_DETAIL_TYPES:
      return mergeClone(state, {
        selectedServiceDetailTypes: action.payload
      });
    case ActionType.SET_SECTION_STATUS:
      return mergeClone(state, {
        sectionStatuses: { ...state.sectionStatuses, ...action.payload }
      });
    case ActionType.SET_SECTION_DIRTY:
      return mergeClone(state, {
        sectionDirty: {
          ...state.sectionDirty,
          ...action.payload
        }
      });
    case ActionType.REMOVE_SERVICE:
      const selectedServices = [...state.selectedServiceTypes];
      remove(selectedServices, (s) => s === action.payload);
      delete state.sectionDirty[action.payload];
      delete state.sectionStatuses[action.payload];
      state.selectedServiceDetailTypes[action.payload] = [];
      cleanupServiceData(state, action.payload);

      return mergeClone(state, { selectedServiceTypes: selectedServices });

    case ActionType.ADD_VALID_FORM_STATE: {
      const index = state.validFormStates.indexOf(action.payload);

      if (index === -1) {
        const validFormStates = cloneDeep(state.validFormStates);
        validFormStates.push(action.payload);
        return mergeClone(state, {
          validFormStates: validFormStates
        });
      } else {
        return state;
      }
    }

    case ActionType.REMOVE_VALID_FORM_STATE: {
      return removeFromValidFormState(state, action.payload);
    }

    case ActionType.PRUNE_FORM_DATA: {
      const newState = cloneDeep(state);
      delete newState.formState[action.payload];
      return removeFromValidFormState(newState, action.payload);
    }

    case ActionType.UPDATE_REFERRAL_LEVEL_NOTE: {
      return mergeClone(state, { referralLevelNotes: action.payload });
    }

    case submitTransportationReferralSuccess.type: {
      const referralData = action as any;
      const newState = cloneDeep(state);
      setReturnedFormState(newState, referralData['referralData'].formValues);
      newState.returnedReferralLevelNotes =
        referralData['referralData'].referralLevelNotes;
      newState.inReviewMode = true;
      newState.errors = null;
      return newState;
    }
    case submitTransportationReferralFailure.type: {
      const newState = cloneDeep(state);
      newState.errors = (action as any).errors;
      return newState;
    }

    case fusionSubmitReferralSuccess.type: {
      const { successResponse } = action as any;
      const newState: MakeReferralState = cloneDeep(state);
      newState.inReviewMode = true;
      return setFusionAllServicesReturnedFormState(newState, successResponse);
    }

    case removeFailedDocument.type: {
      const newState: MakeReferralState = cloneDeep(state);
      const documentList: string[] = (action as any).documents;
      const serviceDocuments =
        newState.formState[(action as any).service + '-documents'];

      if (null != serviceDocuments) {
        const originalDocuments: any[] = serviceDocuments['documents'];
        if (null != originalDocuments) {
          documentList.forEach((doc) => {
            remove(originalDocuments, { fileName: doc });
          });
        }
      }

      return newState;
    }

    case requestRequestorInformationOptionsSuccess.type: {
      let newState: MakeReferralState = cloneDeep(state);
      newState.requestorInformationOptions = action[
        'requestorInformationOptions'
      ] as RequestorInformationOptions;
      return newState;
    }

    case removeSuccessServicesFormState.type: {
      const errorResponse: ErrorSharedMakeAReferral[] = (action as any)
        .errorResponse;
      let newFormState = {};
      let newValidFormStates = [];
      let newSelectedServices = [];
      errorResponse.forEach((error) => {
        Object.keys(state.formState).forEach((key) => {
          if (
            key.includes(error.service) ||
            key === REFERRAL_REQUESTOR_INFORMATION
          ) {
            newFormState[key] = { ...state.formState[key] };
          }
        });

        state.validFormStates.forEach((service) => {
          if (
            service.includes(error.service) ||
            service === REFERRAL_REQUESTOR_INFORMATION
          ) {
            newValidFormStates.push(service);
          }
        });

        state.selectedServiceTypes.forEach((service) => {
          if (service === error.serviceLabel) {
            newSelectedServices.push(service);
          }
        });
      });
      return {
        ...state,
        formState: newFormState,
        validFormStates: newValidFormStates,
        selectedServiceTypes: newSelectedServices
      };
    }
    case loadTRPDraft.type as ActionType:
    case loadDMEDraft.type as ActionType:
    case loadHomeHealthDraft.type as ActionType:
    case loadDiagnosticsDraft.type as ActionType:
    case loadPhysicalMedicineDraft.type as ActionType:
    case loadLanguageDraft.type as ActionType:
      return { ...state, loadedFromDraft: true };
    case clearLoadedFromDraftFlag.type as ActionType:
      return { ...state, loadedFromDraft: false };
    case loadDMEDraftSuccessful.type as ActionType:
    case loadHomeHealthDraftSuccessful.type as ActionType:
    case loadPhysicalMedicineDraftSuccessful.type as ActionType:
    case loadDiagnosticsDraftSuccessful.type as ActionType:
    case loadLanguageDraftSuccessful.type as ActionType:
    case loadTRPDraftSuccessful.type as ActionType: {
      const { formValues, referralId, referralLevelNotes } = action as any;
      let formValuesNotes = {};
      let formServiceReview;
      if (objectHasPropertyStartingWithKey(formValues, DIAGNOSTICS_ARCH_TYPE)) {
        formServiceReview = DIAGNOSTICS_REVIEW_STEP_NAME;
      }
      if (objectHasPropertyStartingWithKey(formValues, HOMEHEALTH_ARCH_TYPE)) {
        formServiceReview = HOMEHEALTH_REVIEW_STEP_NAME;
      }
      if (objectHasPropertyStartingWithKey(formValues, DME_ARCH_TYPE)) {
        formServiceReview = DME_REVIEW_STEP_NAME;
      }
      if (formServiceReview) {
        formValuesNotes[formServiceReview] = {
          notes: referralLevelNotes
        };
      }

      let newFormValues = { ...formValues, ...formValuesNotes };

      return {
        ...state,
        referralId,
        referralLevelNotes: referralLevelNotes,
        formState: newFormValues
      };
    }
  }

  return state;
}

function setFusionAllServicesReturnedFormState(
  newState: MakeReferralState,
  successResponse: {
    [key: string]: {
      referralId: number;
      postSubmitData: { [key: string]: any };
    };
  }
) {
  const services = Object.keys(successResponse);
  const postSubmits = services.map(
    (serviceName: string) => successResponse[serviceName].postSubmitData
  );
  if (newState.returnedFormState == null) {
    newState.returnedFormState = {};
  }
  for (const postSubmitData of postSubmits) {
    setFusionReturnedFormState(newState.returnedFormState, postSubmitData);
  }
  // Referral Level Notes
  newState.returnedReferralLevelNotes = newState.referralLevelNotes;
  return newState;
}

function setFusionReturnedFormState(
  returnedFormState: any,
  postSubmitData: any
) {
  if (postSubmitData) {
    const formKeys = Object.keys(postSubmitData);
    for (const formKey of formKeys) {
      if (postSubmitData[formKey] !== null) {
        returnedFormState[formKey] = postSubmitData[formKey];
      }
    }
  }
  return returnedFormState;
}

function setReturnedFormState(newState: any, successResponse: any) {
  const formKeys = Object.keys(successResponse);
  if (newState.returnedFormState == null) {
    newState['returnedFormState'] = {};
  }
  for (const formKey of formKeys) {
    if (successResponse[formKey] !== null) {
      newState['returnedFormState'][formKey] = successResponse[formKey];
    }
  }
}

function removeFromValidFormState(
  state: MakeReferralState,
  value: string
): MakeReferralState {
  const index = state.validFormStates.indexOf(value);

  if (index !== -1) {
    const validFormStates = cloneDeep(state.validFormStates);
    validFormStates.splice(index, 1);
    return mergeClone(state, {
      validFormStates: validFormStates
    });
  } else {
    return state;
  }
}

// This will remove form data and cleanup the valid form state for removed services.
function cleanupServiceData(state: MakeReferralState, serviceName: string) {
  let serviceArchType = null;
  // The service name comes from an external source.  If its name changes, please update this function.
  switch (serviceName) {
    case 'Transportation':
      serviceArchType = TRANSPORTATION_ARCH_TYPE;
      break;
    case 'Diagnostics':
      serviceArchType = DIAGNOSTICS_ARCH_TYPE;
      break;
    case 'Language':
      serviceArchType = LANGUAGE_ARCH_TYPE;
      break;
    case 'DME':
      serviceArchType = DME_ARCH_TYPE;
      break;
    case 'Physical Medicine':
      serviceArchType = PHYSICALMEDICINE_ARCH_TYPE;
      break;
    case 'Home Health':
      serviceArchType = HOMEHEALTH_ARCH_TYPE;
      break;
    case 'Implants':
    /*serviceArchType = IMPLANTS_ARCH_TYPE;
      break;*/
    default:
      console.warn(
        'Unknown service archtype, please fix or add a case for this. ',
        serviceName
      );
  }

  if (null === serviceArchType) {
    console.warn('unknown service archtype, no cleanup done.');
    return;
  }
  let fields: string[];

  // Cleanup form fields
  fields = Object.keys(state.formState).filter((value) =>
    value.startsWith(serviceArchType)
  );

  fields.forEach((value) => {
    delete state.formState[value];
  });

  fields = [];
  state.validFormStates.forEach((value) => {
    if (value.startsWith(serviceArchType)) {
      fields.push(value);
    }
  });
  fields.forEach((value) => {
    state.validFormStates.splice(state.validFormStates.indexOf(value), 1);
  });
}

function objectHasPropertyStartingWithKey(object: any, key: string): boolean {
  return Object.keys(object).findIndex((value) => value.indexOf(key) > -1) > -1;
}

function fixFromToAddressLocationsForStep(
  stepName: string,
  formState: any,
  locations: ClaimLocation[]
) {
  if (
    objectHasPropertyStartingWithKey(formState, stepName) &&
    formState[stepName]['authorizationDateType'] === DateFormMode.SpecificDate
  ) {
    formState[stepName]['schedulingForm'].forEach((schedulingForm: {}) => {
      if (!!schedulingForm['fromAddress']) {
        schedulingForm['fromAddress'] = locations.find(
          (location) => location.id === schedulingForm['fromAddress']['id']
        );
      }
      if (!!schedulingForm['toAddress']) {
        schedulingForm['toAddress'] = locations.find(
          (location) => location.id === schedulingForm['toAddress']['id']
        );
      }
    });
  }
}
