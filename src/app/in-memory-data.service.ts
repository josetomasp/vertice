import { Claim } from '@shared';
import { randomIdLikeNumber, randomIdLikeString } from '@shared/lib/random';
import { DocumentsApiResults } from '@shared/store/models/claim-documents-table.models';
import { ClaimV3 } from '@shared/store/models/claim.models';
import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
  STATUS
} from 'angular-in-memory-web-api';
import { has } from 'lodash';
import { AncilliaryServiceCode } from './claims/abm/referral/make-a-referral/make-a-referral-shared';
import { CustomerServiceConfiguration } from './claims/abm/referral/store/models/make-a-referral.models';
import { authorizationInformation } from './in-memory-data/authorization/authorizationInformation-data';
import {
  AUTHENTICATION_REASONS_FOR_CUSTOMER_DATA,
  AUTHORIZATION_REFERRAL_DOCUMENTS,
  DME_AUTHORIZATION_ALL_TYPES,
  DX_AUTHORIZATION_ALL_TYPES,
  HH_AUTHORIZATION_ALL_TYPES,
  LAN_AUTHORIZATION_ALL_TYPES,
  PM_AUTHORIZATION_ALL_TYPES
} from './in-memory-data/authorization/fusionAuthorizationDetails.data';
import {
  DIAGNOSTICS_AUTHORIZATION_HISTORY,
  DME_AUTHORIZATION_HISTORY,
  HOME_HEALTH_AUTHORIZATION_HISTORY,
  LANGUAGE_AUTHORIZATION_HISTORY,
  LEGACY_TRANSPORTATION_HISTORY,
  PHYSICAL_MEDICINE_AUTHORIZATION_HISTORY
} from './in-memory-data/authorization/fusionAuthorizationHistory';
import { customerRiskVolumeData } from './in-memory-data/customer-risk-volume-data';
import { DrugData } from './in-memory-data/drug-data';
import { IcdCodesData } from './in-memory-data/icd-codes-data';
import { incidentsData } from './in-memory-data/incidents-data';
import { pendingClaimActivity } from './in-memory-data/pending-activity';
import { pharmacyData } from './in-memory-data/pharmacyLookup-modal-data';
import { preferences } from './in-memory-data/preferences';
import { prescriberData } from './in-memory-data/prescriberLooup-modal-data';
import { referralActivityIMDB } from './in-memory-data/referral-activity';
import { ICD_CODE_SEARCH } from './in-memory-data/referral-activity/icd-code-search';
import { CLINICAL_HISTORY } from './in-memory-data/referral/clinicalHistory';
import { fusionReferralSubmit } from './in-memory-data/referral/fusion-submit.data';
import * as MakeAReferralSearch from './in-memory-data/referral/makeAReferralSearch-data';
import {
  createLocationForClaim,
  diagnosticsCustomerServiceConfiguration,
  dmeCustomerServiceConfiguration,
  fusionBodyPartsForClaim,
  fusionIcdCodes,
  fusionIcdCodeSearch,
  fusionVendorAllocations,
  getLocationsForClaim,
  homeHealthCustomerServiceConfiguration,
  languageCustomerServiceConfiguration,
  locationTypes,
  makeReferralData,
  makeReferralOptions,
  physicalMedicineCustomerServiceConfiguration,
  referralLanguages,
  referralTransportationTypes,
  requestorInformationOptions
} from './in-memory-data/referral/makeReferral-data';
import * as SearchNav from './in-memory-data/referral/nav-search.data';
import {
  imdbReferralAuthorizationOptions,
  imdbReferralAuthorizationsData
} from './in-memory-data/referral/referralAuthorizationData';
import { reports } from './in-memory-data/report-list-data';
import {
  RiskLevelOverTime,
  RiskModalData
} from './in-memory-data/risk-modal-data';
import { clinicalHistory } from './in-memory-data/shared/clinicalHistory';
import { prescriptionHistory } from './in-memory-data/shared/prescriptionHistory';
import {
  DIAGNOSTICS_DRAFT_927551,
  DME_DRAFT_927958,
  HOME_HEALTH_DRAFT_927893
} from './in-memory-data/referral/fusion-makeAReferral-drafts.data';
import { FIRST_FILLS_QUEUE_DATA_IMDB } from './in-memory-data/csc-admin/first-fills-data';
import { ClaimSearch } from './in-memory-data/claim-search-response';
import { customerConfigs } from './in-memory-data/customer-configs';
import { eligibility, eligibilityV3 } from './in-memory-data/eligibility-data';
import { activityResponse } from './in-memory-data/claim-view/claim-activity-data';
import { billingTabData } from './in-memory-data/claim-view/billing-tab-data';
import {
  activityTabs,
  allTabColumns,
  clinicalTabColumns,
  navigationTabs,
  pharmacyTabColumns
} from './in-memory-data/claim-view/tab-data';
import { AUTHORIZATION_STATUS_QUEUE_DATA } from './in-memory-data/csc-admin/authorization-status-queue-data';
import { imdbPosAuthRxHistoryRowData } from './csc-administration/create-pos-authorization/components/create-new-pos-auth/create-new-pos-auth.models';
import { RealTimeRejectsData } from './in-memory-data/csc-admin/realTimeRejects-data';
import { ListOfPrescribersData } from './in-memory-data/listOfPrescribers-data';
import { CSCViewLogData } from './in-memory-data/csc-admin/cscViewLogData';
import { OTHER_MEDICATION_SEARCH_RESULTS_DATA } from './in-memory-data/csc-admin/other-medication-search-results-data';
import { lomnQRvalidationData } from './in-memory-data/pbm/lomnQRvalidationData';
import { ADD_FIRST_FILL_REFERENCE_DATA } from './in-memory-data/csc-admin/add-first-fill-reference-data';
import { FIRST_FILLS_TO_ASSIGN_DATA } from './in-memory-data/csc-admin/first-fills-to-assign-data';

