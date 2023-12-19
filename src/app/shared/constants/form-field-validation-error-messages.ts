export const ERROR_MESSAGES = {
  email: 'A valid email address is required',
  lastNameRequiredIfFirstName:
    'Claimant Name search requires at least 1 character in the last name to search.',
  ssnMustBe5Digits: 'SSN search requires at least 5 digits to search.',
  claimNumberMustBe3Digits:
    'Claim Number search requires at least 3 digits to search.',
  someSearchFieldsRequired: 'Valid search criteria must be entered.',
  duplicateAddClaimLocation: 'The location already exists.',
  otherAddClaimLocation: 'Failed to add a new location, please try again.',
  appointment_allOrNothing:
    'Either All appointment fields or No appointment fields must be filled out.',
  externalPosSearch_requirements:
    'You must pick an Assigned Adjuster or enter a Claim Number or Member Id AND a date range no greater than 1 year.',
  internalPosSearch_requirements:
    'When searching a Date Range greater than a month, you must enter one of the following values: Member ID, Original Member ID or Claim Number'
};
