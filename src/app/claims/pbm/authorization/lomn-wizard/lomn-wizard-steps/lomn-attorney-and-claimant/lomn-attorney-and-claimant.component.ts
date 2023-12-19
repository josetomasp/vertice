import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { State, States } from '@shared';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { Observable } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { addClaimantValuesToFormGroup } from '../../addClaimantValuesToFormGroup';
import { searchPhonesAndEmailInCommunicationList } from '../../searchPhonesAndEmailInCommunicationList';

@Component({
  selector: 'healthe-lomn-attorney-and-claimant',
  templateUrl: './lomn-attorney-and-claimant.component.html',
  styleUrls: ['./lomn-attorney-and-claimant.component.scss']
})
export class LomnAttorneyAndClaimantComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  attorneyAndClaimantInformationFormGroup: FormGroup;

  @Input()
  claimInfo$: Observable<ClaimV3>;

  @Input()
  exParteCopiesRequired$: Observable<boolean>;

  states: State[] = States;

  constructor() {
    super();
  }

  ngOnInit() {
    this.getAttorneyInformationFormGroup().disable();
    this.attorneyAndClaimantInformationFormGroup
      .get('attorneyInvolvement')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) =>
        value
          ? this.getAttorneyInformationFormGroup().enable()
          : this.getAttorneyInformationFormGroup().disable()
      );
    this.claimInfo$
      .pipe(
        withLatestFrom(this.exParteCopiesRequired$),
        takeUntil(this.onDestroy$)
      )
      .subscribe(([claimInfo, exParteCopiesRequired]) => {
        addClaimantValuesToFormGroup(
          claimInfo,
          this.getClaimantInformationFormGroup()
        );
        this.addAttorneyValuesToFormGroup(claimInfo, exParteCopiesRequired);
      });
  }

  getClaimantInformationFormGroup(): FormGroup {
    return this.attorneyAndClaimantInformationFormGroup.get(
      'claimantInformation'
    ) as FormGroup;
  }

  getAttorneyInformationFormGroup(): FormGroup {
    return this.attorneyAndClaimantInformationFormGroup.get(
      'attorneyInformation'
    ) as FormGroup;
  }

  addAttorneyValuesToFormGroup(
    claimInfo: ClaimV3,
    exParteCopiesRequired: boolean
  ): void {
    if ((claimInfo.attorney && (claimInfo.attorney.fullName || claimInfo.attorney.firmName)) && exParteCopiesRequired) {
      this.attorneyAndClaimantInformationFormGroup
        .get('attorneyInvolvement')
        .setValue(true);
      let attorney = claimInfo.attorney;
      this.getAttorneyInformationFormGroup()
        .get('name')
        .setValue(attorney.fullName);
      this.getAttorneyInformationFormGroup()
        .get('addressLine1')
        .setValue(attorney.address.address1);
      this.getAttorneyInformationFormGroup()
        .get('addressLine2')
        .setValue(attorney.address.address2);
      this.getAttorneyInformationFormGroup()
        .get('city')
        .setValue(attorney.address.city);
      this.getAttorneyInformationFormGroup()
        .get('state')
        .setValue(attorney.address.state);
      this.getAttorneyInformationFormGroup()
        .get('zipCode')
        .setValue(attorney.address.zip);
      if (attorney) {
        let phonesAndEmail = searchPhonesAndEmailInCommunicationList(
          attorney.communications
        );
        this.getAttorneyInformationFormGroup()
          .get('phone')
          .setValue(phonesAndEmail.phone);
        this.getAttorneyInformationFormGroup()
          .get('email')
          .setValue(phonesAndEmail.email);
        this.getAttorneyInformationFormGroup()
          .get('fax')
          .setValue(phonesAndEmail.fax);
      }
    } else {
      this.attorneyAndClaimantInformationFormGroup
        .get('attorneyInvolvement')
        .setValue(false);
    }
  }
}
