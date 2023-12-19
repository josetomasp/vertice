import { Component, Input, OnInit } from '@angular/core';
import {
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import {
  ClaimLocation
} from '../../../../../../../../store/models/make-a-referral.models';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'healthe-narrative-new-locations-added',
  templateUrl: './narrative-new-locations-added.component.html',
  styleUrls: ['./narrative-new-locations-added.component.scss']
})
export class NarrativeNewLocationsAddedComponent implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  claimLocations: ClaimLocation[];

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  chosenAction: string;

  locations: string[] = [];

  // This originally was a FormArray, but when it was like that, the value changes from the form control did not trigger
  // the value changes on the original form group for some reason.
  formArray: FormControl[] = [];

  constructor() {}

  ngOnInit() {
    this.buildFormArray();

    // Create our locations
    this.narrativeTextItem.locationIdList.forEach((locationID) => {
      let claimLocation: ClaimLocation = null;
      this.claimLocations.forEach((claimLoc) => {
        if (parseInt(claimLoc.id, 10) === locationID) {
          claimLocation = claimLoc;
        }
      });

      if (null != claimLocation) {
        this.locations.push(claimLocation.name + ' - ' + claimLocation.address);
      }
    });
  }

  // Build a list of form controls from the base form group which already has the initialized form controls.
  // The structure is like:
  // approvedLocations -> (iterate form group names Like Home or Doctor) -->
  // (iterate over controls, the name is the ID we are looking for) -->
  // formGroup ['locationSelected'] is the control we want to use.
  private buildFormArray() {
    const approvedLocations: FormGroup = this.formGroup.get(
      'approvedLocations'
    ) as FormGroup;
    if (null != approvedLocations) {
      this.narrativeTextItem.locationIdList.forEach((locationID) => {
        const locationIdStr = locationID.toString();

        Object.keys(approvedLocations.controls).forEach((locationType) => {
          const locationTypeFG = approvedLocations.get(
            locationType
          ) as FormGroup;
          Object.keys(locationTypeFG.controls).forEach((key) => {
            if (key === locationIdStr) {
              const theFormGroupWeWant = locationTypeFG.controls[
                key
              ] as FormGroup;
              this.formArray.push(theFormGroupWeWant.controls[
                'locationSelected'
              ] as FormControl);
            }
          });
        });
      });
    }
  }
}
