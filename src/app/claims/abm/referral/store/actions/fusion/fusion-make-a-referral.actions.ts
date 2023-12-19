import { createAction, props } from '@ngrx/store';

import {
  AncilliaryServiceCode,
  ServiceType
} from '../../../make-a-referral/make-a-referral-shared';
import {
  FusionICDCode,
  FusionVendorAllocation,
  ServiceLocations
} from '../../models/fusion/fusion-make-a-referral.models';
import {
  CustomerServiceConfiguration,
  LocationType,
  ReferralBodyPart,
  ReferralLocationCreateRequest,
  ReferralSubmitMessage
} from '../../models/make-a-referral.models';
import { ActionType } from '../make-a-referral.actions';

// Languages
export const loadFusionLanguages = createAction(
  '[Make a Referral :: Fusion] Load Languages Request',
  props<{ encodedCustomerId: string }>()
);
export const loadFusionLanguageSuccess = createAction(
  '[Make a Referral :: Fusion] Load Languages Request Success',
  props<{ languages: string[] }>()
);
export const loadFusionLanguageFail = createAction(
  '[Make a Referral :: Fusion] Load Languages Request Failure',
  props<{ errors: string[] }>()
);

// Customer Service Configurations
export const loadLanguageCustomerServiceConfigurations = createAction(
  '[Make a Referral :: Fusion] Load Language Customer Service Configuration',
  props<{ encodedCustomerId: string }>()
);
export const loadLanguageCustomerServiceConfigurationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Language Customer Service Configuration Success',
  props<{ customerServiceConfigurations: CustomerServiceConfiguration[] }>()
);
export const loadLanguageCustomerServiceConfigurationsFail = createAction(
  '[Make a Referral :: Fusion] Load Language Customer Service Configuration Fail',
  props<{ errors: string[] }>()
);

// Diagnostics Service Configurations
export const loadDiagnosticsCustomerServiceConfigurations = createAction(
  '[Make a Referral :: Fusion] Load Diagnostics Customer Service Configuration',
  props<{ encodedCustomerId: string }>()
);
export const loadDiagnosticsCustomerServiceConfigurationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Diagnostics Customer Service Configuration Success',
  props<{ customerServiceConfigurations: CustomerServiceConfiguration[] }>()
);
export const loadDiagnosticsCustomerServiceConfigurationsFail = createAction(
  '[Make a Referral :: Fusion] Load Diagnostics Customer Service Configuration Fail',
  props<{ errors: string[] }>()
);

// Physical Medicine Service Configurations
export const loadPhysicalMedicineCustomerServiceConfigurations = createAction(
  '[Make a Referral :: Fusion] Load Physical Medicine Customer Service Configuration',
  props<{ encodedCustomerId: string }>()
);
export const loadPhysicalMedicineCustomerServiceConfigurationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Physical Medicine Customer Service Configuration Success',
  props<{ customerServiceConfigurations: CustomerServiceConfiguration[] }>()
);
export const loadPhysicalMedicineCustomerServiceConfigurationsFail = createAction(
  '[Make a Referral :: Fusion] Load Physical Medicine Customer Service Configuration Fail',
  props<{ errors: string[] }>()
);

// Home Health Service Configurations
export const loadHomeHealthCustomerServiceConfigurations = createAction(
  '[Make a Referral :: Fusion] Load Home Health Customer Service Configuration',
  props<{ encodedCustomerId: string }>()
);
export const loadHomeHealthCustomerServiceConfigurationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Home Health Customer Service Configuration Success',
  props<{ customerServiceConfigurations: CustomerServiceConfiguration[] }>()
);
export const loadHomeHealthCustomerServiceConfigurationsFail = createAction(
  '[Make a Referral :: Fusion] Load Home Health Customer Service Configuration Fail',
  props<{ errors: string[] }>()
);

// DME Service Configurations
export const loadDMECustomerServiceConfigurations = createAction(
  '[Make a Referral :: Fusion] Load DME Customer Service Configuration',
  props<{ encodedCustomerId: string }>()
);
export const loadDMECustomerServiceConfigurationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load DME Customer Service Configuration Success',
  props<{ customerServiceConfigurations: CustomerServiceConfiguration[] }>()
);
export const loadDMECustomerServiceConfigurationsFail = createAction(
  '[Make a Referral :: Fusion] Load DME Customer Service Configuration Fail',
  props<{ errors: string[] }>()
);

// Locations
export const loadFusionApprovedLocations = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Locations',
  props<{
    serviceCode: AncilliaryServiceCode;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);
export const loadFusionApprovedLocationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Locations Success',
  props<{ referralLocations: ServiceLocations }>()
);
export const loadFusionApprovedLocationsFail = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Locations Fail',
  props<{ errors: string[] }>()
);

