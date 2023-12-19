import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { capitalize, getFIEN } from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  Address,
  Communication,
  CommunicationType
} from '@shared/store/models/claim.models';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { FeatureFlagService } from '../../customer-configs/feature-flag.service';
import {
  ClaimantTabInfo,
  ClaimViewState
} from '../store/models/claim-view.models';
import { LabelValue } from '../store/models/eligibility-tab.models';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId
} from 'src/app/store/selectors/router.selectors';

@Component({
  selector: 'healthe-claimant',
  templateUrl: './claimant.component.html',
  styleUrls: ['./claimant.component.scss']
})
export class ClaimantComponent {
  componentGroupName = 'claimant';

  decodedClaimNumber$ = this.store$.pipe(
    select(getDecodedClaimNumber),
    first()
  );

  decodedCustomerId$ = this.store$.pipe(
    select(getDecodedCustomerId),
    first()
  );

  public claimantTabInfo$: Observable<ClaimantTabInfo> = this.store$.pipe(
    select(getClaimV3),
    map((claimV2Data) => {
      const cti: ClaimantTabInfo = {} as ClaimantTabInfo;
      cti.attorneyName = claimV2Data.attorney.fullName;
      cti.claimantDetails = new Array<LabelValue>();
      cti.employerInfo = new Array<LabelValue>();

      cti.claimantDetails.push({
        label: 'CLAIMANT NAME',
        value: claimV2Data.claimant.fullName,
        elementName: 'claimantName'
      });
      cti.claimantDetails.push({
        label: 'ADDRESS',
        value: this.getAddressString(claimV2Data.claimant.address),
        elementName: 'address'
      });
      cti.claimantDetails.push({
        label: 'DOB',
        value: claimV2Data.claimant.birthDate,
        elementName: 'claimantDOB'
      });
      cti.claimantDetails.push({
        label: 'DATE OF DEATH',
        value: claimV2Data.claimant.deathDate,
        elementName: 'claimantDOD'
      });
      cti.claimantDetails.push({
        label: 'SSN',
        value: claimV2Data.claimant.ssn,
        elementName: 'claimantSSN'
      });
      cti.claimantDetails.push({
        label: 'GENDER',
        value: capitalize(claimV2Data.claimant.gender),
        elementName: 'gender'
      });
      cti.claimantDetails.push({
        label: 'HEIGHT',
        value: this.getHeight(claimV2Data.claimant.height),
        elementName: 'height',
        editable: true
      });
      cti.claimantDetails.push({
        label: 'WEIGHT',
        value: claimV2Data.claimant.weight
          ? claimV2Data.claimant.weight + ' lbs'
          : '',
        elementName: 'weight',
        editable: true
      });
      cti.claimantDetails.push({
        label: 'LANGUAGE',
        value: capitalize(claimV2Data.claimant.language),
        elementName: 'language'
      });
      cti.claimantDetails.push({
        label: 'EMAIL',
        value: this.getCommunicationValue(
          claimV2Data.claimant.communications,
          'EMAIL'
        ),
        elementName: 'claimantEmail'
      });
      cti.claimantDetails.push({
        label: 'HOME PHONE',
        value:
          // getPhoneNumberString(
          this.getCommunicationValue(
            claimV2Data.claimant.communications,
            'HOME'
          ),
        // ),
        elementName: 'claimantHomePhone'
      });
      cti.claimantDetails.push({
        label: 'CELL PHONE',
        value:
          // getPhoneNumberString(
          this.getCommunicationValue(
            claimV2Data.claimant.communications,
            'CELL'
          ),
        // ),
        elementName: 'claimantCellPhone'
      });
      cti.claimantDetails.push({
        label: 'WORK PHONE',
        value:
          // getPhoneNumberString(
          this.getCommunicationValue(
            claimV2Data.claimant.communications,
            'WORK'
          ),
        // ),
        elementName: 'claimantWorkPhone'
      });

      cti.employerInfo.push({
        label: 'EMPLOYER NAME',
        value: claimV2Data.employer.name,
        elementName: 'employerName'
      });
      cti.employerInfo.push({
        label: 'EMPLOYER ADDRESS',
        value: this.getAddressString(claimV2Data.employer.address),
        elementName: 'employerAddress'
      });
      cti.employerInfo.push({
        label: 'BENEFIT STATE',
        value: claimV2Data.stateOfVenue,
        elementName: 'stateOfVenue'
      });
      cti.employerInfo.push({
        label: 'EMPLOYER FEIN',
        value: getFIEN(claimV2Data.employer.orgFEIN),
        elementName: 'employerFEIN'
      });

      return cti;
    })
  );
  isArray = Array.isArray;

  constructor(
    public store$: Store<ClaimViewState>,
    private pageTitleService: PageTitleService,
    private featureFlagService: FeatureFlagService
  ) {
    this.pageTitleService.setTitleWithClaimNumber(
      'Claim View',
      this.featureFlagService.labelChange(
        'Claimant',
        'claimantInformationLabel'
      )
    );
  }

  getCommunicationValue(
    com: Array<Communication>,
    type: CommunicationType
  ): string {
    let retVal: string = '';
    com.filter((value) => {
      if (value.type === type) {
        retVal = value.communicationValue;
      }
    });

    return retVal;
  }

  getHeight(height: number): string {
    if (height == null || height === 0) {
      return '';
    }

    const feet = Math.floor(height / 12);
    const inches = height % 12;

    return feet.toString() + ' ft ' + inches.toString() + ' in';
  }

  getAddressString(address: Address): string[] {
    let addressArray = [];
    if (null != address.address1) {
      addressArray.push(address.address1);
    }

    if (null != address.address2) {
      addressArray.push(address.address2);
    }
    let lastLine = '';
    if (null != address.city) {
      lastLine += address.city + ', ';
    }

    if (null != address.state) {
      lastLine += address.state + ' ';
    }

    if (null != address.zip) {
      lastLine += ' ' + address.zip;
    }
    addressArray.push(lastLine);
    return addressArray;
  }

  getArrayTooltip(array: any) {
    let values = '';
    Object.keys(array).forEach((key) => {
      values += array[key] + '\n';
    });
    return values;
  }
}
