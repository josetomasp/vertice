import { Component, Input, OnInit } from '@angular/core';
import { ReferralStage } from '../../../../../../store/models';
import { AppointmentInfo } from '../../models/appointmentInfo';

interface FlightTripData {
  legData: {
    flyingFrom: string;
    flyingTo: string;
    departure: string; // MM/DD/YY HH:MM AA
    arrival: string; // MM/DD/YY HH:MM AA
    carrier: string;
    flightNumber: string;
  }[];
  appointmentInfo: AppointmentInfo;
}

@Component({
  selector: 'healthe-flight-trips-information',
  templateUrl: './flight-trips-information.component.html',
  styleUrls: ['./flight-trips-information.component.scss']
})
export class FlightTripsInformationComponent implements OnInit {
  @Input() stage: ReferralStage;
  @Input() itineraryData: FlightTripData;

  constructor() {}

  ngOnInit() {}
}
