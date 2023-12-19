import { Component, Input, OnInit } from '@angular/core';
import {
  AuthNarrativeMode,
  NarrativeTextItem,
  TransportationAuthorizationOpenSedanFormData
} from '../../../../../../referral-authorization.models';
import {
  ClaimLocation
} from '../../../../../../../../store/models/make-a-referral.models';

@Component({
  selector: 'healthe-narrative-location-limit',
  templateUrl: './narrative-location-limit.component.html',
  styleUrls: ['./narrative-location-limit.component.scss']
})
export class NarrativeLocationLimitComponent implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  authItem: TransportationAuthorizationOpenSedanFormData;

  @Input()
  claimLocations: ClaimLocation[];

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  chosenAction: string;

  locations: string[] = [];

  constructor() {}

  ngOnInit() {
    // Create our locations
    this.narrativeTextItem.originalLocationLimits.forEach(
      (originalLocation) => {
        let claimLocation: ClaimLocation = null;
        this.claimLocations.forEach((claimLoc) => {
          // Why on gods green earth is the ID a string?  I tried changing it to a number, but then a shit ton of stuff broke.
          if (parseInt(claimLoc.id, 10) === originalLocation.location.id) {
            claimLocation = claimLoc;
          }
        });

        if (null != claimLocation) {
          this.locations.push(
            claimLocation.name + ' - ' + claimLocation.address
          );
        }
      }
    );
  }
}