export interface Tab {
  name: string;
  isSelected: boolean;
  routerLink?: string;
  elementName?: string;
}

export interface IMDBClaim extends Claim {
  claimNumber: string;
  customerId: string;
}

export interface IMDBClaimV3 extends ClaimV3 {
  claimNumber: string;
  customerId: string;
  otherApportionmentDescription: string;
}

export class HealtheInMemoryDataService implements InMemoryDbService {
  postDb: { [key: string]: (requestInfo: RequestInfo) => ResponseOptions };

  new200Request(bodyData) {
    let body;
    if (bodyData instanceof Function) {
      body = bodyData();
    } else {
      body = bodyData;
    }
    return (requestInfo: RequestInfo): ResponseOptions => {
      return {
        body,
        status: STATUS.OK,
        headers: requestInfo.headers,
        url: requestInfo.url
      };
    };
  }

  new201Request(bodyData) {
    let body;
    if (bodyData instanceof Function) {
      body = bodyData();
    } else {
      body = bodyData;
    }
    return (requestInfo: RequestInfo): ResponseOptions => {
      return {
        body,
        status: STATUS.CREATED,
        headers: requestInfo.headers,
        url: requestInfo.url
      };
    };
  }

  post(requestInfo: RequestInfo) {
    const { collectionName } = requestInfo;
    if (has(this.postDb, collectionName)) {
      return requestInfo.utils.createResponse$(() =>
        this.postDb[collectionName](requestInfo)
      );
    } else {
      console.warn(`There is no registered endpoint for ${collectionName}`);
    }
    return undefined;
  }

