import {
  AuthNarrativeConfig,
  NarrativeTextItem
} from '../../referral-authorization.models';

export function setNarrativeMinimumQuantity(
  narrativeTextList: NarrativeTextItem[],
  authNarrativeConfig: AuthNarrativeConfig
) {
  // If there are completed trips, use that to calculate the minimum instead of the default 1
  let quantityUsedNarrative = narrativeTextList.find(
    (narrative) => narrative.type === 'QUANTITY_USED'
  );
  let quantityChangeNarrative = narrativeTextList.find(
    (narrative) =>
      narrative.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE' ||
      narrative.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE'
  );
  if (
    quantityUsedNarrative !== undefined &&
    quantityChangeNarrative !== undefined
  ) {
    authNarrativeConfig.quantity.min =
      quantityUsedNarrative.limitValue - quantityChangeNarrative.originalLimit;
  }
}
