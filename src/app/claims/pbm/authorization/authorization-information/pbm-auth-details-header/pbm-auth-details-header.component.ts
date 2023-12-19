import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

import { IPE_25_LINK } from '../../pbm-authorization-shared';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import {
  SendEmailModalService
} from '../../send-email-modal/send-email-modal.service';

interface ClaimLevelInterventionOption {
  optionText: string;
  url: string;
}

@Component({
  selector: 'healthe-auth-details-header',
  templateUrl: './pbm-auth-details-header.component.html',
  styleUrls: ['./pbm-auth-details-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PbmAuthDetailsHeaderComponent implements OnInit {
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  @Input()
  componentConfig: HealtheComponentConfig;

  @Output() reassignClaim: EventEmitter<any> = new EventEmitter();
  screenData = {
    claimLevelInterventionOptions: [
      {
        optionText: 'IPE',
        url: IPE_25_LINK
      },
      {
        optionText: 'Another Option',
        url: '/AnotherOption/customer.jsp?#IPE;key="123456789";cust="TRAVELERS"'
      }
    ]
  };

  constructor(public sendEmailModalService: SendEmailModalService) {}

  ngOnInit() {}

  doClaimLevelIntervention(option: ClaimLevelInterventionOption) {
    window.open(option.url, '_blank');
  }

  sendEmail() {
    this.sendEmailModalService.showModal({
      from: 'somebody@somewhere.com',
      to: '',
      body: 'A sample of some email body text the user can edit.',
      subject: 'Please review authorization for this claimant'
    });
  }

  onReassignClaim(): void {
    this.reassignClaim.emit();
  }
}
