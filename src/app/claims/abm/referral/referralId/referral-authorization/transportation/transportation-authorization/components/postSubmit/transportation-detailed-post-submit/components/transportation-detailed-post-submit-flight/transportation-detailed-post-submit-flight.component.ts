import { Component, Input, OnInit } from '@angular/core';
import { faNotesMedical } from '@fortawesome/pro-light-svg-icons';
import { AuthRelatedAppointmentsModalService } from '../../../../../../../../components/auth-related-appointments-modal/auth-related-appointments-modal.service';
import { TransportationDetailedPostSubmitSummaryBase } from '../TransportationDetailedPostSubmitSummaryBase';

@Component({
  selector: 'healthe-transportation-detailed-post-submit-flight',
  templateUrl: './transportation-detailed-post-submit-flight.component.html',
  styleUrls: ['./transportation-detailed-post-submit-flight.component.scss']
})
export class TransportationDetailedPostSubmitFlightComponent
  extends TransportationDetailedPostSubmitSummaryBase
  implements OnInit {
  @Input()
  authItem: any;

  faNotesMedical = faNotesMedical;

  typeCode;
  constructor(
    private authRelatedAppointmentsModalService: AuthRelatedAppointmentsModalService
  ) {
    super();
  }

  ngOnInit() {
    this.typeCode = this.authItem['authData']['authorizationTypeCode'];
    this.authItem = this.fixAuthDataForDenail(this.authItem);
  }

  viewRelatedAppointments() {
    this.authRelatedAppointmentsModalService.showModal(
      this.authItem['authData']['appointments']
    );
  }
}
