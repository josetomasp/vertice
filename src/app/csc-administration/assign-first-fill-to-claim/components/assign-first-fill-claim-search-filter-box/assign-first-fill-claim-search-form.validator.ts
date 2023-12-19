import { AbstractControl, ValidationErrors } from '@angular/forms';

// Require at least one non-whitespace character in (claimNumber) OR (claimantFirstName AND claimantLastName) OR (claimantSSN)
export function firstFillClaimSearchValidator(
  claimSearchForm: AbstractControl
): ValidationErrors | null {
  if (
    claimSearchForm.get('claimNumber').value.trim().length < 1 &&
    (claimSearchForm.get('claimantFirstName').value.trim().length < 1 ||
      claimSearchForm.get('claimantLastName').value.trim().length < 1) &&
    claimSearchForm.get('claimantSsn').value.trim().length < 1
  ) {
    return {
      needsSsnNameOrClaimNumber: true
    };
  } else {
    return null;
  }
}
