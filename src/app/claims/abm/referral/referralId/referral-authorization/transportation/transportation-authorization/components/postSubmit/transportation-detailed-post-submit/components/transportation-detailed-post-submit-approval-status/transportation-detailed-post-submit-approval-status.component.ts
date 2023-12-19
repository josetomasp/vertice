import { Component, Input, OnInit } from '@angular/core';
import {
  AuthApprovalState
} from '../../../../../../../referral-authorization.models';
import {
  faBan,
  faCheck,
  faClock,
  IconDefinition
} from '@fortawesome/pro-light-svg-icons';
import {
  FeatureFlagService
} from '../../../../../../../../../../../../customer-configs/feature-flag.service';

@Component({
  selector: 'healthe-transportation-detailed-post-submit-approval-status',
  templateUrl:
    './transportation-detailed-post-submit-approval-status.component.html',
  styleUrls: [
    './transportation-detailed-post-submit-approval-status.component.scss'
  ]
})
export class TransportationDetailedPostSubmitApprovalStatusComponent
  implements OnInit {
  @Input()
  authItem: any;

  AuthApprovalState = AuthApprovalState;
  statusIcon: IconDefinition;
  approvalType: AuthApprovalState;
  approvalTypeName: string;
  approvalReason: string;

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    this.setApprovalStatus();
  }

  private setApprovalStatus() {
    const approvalType = this.authItem['AuthAction_ApprovalType'];

    this.approvalReason = this.authItem['AuthAction_ApprovalReason'];
    switch (approvalType) {
      case AuthApprovalState.Approve:
        this.approvalType = AuthApprovalState.Approve;
        this.approvalTypeName = 'Approved';
        this.statusIcon = faCheck;
        break;
      case AuthApprovalState.Deny:
        this.approvalType = AuthApprovalState.Deny;
        this.approvalTypeName = this.featureFlagService.labelChange(
          'Denied',
          'denied'
        );
        this.statusIcon = faBan;
        break;
      case AuthApprovalState.Pending:
        this.approvalType = AuthApprovalState.Pending;
        this.approvalTypeName = 'Pend';
        this.statusIcon = faClock;
        break;
    }
  }
}
