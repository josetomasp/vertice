import { FormGroup } from '@angular/forms';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { searchPhonesAndEmailInCommunicationList } from './searchPhonesAndEmailInCommunicationList';

export function addClaimantValuesToFormGroup(
  claimInfo: ClaimV3,
  claimantFormGroup: FormGroup
): void {
  let claimant = claimInfo.claimant;
  claimantFormGroup.get('addressLine1').setValue(claimant.address.address1);
  claimantFormGroup.get('addressLine2').setValue(claimant.address.address2);
  claimantFormGroup.get('city').setValue(claimant.address.city);
  claimantFormGroup.get('state').setValue(claimant.address.state);
  claimantFormGroup.get('zipCode').setValue(claimant.address.zip);
  claimantFormGroup
    .get('phone')
    .setValue(
      searchPhonesAndEmailInCommunicationList(claimant.communications).phone
    );
}