// Fusion save as draft
export const fusionSaveAsDraft = createAction(
  '[Make a Referral :: Fusion] Save as Draft',
  props<{ submitMessage: ReferralSubmitMessage }>()
);
export const fusionSaveAsDraftSuccess = createAction(
  '[Make a Referral :: Fusion] Save as Draft Success',
  props<{ [key: string]: number }>()
);
export const fusionSaveAsDraftFail = createAction(
  '[Make a Referral :: Fusion] Save as Draft Fail',
  props<{ errors: string[] }>()
);

export const fusionSubmitReferralSuccess = createAction(
  '[Make a Referral :: Fusion] Submit Referral Success' as ActionType,
  props<{
    claimNumber: string;
    customerId: string;
    successResponse: {
      [key: string]: {
        referralId: number;
        postSubmitData: { [key: string]: any };
      };
    };
  }>()
);
export const fusionSubmitReferralFail = createAction(
  '[Make a Referral :: Fusion] Submit Referral Fail' as ActionType,
  props<{ errors: string[] }>()
);

// Get ICD Codes
export const loadFusionICDCodes = createAction(
  '[Make a Referral :: Fusion] Load Fusion ICD Codes'
);
export const loadFusionICDCodesSuccess = createAction(
  '[Make a Referral :: Fusion] Load Fusion ICD Codes Success',
  props<{ icdCodes: FusionICDCode[] }>()
);
export const loadFusionICDCodesFail = createAction(
  '[Make a Referral :: Fusion] Load Fusion ICD Codes Fail',
  props<{ errors: string[] }>()
);

// Location Types
export const loadLocationTypes = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Location Types',
  props<{ encodedCustomerId: string }>()
);
export const loadLocationTypesSuccess = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Location Types Success',
  props<{ locationTypes: LocationType[] }>()
);
export const loadLocationTypesFail = createAction(
  '[Make a Referral :: Fusion] Load Fusion Approved Location Types Fail',
  props<{ errors: string[] }>()
);

// Submit New Location
export const addFusionLocation = createAction(
  '[Make a Referral :: Fusion] Add Fusion Location Attempt',
  props<{
    newLocation: ReferralLocationCreateRequest;
    encodedClaimNumber: string;
    encodedCustomerId: string;
    serviceCode: AncilliaryServiceCode;
  }>()
);
export const addFusionLocationSuccess = createAction(
  '[Make a Referral :: Fusion] Add Fusion Location Success',
  props<{
    status: number;
    newLocation: ReferralLocationCreateRequest;
    encodedClaimNumber: string;
    encodedCustomerId: string;
    serviceCode: AncilliaryServiceCode;
  }>()
);
export const addFusionLocationFail = createAction(
  '[Make a Referral :: Fusion] Add Fusion Location Fail',
  props<{ error: string }>()
);

// Fusion Vendor Allocations
export const loadFusionVendorAllocations = createAction(
  '[Make a Referral :: Fusion] Load Fusion Vendor Allocations',
  props<{
    ancillaryServiceCode: AncilliaryServiceCode;
    encodedClaimNumber: string;
    encodedCustomerId: string;
    serviceProductTypeId?: number;
    serviceProductSubTypeId?: number;
    serviceType: ServiceType;
  }>()
);
export const loadFusionVendorAllocationsSuccess = createAction(
  '[Make a Referral :: Fusion] Load Fusion Vendor Allocations Success',
  props<{ vendorAllocation: FusionVendorAllocation }>()
);
export const loadFusionVendorAllocationsFail = createAction(
  '[Make a Referral :: Fusion] Load Fusion Vendor Allocations Fail',
  props<{ errors: string[] }>()
);

// Fusion Upload Documents
export const uploadFusionDocument = createAction(
  '[Make a Referral :: Fusion] Upload Document',
  props<{
    referralId: number;
    document: File;
    serviceName: string;
    claimNumber: string;
    customerId: string;
    isForPmExtension?: boolean;
    hesReferralDetailId?: number;
  }>()
);
export const uploadFusionDocumentSuccess = createAction(
  '[Make a Referral :: Fusion] Upload Document Success'
);
export const uploadFusionDocumentFail = createAction(
  '[Make a Referral :: Fusion] Upload Document Fail',
  props<{ errors: string[] }>()
);

// Get Fusion Body Parts for Claim
export const loadFusionBodyParts = createAction(
  '[Make a Referral] Load Fusion Body Parts',
  props<{
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);
export const loadFusionBodyPartsSuccess = createAction(
  '[Make a Referral] Load Fusion Body Parts Success',
  props<{ bodyParts: ReferralBodyPart[] }>()
);
export const loadFusionBodyPartsFail = createAction(
  '[Make a Referral] Load Fusion Body Parts Fail',
  props<{ errors: string[] }>()
);

// Reset Fusion Referral
export const resetFusionMakeAReferral = createAction(
  '[Make a Referral] Reset make a referral'
);
