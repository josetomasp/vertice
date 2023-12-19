import { Component, Input, OnInit } from '@angular/core';
import { getNumericSuffix } from '@shared';
import { ReferralStage } from '../../../../../../store/models';
import { AppointmentInfo } from '../../models/appointmentInfo';

interface NightStay {
  lodgingName: string;
  address: string[];
  contactInfo: string;
  checkinDate: string;
  checkoutDate: string;
  nightlyCost: string;
  amenities: string;
  appointmentInfo: AppointmentInfo;
}

@Component({
  selector: 'healthe-lodging-stays-information',
  templateUrl: './lodging-stays-information.component.html',
  styleUrls: ['./lodging-stays-information.component.scss']
})
export class LodgingStaysInformationComponent implements OnInit {
  @Input() stage: ReferralStage;
  @Input() itineraryData: NightStay[];

  ReferralStage = ReferralStage;

  constructor() {}

  ngOnInit() {}

  getTitleLine(night: NightStay, index: number): string {
    index++;
    return (
      index.toString() +
      getNumericSuffix(index) +
      ' Night - ' +
      night.lodgingName
    );
  }
}
