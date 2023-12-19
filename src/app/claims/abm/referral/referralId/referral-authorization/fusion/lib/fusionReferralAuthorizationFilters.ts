import { FusionAuthorization } from '../../../../store/models/fusion/fusion-authorizations.models';

const APPROVED_STATUS_REASON_DESCRIPTION = 'Authorization Approved';
const CANCELLED_STATUS_REASON_DESCRIPTION = 'Cancelled';
const BILLED_STATUS_REASON_DESCRIPTION = 'Billed';
const DENIED_STATUS_REASON_DESCRIPTION = 'Denied';

const AUTHORIZATION_REQUIRED_REASON_DESCRIPTION = 'Awaiting Authorization';
const AUTHORIZATION_REQUIRED_REASON_DESCRIPTION_ALT = 'Authorization Required';
const AUTHORIZATION_PEND_REASON_DESCRIPTION = 'Pend - Med-Nes/Ur/Pre-Auth';
const AUTHORIZATION_PEND_COMP_REASON_DESCRIPTION =
  'PEND-COMPENSABILITY DECISION';
const AUTHORIZATION_PEND_UTIL_REASON_DESCRIPTION = 'Pend-Utilization Review';

const ON_SITE_TRANSLATION_CAT_DESC = 'On-site Translation';
const TRANSLATION_TRAVEL_CAT_DESC = 'Translation Travel';

const NEW_OPEN_AUTH_CHANGE_TYPE = 'NEW_OPEN_AUTHORIZATION';

const ACTIONABLE_STATUSES = [
  AUTHORIZATION_REQUIRED_REASON_DESCRIPTION,
  AUTHORIZATION_PEND_REASON_DESCRIPTION,
  AUTHORIZATION_PEND_COMP_REASON_DESCRIPTION,
  AUTHORIZATION_PEND_UTIL_REASON_DESCRIPTION,
  AUTHORIZATION_REQUIRED_REASON_DESCRIPTION_ALT
];
const UN_ACTIONABLE_STATUSES = [
  APPROVED_STATUS_REASON_DESCRIPTION,
  CANCELLED_STATUS_REASON_DESCRIPTION,
  BILLED_STATUS_REASON_DESCRIPTION,
  DENIED_STATUS_REASON_DESCRIPTION
];

export function getActionableAuthorizations(
  authorizations: FusionAuthorization[]
): FusionAuthorization[] {
  return getUnapprovedAuthorizations(translationTravelFilter(authorizations));
}

/**
 * TODO: We might have to filter out Translation Travel eventually.
 * Use this filter AFTER you remove approved because there is logic that might show Translation Travel if it's the only unapproved auth
 * @param authorizations
 */
export function translationTravelFilter(
  authorizations: FusionAuthorization[]
): FusionAuthorization[] {
  const hasTranslationTravel =
    authorizations.findIndex(
      ({ authorizationUnderReview: { categoryDesc } }) =>
        categoryDesc === TRANSLATION_TRAVEL_CAT_DESC
    ) > -1;
  const allAuthsAreNewOpen = authorizations
    .map((auth) => {
      const isNewOpenAuth = auth.authorizationChangeSummary.findIndex(
        (cs) => cs.changeType === NEW_OPEN_AUTH_CHANGE_TYPE
      );
      return isNewOpenAuth > -1;
    })
    .every((res) => res);
  if (!hasTranslationTravel || allAuthsAreNewOpen) {
    return authorizations;
  }

  const hasUnauthedOnsiteSibling =
    getUnapprovedAuthorizations(authorizations).findIndex(
      ({ authorizationUnderReview: { categoryDesc } }) =>
        categoryDesc === ON_SITE_TRANSLATION_CAT_DESC
    ) > -1;

  return authorizations.filter(
    ({ authorizationUnderReview: { categoryDesc } }) => {
      return (
        categoryDesc !== TRANSLATION_TRAVEL_CAT_DESC ||
        (categoryDesc === TRANSLATION_TRAVEL_CAT_DESC &&
          !hasUnauthedOnsiteSibling)
      );
    }
  );
}

// VF-4003 Jack O'Leary wants to only show Actionable authorizations from a specific list
export function getUnapprovedAuthorizations(
  authorizations: FusionAuthorization[]
): FusionAuthorization[] {
  return authorizations.filter((authorization) => {
    const status = authorization.authorizationUnderReview
      .substitutionAuthorizationUnderReview
      ? authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.status
      : authorization.customerStatusReasonDesc;
    return ACTIONABLE_STATUSES.indexOf(status) > -1;
  });
}

export function getUnActionableAuthorizations(
  authorizations: FusionAuthorization[]
): FusionAuthorization[] {
  return authorizations.filter((authorization) => {
    const status = authorization.authorizationUnderReview
      .substitutionAuthorizationUnderReview
      ? authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.status
      : authorization.customerStatusReasonDesc;
    return UN_ACTIONABLE_STATUSES.indexOf(status) > -1;
  });
}
