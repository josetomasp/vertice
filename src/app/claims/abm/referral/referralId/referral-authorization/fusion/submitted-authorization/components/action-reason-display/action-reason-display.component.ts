import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { faBan, faCheck } from '@fortawesome/pro-light-svg-icons';
import { faClock } from '@fortawesome/pro-light-svg-icons/faClock';
import {
  FeatureFlagService
} from '../../../../../../../../../customer-configs/feature-flag.service';
import { AuthApprovalState } from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-action-reason-display',
  templateUrl: './action-reason-display.component.html',
  styleUrls: ['./action-reason-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionReasonDisplayComponent implements OnInit {
  @Input()
  approvalType;

  AuthApprovalState = AuthApprovalState;
  statusIcon: any;
  approvalTypeName: any;
  @Input()
  reason: string;
  approveIcon = faCheck;
  denyIcon = faBan;
  pendIcon = faClock;
  constructor(public featureFlagService: FeatureFlagService) {}

  ngOnInit() {}

  getActionName() {
    if (this.approvalType) {
      switch (this.approvalType.toLowerCase()) {
        case 'approve':
          return 'Approved';
        case 'deny':
          return this.featureFlagService.labelChange('Denied', 'denial');
        case 'pend':
          return 'Pended';
      }
    }
  }
}
