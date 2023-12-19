import { Component, Input, OnInit } from '@angular/core';
import { ClaimStatusEnum } from '@healthe/vertice-library';

@Component({
  selector: 'healthe-status-tag',
  templateUrl: './claim-status-tag.component.html',
  styleUrls: ['./claim-status-tag.component.scss']
})
export class ClaimStatusTagComponent implements OnInit {
  @Input()
  claimStatus: string;
  @Input()
  statusType: 'abm' | 'pbm';

  ngOnInit() {}

  getTagColor(claimStatus: any) {
    let status = '';
    switch (claimStatus) {
      case ClaimStatusEnum.ACTIVE:
        status = 'success';
        break;
      case ClaimStatusEnum.INACTIVE:
        status = 'warning';
        break;
      case ClaimStatusEnum.TERMINATED:
      case ClaimStatusEnum.BLOCKED:
        status = 'danger';
        break;
    }
    return status;
  }

  getStatusTypeVerbiage() {
    switch (this.statusType) {
      case 'abm':
        return 'ANCILLARY';
      case 'pbm':
        return 'PHARMACY';
      default:
        return '';
    }
  }
}
