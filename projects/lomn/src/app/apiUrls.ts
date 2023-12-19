import { API_SERVER } from '../environments/environment';

export const apiUrls = {
  eligibilityV3: API_SERVER + '/eligibility/v3',
  rxAuthorizationInformation: API_SERVER + '/v1/pbm/authorization',
  rxAuthorizationInformationUnlock: API_SERVER + '/v1/pbm/authorization/unlock',
  paperAuthorizationInformation: API_SERVER + '/v1/pbm/paper/authorization',
  fusionLockAuthorization:
    API_SERVER + '/v1/fusion/referral/authorization/lock',
  fusionUnlockAuthorization:
    API_SERVER + '/v1/fusion/referral/authorization/unlock',
  createLOMN: API_SERVER + '/v1/pbm/lomn/create',
  previewLomn: API_SERVER + '/v1/pbm/lomn/preview',
  lomnQRValidation: API_SERVER + '/v1/pbm/lomn/lomnQRValidation',
  resolveUnrecognizedLomn: API_SERVER + '/v1/pbm/lomn/resolveUnrecognizedLomn',
  exparteCopiesRequired: API_SERVER + '/v1/pbm/lomn/exparteCopiesRequired',
  letterTypes: API_SERVER + '/v1/pbm/lomn/letterTypes',
  prescriberLookup: API_SERVER + '/prescriberLookup',
  lomnPaperAuthorizationData: API_SERVER + '/v1/pbm/lomn'
};
