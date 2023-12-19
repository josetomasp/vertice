import { hexEncode } from '@shared/lib';
import { getArchTypeFromAncilliaryServiceCode } from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';

export function generate3_0ABMReferralAuthorizationTabUrl(
  decodeCustomerId: string,
  decodeClaimNumber: string,
  decodeReferralId: string,
  serviceCode: string,
  legacy: boolean
) {
  return `${generate3_0BaseUrl(
    decodeCustomerId,
    decodeClaimNumber,
    'referral',
    decodeReferralId
  )}/${getArchTypeFromAncilliaryServiceCode(
    serviceCode,
    legacy
  )}/authorization`;
}

export function generate3_0ABMReferralActivityTabUrl(
  decodeCustomerId: string,
  decodeClaimNumber: string,
  decodeReferralId: string,
  serviceCode: string,
  legacy: boolean
) {
  return `${generate3_0BaseUrl(
    decodeCustomerId,
    decodeClaimNumber,
    'referral',
    decodeReferralId + ''
  )}/${getArchTypeFromAncilliaryServiceCode(
    serviceCode,
    legacy
  )}/activity/grid`;
}

export function generateExternal3_0PBMAuthorizationTabUrl(
  decodeCustomerId: string,
  decodeClaimNumber: string,
  decodeAuthorizationId: string,
  serviceType: string
) {
  return `${generate3_0BaseUrl(
    decodeCustomerId,
    decodeClaimNumber,
    'pbm',
    decodeAuthorizationId
  )}/${serviceType}/authorizationInformation`;
}

export function generateMakeAReferralServiceSelectionUrl(
  decodedCustomerId: string,
  decodedClaimNumber: string
): string {
  return `/claims/${hexEncode(decodedCustomerId)}/${hexEncode(decodedClaimNumber)}/referral/serviceSelection`;
}

function generate3_0BaseUrl(
  decodeCustomerId: string,
  decodeClaimNumber: string,
  service: string,
  decodeReferenceId: string
): string {
  return `claims/${hexEncode(decodeCustomerId)}/${hexEncode(
    decodeClaimNumber
  )}/${service}/${hexEncode(decodeReferenceId)}`;
}