  createDb() {
    const documents: DocumentsApiResults = {
      numberOfDocuments: 9,
      documents: [
        {
          documentDescription: 'LOMN NEW TEROCIN',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=8&lomnImageID=16&format=pdf&lomnDrugID=13',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/10/2014'
        },
        {
          documentDescription: 'LOMN MEDROX',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=8&lomnImageID=17&format=pdf&lomnDrugID=14',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/10/2014'
        },
        {
          documentDescription: 'LOMN NEW TEROCIN',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=9&lomnImageID=18&format=pdf&lomnDrugID=15',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/10/2014'
        },
        {
          documentDescription: 'LOMN MEDROX',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=9&lomnImageID=19&format=pdf&lomnDrugID=16',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/10/2014'
        },
        {
          documentDescription: 'LOMN NEW TEROCIN',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=10&lomnImageID=20&format=pdf&lomnDrugID=17',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/13/2014'
        },
        {
          documentDescription: 'LOMN MEDROX',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=10&lomnImageID=21&format=pdf&lomnDrugID=18',
          documentType: 'Paper - LOMN Sent',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'ABM',
          documentDate: '10/13/2014'
        },
        {
          documentDescription: 'LOMN NEW TEROCIN',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=10&lomnImageID=98&format=tif&lomnDrugID=17',
          documentType: 'Paper - LOMN Received',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/13/2014'
        },
        {
          documentDescription: 'LOMN MEDROX',
          documentURI:
            '/HesDashboard/printLomnLetter?lomnMasterID=10&lomnImageID=99&format=tif&lomnDrugID=18',
          documentType: 'Paper - LOMN Received',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=3960863',
          serviceType: 'LOMN',
          submittedBy: 'Healthe Systems Fax/Mail',
          productType: 'PBM',
          documentDate: '10/13/2014'
        },
        {
          documentDescription: 'Paper',
          documentURI: '/StaticWeb/image_one/15342/15342AME3366606.tif',
          documentType: 'Physician Dispensed',
          documentSource: 'Paper Bill Roster Detail',
          relatedTransURL: '/PbmPaper/pbmpaper.jsp#IndivBill;b=4534233',
          serviceType: 'Retrospective Bills',
          submittedBy: 'Healthe Systems',
          productType: 'PBM',
          documentDate: '12/01/2015'
        }
      ]
    };

    /**
     * This is so that the path scheme can remain consistent
     */
    const v1 = [
      {
        id: 'user',
        email: 'OTISDALE',
        username: 'OTISDATE@example.com',
        firstName: '',
        lastName: 'Dale',
        customerID: 'TRAVELERS'
      },
      {
        id: 'claimSearchOptions',
        assignedAdjuster: [
          'alice@adjuster.com',
          'peggy@programmanger.com',
          'OTISDALE'
        ],
        riskCategory: ['Patient Safety', 'Medication Selection', 'Financial'],
        riskLevel: [
          '0 - No Risk Identified',
          '1 - Lowest',
          '2 - Low',
          '3 - Medium',
          '4 - High',
          '5 - Highest'
        ],
        stateOfVenue: ['AK', 'AL', 'FL']
      },
      { id: 'documents', claimNumber: '', customerId: '', ...documents }
    ];

    const customerServiceConfiguration: {
      id: AncilliaryServiceCode;
      data: CustomerServiceConfiguration[];
    }[] = [
      languageCustomerServiceConfiguration,
      diagnosticsCustomerServiceConfiguration,
      physicalMedicineCustomerServiceConfiguration,
      homeHealthCustomerServiceConfiguration,
      dmeCustomerServiceConfiguration
    ];

    this.postDb = {
      fusionReferralSubmit: this.new201Request(fusionReferralSubmit),
      fusionUploadFileToReferral: this.new201Request(true),
      // For Fusion
      createLocationForClaim: this.new201Request(randomIdLikeString),
      fusionLanguageReferralAuthorizationSubmit: this.new201Request(true),
      fusionDiagnosticsReferralAuthorizationSubmit: this.new201Request(true),
      fusionDMEReferralAuthorizationSubmit: this.new201Request(true),
      fusionPhysicalMedicineReferralAuthorizationSubmit: this.new201Request(
        true
      ),
      fusionHomeHealthReferralAuthorizationSubmit: this.new201Request(true),
      fusionPhysicalMedicineReferralExtensionSubmit: this.new201Request(true),
      fusionAuthorizationCancelSubmit: this.new201Request(true),
      // For Core
      makeReferralAddClaimLocation: this.new201Request(randomIdLikeNumber),
      saveAsDraftTransportationReferral: this.new201Request(randomIdLikeNumber),
      searchAllAuthorizations: this.new200Request(
        SearchNav.searchAllAuthorizationsIMDB
      ),
      searchDraftReferrals: this.new200Request(
        SearchNav.searchDraftReferralsIMDB
      ),
      searchEpaqAuthorizations: this.new200Request(
        SearchNav.searchEpaqAuthorizationsIMDB
      ),
      searchPaperAuthorizations: this.new200Request(
        SearchNav.searchPaperAuthorizationsIMDB
      ),
      searchClinicalAuthorizations: this.new200Request(
        SearchNav.searchClinicalAuthorizationsIMDB
      ),
      searchReferralAuthorizations: this.new200Request(
        SearchNav.searchReferralAuthorizationsIMDB
      ),
      searchMailOrderAuthorizations: this.new200Request(
        SearchNav.MAIL_ORDER_AUTHORIZATION_SEARCH_RESULTS_DATA_IMDB
      )
    };

    return {
      referralOverview: referralActivityIMDB.referralOverview,
      referralCurrentActivity: referralActivityIMDB.referralCurrentActivity,
      referralNotes: referralActivityIMDB.referralNotes,
      claimsSearch: ClaimSearch,
      customerConfigs,
      customerServiceConfiguration,
      riskModalData: RiskModalData,
      riskGraphData: customerRiskVolumeData,
      user: {
        email: 'OTISDALE',
        username: 'OTISDATE@example.com',
        firstName: '',
        lastName: 'Dale',
        customerID: 'TRAVELERS'
      },
      claimSearchOptions: {
        assignedAdjuster: [
          'alice@adjuster.com',
          'peggy@programmanger.com',
          'OTISDALE'
        ],
        riskCategory: ['Patient Safety', 'Medication Selection', 'Financial'],
        riskLevel: [
          '0 - No Risk Identified',
          '1 - Lowest',
          '2 - Low',
          '3 - Medium',
          '4 - High',
          '5 - Highest'
        ],
        stateOfVenue: ['AK', 'AL', 'FL']
      },
      activeAdjusters: [
        { label: 'alice@adjuster.com', value: 'alice@adjuster.com' },
        { label: 'peggy@programmanger.com', value: 'peggy@programmanger.com' },
        { label: 'OTISDALE', value: 'OTISDALE' }
      ],
      v1: v1,
      eligibility,
      icdCodeLookup: IcdCodesData,
      pendingClaimActivity,
      navigationTabs,
      activityTabs,
      allTabColumns,
      pharmacyTabColumns,
      clinicalTabColumns,
      claimActivity: activityResponse,
      eligibilityV3,
      preferences,
      prescriberLookup: prescriberData,
      lomnQRValidation: lomnQRvalidationData,
      pharmacyLookup: pharmacyData,
      icdCodeSearch: ICD_CODE_SEARCH,
      documents,
      billingHistoryData: billingTabData,
      riskLevelOverTime: RiskLevelOverTime,
      incidents: incidentsData,
      drugsLookup: DrugData,
      makeReferralServices: makeReferralData,
      makeReferralOptions: makeReferralOptions,
      referralTransportationTypes: referralTransportationTypes,
      posAuthorizationInformation: authorizationInformation,
      referralAuthorizationItems: imdbReferralAuthorizationsData,
      referralAuthorizationOptions: imdbReferralAuthorizationOptions,
      fusionLanguageReferralAuthorization: [
        { id: '343039353933', ...LAN_AUTHORIZATION_ALL_TYPES }
      ],
      fusionLanguageAuthorizationHistory: [
        { id: '343039353933', ...LANGUAGE_AUTHORIZATION_HISTORY }
      ],
      fusionDiagnosticsAuthorizationHistory: [
        { id: '343039353933', ...DIAGNOSTICS_AUTHORIZATION_HISTORY }
      ],
      fusionDiagnosticsReferralAuthorization: [
        { id: '343039353934', ...DX_AUTHORIZATION_ALL_TYPES }
      ],
      fusionPhysicalMedicineReferralAuthorization: [
        { id: '343039353935', ...PM_AUTHORIZATION_ALL_TYPES }
      ],
      fusionHomeHealthReferralAuthorization: [
        { id: '343039353936', ...HH_AUTHORIZATION_ALL_TYPES }
      ],
      fusionPhysicalMedicineAuthorizationHistory: [
        { id: '343039353935', ...PHYSICAL_MEDICINE_AUTHORIZATION_HISTORY }
      ],
      fusionHomeHealthAuthorizationHistory: [
        { id: '343039353936', ...HOME_HEALTH_AUTHORIZATION_HISTORY }
      ],
      fusionDmeAuthorizationHistory: [
        { id: '343039353937', ...DME_AUTHORIZATION_HISTORY }
      ],
      fusionDmeReferralAuthorization: [
        { id: '343039353937', ...DME_AUTHORIZATION_ALL_TYPES }
      ],
      fusionLegacyTransportationAuthorizationHistory: [
        { id: '32303231373335', ...LEGACY_TRANSPORTATION_HISTORY }
      ],
      diagnosticsDraft: DIAGNOSTICS_DRAFT_927551,
      homeHealthDraft: HOME_HEALTH_DRAFT_927893,
      dmeDraft: DME_DRAFT_927958,
      fusionClinicalHistory: CLINICAL_HISTORY,
      fusionDocumentsFromReferral: AUTHORIZATION_REFERRAL_DOCUMENTS,
      fusionAuthenticationReasonsForCustomer: AUTHENTICATION_REASONS_FOR_CUSTOMER_DATA,
      fusionAuthorizationStatus: true,
      fusionLockAuthorization: true,
      fusionUnlockAuthorization: true,
      rxcard: 'Message Sent Successfully',
      prescriptionHistory,
      clinicalHistory,
      referralLanguages,
      getLocationsForClaim,
      locationTypes,
      createLocationForClaim,
      fusionIcdCodes,
      fusionIcdCodeSearch,
      fusionBodyPartsForClaim,
      fusionVendorAllocations,
      reportsList: reports,
      requestorInformationOptions,
      makeAReferralSearchClaims: MakeAReferralSearch.makeAReferralSearchClaims,
      searchNavReferrals: SearchNav.searchNavReferrals,
      searchNavOptions: SearchNav.searchNavOptions,
      pendingAuthorizationDashboard:
        SearchNav.pendingAuthorizationsDashboardIMDB,
      firstFillReferenceData: ADD_FIRST_FILL_REFERENCE_DATA,
      firstFillsQueueData: FIRST_FILLS_QUEUE_DATA_IMDB,
      cscCreatePosAuthRxHistory: imdbPosAuthRxHistoryRowData,
      cscViewLogData: CSCViewLogData,
      cscRealTimeRejectsQueueData: RealTimeRejectsData,
      cscAuthorizationQueueData: AUTHORIZATION_STATUS_QUEUE_DATA,
      cscListOfPrescribersData: ListOfPrescribersData,
      otherMedicationSearch: OTHER_MEDICATION_SEARCH_RESULTS_DATA,
      firstFillLineItemDetails: FIRST_FILLS_TO_ASSIGN_DATA,
      mobileInvitations: [
        {
          email: 'otis@dale.com',
          ssnSerialNumber: '5235',
          birthDate: '2022-01-10T17:13:45.911Z',
          mobilePhoneNumber: '(242) 242-7474',
          phiMemberId: 'TRV9329523',
          communicationType: 'sms',
          requestDate: '2022-01-12T17:13:45.911Z'
        },
        {
          email: 'otis@dale.com',
          ssnSerialNumber: '5235',
          birthDate: '2022-01-10T17:13:45.911Z',
          mobilePhoneNumber: '(242) 242-7474',
          phiMemberId: 'TRV9329523',
          communicationType: 'sms',
          requestDate: '2022-01-12T17:13:45.911Z'
        },
        {
          email: 'otis@dale.com',
          ssnSerialNumber: '5235',
          birthDate: '2022-01-10T17:13:45.911Z',
          mobilePhoneNumber: '(242) 242-7474',
          phiMemberId: 'TRV9329523',
          communicationType: 'sms',
          requestDate: '2022-01-12T17:13:45.911Z'
        },
        {
          email: 'otis@dale.com',
          ssnSerialNumber: '5235',
          birthDate: '2022-01-10T17:13:45.911Z',
          mobilePhoneNumber: '(242) 242-7474',
          phiMemberId: 'TRV9329523',
          communicationType: 'sms',
          requestDate: '2022-01-12T17:13:45.911Z'
        }
      ]
    };
  }
}
