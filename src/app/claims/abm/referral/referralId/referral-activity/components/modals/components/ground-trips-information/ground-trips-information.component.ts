import { Component, Input, OnInit } from '@angular/core';
import { getNumericSuffix } from '@shared';
import { ReferralStage } from '../../../../../../store/models';
import { AppointmentInfo } from '../../models/appointmentInfo';

interface TripLeg {
  transportationServiceName: string;
  mileageTab: {
    destination: string;
    fromAddr: string[];
    toAddr: string[];
    pickupTime: string;
    dropOffTime: string;
    mileage: string;
    cost: string;
    appointmentInfo: AppointmentInfo;
  };

  driverTab: {
    stars: number;
    contactInfo: string;
    driverRating: string;
    driverLanguage: string;
  };
}

interface TitleLine {
  title: string;
  image: string;
}

@Component({
  selector: 'healthe-ground-trips-information',
  templateUrl: './ground-trips-information.component.html',
  styleUrls: ['./ground-trips-information.component.scss']
})
export class GroundTripsInformationComponent implements OnInit {
  @Input() stage: ReferralStage;
  @Input() itineraryData: TripLeg[];

  ReferralStage = ReferralStage;

  isLyft = new RegExp('lyft', 'i');
  isUber = new RegExp('uber', 'i');

  titleLines: TitleLine[] = [];

  constructor() {}

  ngOnInit() {
    this.setupTitleLines();
  }

  setupTitleLines() {
    for (let j = 0; j < this.itineraryData.length; j++) {
      let leg = this.itineraryData[j];
      let titleLine: TitleLine = { title: '', image: null };
      this.titleLines.push(titleLine);
      let indexCount = j + 1;
      let isRideShare = false;

      if (this.isLyft.test(leg.transportationServiceName)) {
        isRideShare = true;
        titleLine.image = 'assets/img/referralActivity/lyft.png';
      } else if (this.isUber.test(leg.transportationServiceName)) {
        isRideShare = true;
        titleLine.image = 'assets/img/referralActivity/uber.svg';
      }

      if (isRideShare) {
        titleLine.title =
          indexCount.toString() +
          getNumericSuffix(indexCount) +
          ' Leg - Rideshare - ';
      } else {
        titleLine.title =
          indexCount.toString() +
          getNumericSuffix(indexCount) +
          ' Leg - Traditional - ' +
          leg.transportationServiceName;
      }
    }
  }
}
