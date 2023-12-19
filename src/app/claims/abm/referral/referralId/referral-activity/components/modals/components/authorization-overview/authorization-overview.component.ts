import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralStage,
  TransportationModalType
} from 'src/app/claims/abm/referral/store/models/referral-activity.models';

@Component({
  selector: 'healthe-authorization-overview',
  templateUrl: './authorization-overview.component.html',
  styleUrls: ['./authorization-overview.component.scss']
})
export class AuthorizationOverviewComponent implements OnInit {
  TransportationModalType = TransportationModalType;
  @Input() stage: ReferralStage;
  @Input() modalType: TransportationModalType;
  @Input() overviewData;
  fieldsMap: Map<string, string> = new Map<string, string>([]);

  constructor() {}

  ngOnInit() {
    this.fieldsMap = this.getOverviewFields();
  }

  getOverviewFields(): Map<string, string> {
    let fields = new Map<string, string>([]);
    // Setting fields that are shared for all stages and modalTypes
    fields.set('REFERRAL ID', this.overviewData['referralId']);
    fields.set('DATE OF SERVICE', this.overviewData['dateOfService']);
    fields.set('STATUS', this.overviewData['status']);
    fields.set('VENDOR', this.overviewData['vendor']);

    switch (this.stage) {
      case ReferralStage.SERVICE_SCHEDULED:
        fields.set('# OF TRAVELERS', this.overviewData['numberOfTravelers']);

        if (this.modalType === TransportationModalType.GROUND_SERVICE) {
          fields.set('TOTAL MILEAGE', this.overviewData['totalMileage']);
        }

        if (this.modalType === TransportationModalType.LODGING_SERVICE) {
          fields.set('NIGHTS', this.overviewData['nights']);
        }
        break;
      case ReferralStage.RESULTS:
        fields.set('# OF TRAVELERS', this.overviewData['numberOfTravelers']);
        fields.set('TOTAL COST', this.overviewData['totalCost']);

        if (this.modalType === TransportationModalType.GROUND_SERVICE) {
          fields.set('TOTAL MILEAGE', this.overviewData['totalMileage']);
        }

        if (this.modalType === TransportationModalType.LODGING_SERVICE) {
          fields.set('NIGHTS', this.overviewData['nights']);
        }
        break;
      case ReferralStage.BILLING:
        fields.set('TOTAL COST', this.overviewData['totalCost']);
        break;
      default:
        break;
    }

    return fields;
  }
}
