import { FormGroup } from '@angular/forms';
import { searchPhonesAndEmailInCommunicationList } from './searchPhonesAndEmailInCommunicationList';
import { ClaimV3 } from '../store/models/claim.models';

export function addClaimantValuesToFormGroup(
  claimInfo: ClaimV3,
  claimantFormGroup: FormGroup
): void {
  let {
    address: { address1, address2, city, state, zip },
    communications
  } = claimInfo.claimant;
  claimantFormGroup.patchValue({
    addressLine1: address1,
    addressLine2: address2,
    city: city,
    state: state,
    zipCode: zip,
    phone: searchPhonesAndEmailInCommunicationList(communications).phone
  });
}
