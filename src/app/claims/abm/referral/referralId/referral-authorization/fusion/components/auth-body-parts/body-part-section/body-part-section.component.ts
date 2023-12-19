import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  FusionAuthorizationBodyPartApprovalOptions
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { ReferralBodyPart } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

const moment = _moment;

@Component({
  selector: 'healthe-body-part-section',
  templateUrl: './body-part-section.component.html',
  styleUrls: ['./body-part-section.component.scss']
})
export class BodyPartSectionComponent implements OnInit, OnChanges {
  @Input()
  fusionAuth: FusionAuthorization;

  @Input()
  selectedBodyParts: ReferralBodyPart[] = [];

  @Input()
  bodyPartApprovalOptions: FusionAuthorizationBodyPartApprovalOptions[];

  @Input()
  authBodyPartsFormArray: FormArray;

  @Input()
  originalBodyParts: FusionAuthorizationBodyPart[];

  @Input()
  isReadOnly: boolean = false;

  authBodyPartsFormGroup: FormGroup = new FormGroup({});

  bodyPartList: FusionAuthorizationBodyPart[] = [];

  authId: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.authId = this.fusionAuth.authorizationUnderReview.authorizationId;
    if (!this.isReadOnly) {
      this.bodyPartList = this.convertToSectionBodyPartFromAuth(true);
    } else {
      this.bodyPartList = this.originalBodyParts;
    }
  }

  ngOnChanges() {
    if (!this.isReadOnly) {
      this.bodyPartList = this.convertToSectionBodyPartFromAuth(false);
    }
  }

  getBodyPartDisplayName(bodyPart: FusionAuthorizationBodyPart) {
    if (
      bodyPart.sideOfBody &&
      bodyPart.sideOfBody.trim() != '' &&
      bodyPart.description.indexOf(bodyPart.sideOfBody.trim()) < 0
    ) {
      return bodyPart.description.concat('-', bodyPart.sideOfBody);
    }
    return bodyPart.description;
  }

  private convertToSectionBodyPartFromAuth(
    isNgOninit: boolean
  ): FusionAuthorizationBodyPart[] {
    let bodyPartList: FusionAuthorizationBodyPart[] = [];
    let bodyPartFormArray: FormArray = new FormArray([]);
    let bodyPartFormArraySelected: FormArray = new FormArray([]);
    if (this.originalBodyParts) {
      bodyPartList = this.originalBodyParts.map(function(bodyPart) {
        let bodyPartClass = {
          id: bodyPart.id.toString(),
          description: bodyPart.description,
          lastActionDate: moment(bodyPart.lastActionDate).format(
            environment.dateFormat
          ),
          sideOfBody: bodyPart.sideOfBody
        };
        return bodyPartClass;
      });
    }

    bodyPartList = bodyPartList.filter((bodyPart) => {
      // Gets all the bodyparts with the same ID and side of body
      const sameBodyPart = this.originalBodyParts.filter(
        (originalBodyPart) =>
          originalBodyPart.id.toString() === bodyPart.id &&
          originalBodyPart.sideOfBody === bodyPart.sideOfBody
      );
      // If not duplicate add to the list
      if (sameBodyPart.length === 0) {
        return true;
      }
      // determine if its the lastest if not, remove from list
      let isLatest = true;
      const lastActionDate = moment(bodyPart.lastActionDate);
      sameBodyPart.forEach((duplicate) => {
        const duplicateLastActionDate = moment(duplicate.lastActionDate).format(
          environment.dateFormat
        );
        if (lastActionDate.isBefore(duplicateLastActionDate)) {
          isLatest = false;
        }
      });
      return isLatest;
    });
    bodyPartList.forEach((bodyPart) => {
      bodyPartFormArray.push(new FormControl('Approved'));
    });

    if (this.selectedBodyParts) {
      bodyPartList = bodyPartList.concat(
        this.selectedBodyParts.map(function(bodyPart) {
          let bodyPartClass = {
            id: bodyPart.ncciCode,
            description: bodyPart.desc,
            descOriginal: bodyPart.descOriginal,
            lastActionDate: moment(new Date()).format(environment.dateFormat),
            sideOfBody: bodyPart.sideOfBody
          };
          bodyPartFormArraySelected.push(new FormControl('Approved'));
          return bodyPartClass;
        })
      );
    }
    this.fusionAuth.authorizationUnderReview.bodyParts = bodyPartList;
    this.authBodyPartsFormArray.clear();
    if (isNgOninit) {
      // Concat both the original and selected controls
      bodyPartFormArray.controls = bodyPartFormArray.controls.concat(
        bodyPartFormArraySelected.controls
      );
      bodyPartFormArray.controls.forEach((control) => {
        this.authBodyPartsFormArray.push(control);
      });
      this.authBodyPartsFormGroup = this.fb.group({
        authBodyPartsFormArray: bodyPartFormArray
      });
    } else {
      if (this.authBodyPartsFormGroup.controls['authBodyPartsFormArray']) {
        let originalControlsCount: number = bodyPartFormArray.controls.length;
        let formArray: FormArray = <FormArray>(
          this.authBodyPartsFormGroup.controls['authBodyPartsFormArray']
        );

        // Remove previous selected if there are.
        formArray.controls.splice(
          originalControlsCount,
          formArray.controls.length - originalControlsCount
        );

        // Append all new selected form controls
        formArray.controls = formArray.controls.concat(
          bodyPartFormArraySelected.controls
        );

        formArray.controls.forEach((control) => {
          this.authBodyPartsFormArray.push(control);
        });
      }
    }
    return bodyPartList;
  }
}
