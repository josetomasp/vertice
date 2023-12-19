import { LOMNWizardState } from './create-lomn.models';

export const LOMN_INITIAL_STATE: LOMNWizardState = {
  exparteWarningMessage: null,
  exparteCopiesRequired: null,
  letterTypes: {},
  wizardFormState: {
    medicationList: [],
    attorneyAndClaimantInformation: {
      attorneyInvolvement: false,
      claimantInformation: {
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        primaryFax: ''
      }
    }
  },
  submittingCreateLOMN: false,
  wizardResponse: {
    errors: [],
    successful: false
  }
};
