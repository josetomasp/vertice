import { API_SERVER } from '../environments/environment';

export const apiUrls = {
  customerServiceConfiguration:
    API_SERVER + '/v1/referral/customerServiceConfiguration',
  billingHistoryData: API_SERVER + '/v1/billHistory',
  claimActivity: API_SERVER + '/v3/claimActivity',
  claimActivityExport: API_SERVER + '/claimActivityDownloadExcelPDF',
  claimSearchOptions: API_SERVER + '/v1/claimSearch/claimSearchOptions',
  claimsSearch: API_SERVER + '/v1/claimSearch/search',
  claimsSearchExport: API_SERVER + '/claimSearchDownloadExcelPDF',
  customerConfigs: API_SERVER + '/config/customer',
  documents: API_SERVER + '/v1/documents',
  documentsDownload: API_SERVER + '/v1/documents/download',
  eligibilityV3: API_SERVER + '/eligibility/v3',
  pendingClaimActivity: API_SERVER + '/v1/pendingClaimActivity',
  generalExporter: API_SERVER + '/generalExporter/export',
  powerBiToken:
    API_SERVER +
    '/power-bi/groups/${groupId}/${powerBiType}/${reportId}/generate-token',
  powerBiMetricUpdate:
    API_SERVER +
    '/power-bi/metrics/${embeddedTokenId}/${action}',
  preferences: API_SERVER + '/preferences/user',
  preferencesSave: API_SERVER + '/preferences/save',
  preferencesDelete: API_SERVER + '/preferences/delete',
  preferencesDeleteAll: API_SERVER + '/preferences/deleteAll',
  riskGraphData: API_SERVER + '/customerRiskVolume',
  snoozeRiskActions: API_SERVER + '/snoozeRiskActions',
  trendingRiskModalData: API_SERVER + '/v1/riskModalData',
  icdCodeLookup: API_SERVER + '/v1/icdCodeLookup',
  user: API_SERVER + '/v1/user/info',
  incidents: API_SERVER + '/v1/incidents',
  referralOverview: API_SERVER + '/v1/referral/overview',
  referralRequestForInformation:
    API_SERVER + '/v1/referralRequestForInformation',
  referralUploadDocument: API_SERVER + '/v1/referral/documentUpload',
  referralCurrentActivity: API_SERVER + '/v1/referral/currentActivity',
  referralCurrentActivityExport:
    API_SERVER + '/v1/referral/currentActivity/tableViewDownloadExcelPDF',
  referralNotes: API_SERVER + '/v1/referral/notes',
  referralSaveICDCodes: API_SERVER + '/v1/referral',
  referralManualAuthorizationItems:
    API_SERVER + '/v1/referral/manualAuthorizations',
  referralCurrentAuthorizationItems:
    API_SERVER + '/v1/referral/currentAuthorizations',
  referralAuthorizationActions:
    API_SERVER + '/v1/referral/authorizationActions',
  abmReferralCancelAuthorizations:
    API_SERVER + '/v1/referral/cancelAuthorizations',
  referralAuthorizationOptions: API_SERVER + '/referralAuthorizationOptions',
  icdCodeSearch: API_SERVER + '/v1/icdCodeSearch',
  drugsLookup: API_SERVER + '/drugsLookup',
  otherMedicationSearch: API_SERVER + '/otherMedicationSearch',
  makeReferralServices: API_SERVER + '/v1/referral/makeReferralServices',
  makeReferralOptions: API_SERVER + '/v1/referral/makeReferralOptions',
  makeReferralAddClaimLocation: API_SERVER + '/v1/referral/addClaimLocation',
  referralTransportationTypes:
    API_SERVER + '/v1/referral/referralTransportationTypes',
  prescriberLookup: API_SERVER + '/prescriberLookup',
  pharmacyLookup: API_SERVER + '/pharmacyLookup',
  rxAuthorizationInformation: API_SERVER + '/v1/pbm/authorization',
  rtrRxAuthorizationInformation: API_SERVER + '/v1/pbm/rtrAuthorization',
  rxAuthorizationSaveLineItemNote: API_SERVER + '/v1/pbm/authorization/comment',
  rxAuthorizationInformationUnlock: API_SERVER + '/v1/pbm/authorization/unlock',
  pbmAuthorizationSave: API_SERVER + '/v1/pbm/authorization/save',
  rxSubmitPriorAuthLoad:
    API_SERVER + '/v1/pbm/authorization/submitRxPriorAuthLoad',
  rxLoadSamaritanDose: API_SERVER + '/v1/pbm/authorization/rxLoadSamaritanDose',
  rxLoadByPassPriorAuth:
    API_SERVER + '/v1/pbm/authorization/rxLoadByPassPriorAuth',
  rxcard: API_SERVER + '/rxcard',
  prescriptionHistory: API_SERVER + '/prescriptionHistory',
  prescriptionHistoryExport: API_SERVER + '/prescriptionHistoryExport',
  clinicalHistory: API_SERVER + '/clinicalHistory',
  clinicalHistoryExport: API_SERVER + '/clinicalHistoryExport',
  referralLanguages: API_SERVER + '/v1/referral/referralLanguages',
  fusionIcdCodes: API_SERVER + '/v1/referral/fusionIcdCodes',
  fusionIcdCodeSearch: API_SERVER + '/v1/referral/fusionIcdCodeSearch',
  fusionVendorAllocations: API_SERVER + '/v1/referral/fusionVendorAllocations',
  fusionBodyPartsForClaim: API_SERVER + '/v1/referral/fusionBodyPartsForClaim',
  getLocationsForClaim: API_SERVER + '/v1/referral/getLocationsForClaim',
  locationTypes: API_SERVER + '/v1/referral/locationTypes',
  createLocationForClaim: API_SERVER + '/v1/referral/createLocationForClaim',
  fusionReferralSubmit: API_SERVER + '/v1/referral/make-a-referral',
  fusionUploadFileToReferral: API_SERVER + '/v1/referral/upload-file',
  saveAsDraftTransportationReferral: API_SERVER + '/v1/referral/save-as-draft',
  uploadFileToReferral: API_SERVER + '/referral/attachments/uploadToReferrals',
  reportsList: API_SERVER + '/reports/getByUser',
  requestorInformationOptions: API_SERVER + '/v1/referral/requestor-options',
  fusionLanguageReferralAuthorization:
    API_SERVER + '/v1/fusion/referral/language/authorization',
  fusionLanguageReferrals:
    API_SERVER + '/v1/fusion/referral/language/referrals',
  fusionLanguageAuthorizationHistory:
    API_SERVER + '/v1/referral/language-history',
  fusionDiagnosticsAuthorizationHistory:
    API_SERVER + '/v1/referral/diagnostics-history',
  fusionDocumentsFromReferral: API_SERVER + '/fusion/referral/attachments',
  fusionDownloadDocumentsFromReferral:
    API_SERVER + '/fusion/referral/attachments/download',
  fusionAuthenticationReasonsForCustomer:
    API_SERVER + '/v1/fusion/referral/authorization/reasons',
  makeAReferralSearchClaims: API_SERVER + '/v1/makeReferralSearch/claims',
  openTransportationAuthorization:
    API_SERVER + '/v1/referral/openTransportationAuthorization',
  openTransportationAuthorizationModification:
    API_SERVER + '/v1/referral/openTransportationAuthorizationModification',
  detailedTransportationAuthorization:
    API_SERVER + '/v1/referral/detailedTransportationAuthorization',
  searchNavReferrals: API_SERVER + '/v1/searchNav/referrals',
  searchNavOptions: API_SERVER + '/v1/searchNav/searchOptions',
  searchDraftReferrals: API_SERVER + '/v1/searchNav/draftReferralsSearch',
  pendingAuthorizationDashboard:
    API_SERVER + '/v1/searchNav/allAuthorizationsDashboard',
  searchEpaqAuthorizations:
    API_SERVER + '/v1/searchNav/epaqAuthorizationsSearch',
  referralDocumentDetails:
    API_SERVER + '/v1/referral/document-details/documents',
  downloadInlineDoc: API_SERVER + '/referral/attachments/download',
  searchPaperAuthorizations:
    API_SERVER + '/v1/searchNav/paperAuthorizationsSearch',
  searchClinicalAuthorizations:
    API_SERVER + '/v1/searchNav/clinicalAuthorizationsSearch',
  searchReferralAuthorizations:
    API_SERVER + '/v1/searchNav/referralAuthorizationsSearch',
  searchMailOrderAuthorizations:
    API_SERVER + '/v1/searchNav/mailOrdersAuthorizationsSearch',
  searchClaimResolutionAuthorizations:
    API_SERVER + '/v1/searchNav/claimResolutionAuthorizationsSearch',
  fusionDiagnosticsReferralAuthorization:
    API_SERVER + '/v1/fusion/referral/diagnostics/authorization',
  fusionPhysicalMedicineReferralAuthorization:
    API_SERVER + '/v1/fusion/referral/physical-medicine/authorization',
  fusionHomeHealthReferralAuthorization:
    API_SERVER + '/v1/fusion/referral/home-health/authorization',
  fusionPhysicalMedicineAuthorizationHistory:
    API_SERVER + '/v1/referral/physical-medicine-history',
  fusionHomeHealthAuthorizationHistory:
    API_SERVER + '/v1/referral/home-health-history',
  fusionLanguageReferralAuthorizationSubmit:
    API_SERVER + '/v1/fusion/referral/language/authorization/submit',
  fusionDmeAuthorizationHistory: API_SERVER + '/v1/referral/dme-history',
  fusionDiagnosticsReferralAuthorizationSubmit:
    API_SERVER + '/v1/fusion/referral/diagnostics/authorization/submit',
  fusionPhysicalMedicineReferralAuthorizationSubmit:
    API_SERVER + '/v1/fusion/referral/physical-medicine/authorization/submit',
  fusionPhysicalMedicineReferralExtensionSubmit:
    API_SERVER + '/v1/fusion/referral/physical-medicine/extension/submit',
  fusionAuthorizationCancelSubmit:
    API_SERVER + '/v1/fusion/referral/cancel-authorization',
  fusionHomeHealthReferralAuthorizationSubmit:
    API_SERVER + '/v1/fusion/referral/home-health/authorization/submit',
  fusionDmeReferralAuthorization:
    API_SERVER + '/v1/fusion/referral/dme/authorization',
  fusionDMEReferralAuthorizationSubmit:
    API_SERVER + '/v1/fusion/referral/dme/authorization/submit',
  fusionClinicalHistory:
    API_SERVER + '/v1/fusion/referral/physical-medicine/clinicalHistory',
  fusionClinicalHistoryExport:
    API_SERVER + '/v1/fusion/referral/physical-medicine/clinicalHistoryExport',
  languageDraft: API_SERVER + '/v1/referral/language-draft',
  physicalMedicineDraft: API_SERVER + '/v1/referral/physical-medicine-draft',
  trpDraft: API_SERVER + '/v1/referral/drafts/load',
  fusionLockAuthorization:
    API_SERVER + '/v1/fusion/referral/authorization/lock',
  fusionUnlockAuthorization:
    API_SERVER + '/v1/fusion/referral/authorization/unlock',
  diagnosticsDraft: API_SERVER + '/v1/referral/diagnostics-draft',
  fusionLegacyTransportationAuthorizationHistory:
    API_SERVER + '/v1/referral/legacy-transportation-history',
  homeHealthDraft: API_SERVER + '/v1/referral/home-health-draft',
  dmeDraft: API_SERVER + '/v1/referral/dme-draft',
  createLOMN: API_SERVER + '/v1/pbm/lomn/create',
  previewLomn: API_SERVER + '/v1/pbm/lomn/preview',
  lomnQRValidation: API_SERVER + '/v1/pbm/lomn/lomnQRValidation',
  resolveUnrecognizedLomn: API_SERVER + '/v1/pbm/lomn/resolveUnrecognizedLomn',
  firstFillsQueueData: API_SERVER + '/v1/cscAdministration/firstFills',
  firstFillsTempMemberId:
    API_SERVER + '/v1/cscAdministration/firstFillsGetTempMemberId',
  saveFirstFill: API_SERVER + '/v1/cscAdministration/saveFirstFill',
  addFirstFillReferenceData:
    API_SERVER + '/v1/cscAdministration/addFirstFillReferenceData',
  firstFillLineItemDetails:
    API_SERVER + '/v1/cscAdministration/firstFillsToAssign',
  firstFillSaveWebUserNotes:
    API_SERVER + '/v1/cscAdministration/saveNotesForFirstFills',
  firstFillMoveToNextQueue:
    API_SERVER + '/v1/cscAdministration/moveToNextFirstFill',
  firstFillAssignToNewClaim: API_SERVER + '/v1/cscAdministration/assign',
  firstFillSaveWebUserNotesAndMoveToNextQueue:
    API_SERVER + '/v1/cscAdministration/saveNotesAndMoveToNextFirstFill',
  firstFillClaimSearch:
    API_SERVER + '/v1/cscAdministration/firstFillsClaimSearch',
  cscCreatePosAuthRxHistory: API_SERVER + '/v1/cscAdministration/rxHistory',
  cscCreatePosAuthorization:
    API_SERVER + '/v1/cscAdministration/createPosAuthorization',
  cscAddLineItemsToRxAuthorization:
    API_SERVER + '/v1/cscAdministration/addLineItemsToRxAuthorization',
  getRejectCodeOptions: API_SERVER + '/v1/cscAdministration/rejectCodeOptions',
  cscMemberIdLookup: API_SERVER + '/v1/cscAdministration/memberIDLookup',
  cscRealTimeRejectsQueueData:
    API_SERVER + '/v1/cscAdministration/realTimeRejectsQueueData',
  cscViewLogData: API_SERVER + '/v1/cscAdministration/viewLogData',
  rxAuthorizationSaveInternalNote:
    API_SERVER + '/v1/pbm/authorization/postInternalNote',
  savePaperAuthNote: API_SERVER + '/v1/pbm/authorization/savePaperAuthNote',
  cscViewLogDataExport: API_SERVER + '/v1/cscAdministration/exportLogData',
  exparteCopiesRequired: API_SERVER + '/v1/pbm/lomn/exparteCopiesRequired',
  letterTypes: API_SERVER + '/v1/pbm/lomn/letterTypes',
  cscAuthorizationQueueData:
    API_SERVER + '/v1/cscAdministration/authStatusQueue',
  rxAuthorizationSubmit: API_SERVER + '/v1/pbm/authorization/submit',
  rxAuthorizationSearchClaimForReassignment:
    API_SERVER + '/v1/pbm/authorization/searchClaimsForReassignment',
  rxAuthorizationClaimReassignment:
    API_SERVER + '/v1/pbm/authorization/reassignToMemberKey',
  cscListOfPrescribersData:
    API_SERVER + '/prescriberLookup/getPrescribersForNames',
  adjusterListByCustomerAndStatus:
    API_SERVER + '/v1/searchNav/adjusters-by-status-and-customer',
  searchPosAuthorizations:
    API_SERVER + '/v1/cscAdministration/posAuthorizationSearch',
  posAuthorizationStatusQueueOptions:
    API_SERVER + '/v1/cscAdministration/posAuthorizationStatusQueueOptions',
  activeAdjusters: API_SERVER + '/v1/searchNav/activeAdjusters',
  paperAuthorizationInformation: API_SERVER + '/v1/pbm/paper/authorization',
  paperSaveAuthorizationInformation:
    API_SERVER + '/v1/pbm/paper/authorization/save',
  paperSubmitAuthorizationInformation:
    API_SERVER + '/v1/pbm/paper/authorization/submit',
    preparePaperAuthorization:
    API_SERVER + '/v1/pbm/paper/authorization/prepare',
  paperAuthorizationClaimReassignment:
    API_SERVER + '/v1/pbm/paper/authorization/claimReassign',
  paperAuthorizationUnlock: API_SERVER + '/v1/pbm/paper/authorization/unlock',
  cscGetAwaitingDecisionAuthSummariesByPhiMemberId:
    API_SERVER +
    '/v1/cscAdministration/getAwaitingDecisionAuthSummariesByPhiMemberId',
  kinectReferralAPI: API_SERVER + '/kinect/referrals',
  mobileInvites: API_SERVER + '/v1/claimantPortal/mobileInvite',
  customerMobileProgramEnabled: API_SERVER + '/v1/claimantPortal/mobile-program-enabled',
  mobileInvitationHistory: API_SERVER + '/v1/claimantPortal/mobileInvitationHistory',
  getMobileInviteHelpPdf: API_SERVER + '/v1/claimantPortal/getMobileInviteHelpPdf',
  getFusionAbmReferralManagementAuthorizationsDashboardAuthorizationTypes: API_SERVER + '/fusion-abm-referral-management/api/v1/authorizations/dashboard/authorization-types',
  getFusionAbmReferralManagementAllAuthorizationsAdjusters: API_SERVER + '/fusion-abm-referral-management/api/v1/all-authorizations/adjusters',
  postFusionAbmReferralManagementAllAuthorizationsSearch: API_SERVER + '/fusion-abm-referral-management/api/v2/all-authorizations/search'
};
