import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClaimV3 } from '../../../store/models/claim.models';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { addClaimantValuesToFormGroup } from '../../addClaimantValuesToFormGroup';
import { searchPhonesAndEmailInCommunicationList } from '../../searchPhonesAndEmailInCommunicationList';
import { State, States } from '../../../store/models/state.type';

@Component({
  selector: 'healthe-lomn-attorney-and-claimant',
  templateUrl: './lomn-attorney-and-claimant.component.html',
  styleUrls: ['./lomn-attorney-and-claimant.component.scss']
})
export class LomnAttorneyAndClaimantComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  @Input()
  attorneyAndClaimantInformationFormGroup: FormGroup;

  @Input()
  claimInfo$: Observable<ClaimV3>;

  @Input()
  exParteCopiesRequired$: Observable<boolean>;

  states: State[] = States;

  constructor() {}

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
    if (
      claimInfo.attorney &&
      claimInfo.attorney.fullName &&
      exParteCopiesRequired
    ) {
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

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
