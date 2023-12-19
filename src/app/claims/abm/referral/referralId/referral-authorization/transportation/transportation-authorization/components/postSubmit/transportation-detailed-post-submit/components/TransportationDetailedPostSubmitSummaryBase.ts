import {
  AuthApprovalState
} from '../../../../../../referral-authorization.models';

// This a test comment to see if my repo us busted
export class TransportationDetailedPostSubmitSummaryBase {
  constructor() {}

  protected fixAuthDataForDenail(authData: any): any {
    const approvalType = authData['AuthAction_ApprovalType'];
    if (approvalType === AuthApprovalState.Deny) {
      authData = { ...authData, ...authData.authData };
    }

    return authData;
  }
}
