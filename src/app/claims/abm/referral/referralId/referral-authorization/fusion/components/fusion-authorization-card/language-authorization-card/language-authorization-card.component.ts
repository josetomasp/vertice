import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {faUsers} from '@fortawesome/pro-solid-svg-icons';
import {
  ControlContainer,
  FormArray, FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective, FormGroupName,
  Validators
} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {
  AuthorizationReasons,
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { Observable, of } from 'rxjs';
import { RootState } from 'src/app/store/models/root.models';
import { Store } from '@ngrx/store';
import { AuthNarrativeConfig } from '../../../../referral-authorization.models';
import { FusionAuthorizationCardBase } from '../fusion-authorization-card-base';
import { DatePipe } from '@angular/common';
import { setNarrativeMinimumQuantity } from '../../../lib';import {
  FormGroupNamePassThrough,
  getParentPath
} from "@modules/form-validation-extractor";

@Component({
  selector: 'healthe-language-authorization-card',
  templateUrl: './language-authorization-card.component.html',
  styleUrls: ['./language-authorization-card.component.scss']
})
export class LanguageAuthorizationCardComponent
  extends FusionAuthorizationCardBase
  implements FormGroupNamePassThrough, OnInit
{
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons> = of();
  @Input()
  authorization: FusionAuthorization;
  @Input()
  $index: number;
  @Input()
  formArray: FormArray;
  get parentPath(): string[] {
    return getParentPath(this.parent) ?? [];
  }
  fusionAuthorizationFormGroup = new FormGroup({});

  faUsers = faUsers;

  // SECTIONS
  // Narrative Configuration
  authNarrativeConfig: AuthNarrativeConfig = {
    startDate: {controlName: 'startDate', isDisabled: true},
    endDate: {controlName: 'endDate', equalGreaterThan: ''},
    originalEndDate: {controlName: 'originalEndDate', isDisabled: true},
    serviceDate: {controlName: 'serviceDate', useFormControl: false},
    quantity: {
      controlName: 'quantity',
      isDisabled: true,
      min: 0,
      useFormControl: true
    }
  };

  // Narrative FormGroup
  narrativeTextFormGroup = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    originalEndDate: new FormControl(),
    serviceDate: new FormControl(),
    quantity: new FormControl(1, [
      Validators.min(this.authNarrativeConfig.quantity.min),
      Validators.required
    ])
  });

  // Location Details Min Input ONLY LAN
  minDetailsInput: number = 1;

  // Location Details FormGroup ONLY LAN
  locationDetailsFormGroup = new FormGroup({});

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    @Optional() @Inject(ControlContainer) public parent: FormGroupName,
    @Optional() @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {
    super(store$, dialog, parent, formGroupDirective);
  }

  ngOnInit() {
    if (
      this.authorization?.narrativeTextList?.findIndex(
        (narrative) =>
          narrative.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE' ||
          narrative.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE'
      ) > -1
    ) {
      setNarrativeMinimumQuantity(
        this.authorization.narrativeTextList,
        this.authNarrativeConfig
      );
    }
    /* Adding Sections FormGroups to a Parent FormGroup */

    this.fusionAuthorizationFormGroup = this.formBuilder.group({
      'actionsFormGroup': this.actionFormGroup,
      'narrativeTextFormGroup': this.narrativeTextFormGroup,
      'locationDetailsFormGroup': this.locationDetailsFormGroup,
      'detailNoteFormControl': this.detailNoteFormControl
    })

    /* Checking if there is any location to enable or disable the #Appointments or #Documents in
    the narrative ONLY LAN*/
    if (
      (this.authNarrativeConfig?.quantity?.isDisabled &&
        !this.authorization?.authorizationUnderReview?.locations) ||
      this.authorization?.authorizationUnderReview?.locations?.length === 0
    ) {
      this.authNarrativeConfig.quantity.isDisabled = false;
    }
    /* Set endDate date validation */
    if (this.authorization?.authorizationUnderReview?.lastServiceDate) {
      this.authNarrativeConfig.endDate.equalGreaterThan =
        this.datePipe.transform(
          new Date(
            this.authorization?.authorizationUnderReview?.lastServiceDate
          ),
          'MM/dd/yyyy',
          '+0000'
        );
    }

    /* Listening Action value change to update min value for the Location Details inputs ONLY LAN
    but this subscribe can be use in other services if there is any condition to the action value like set min value in narrative*/
    this.actionFormGroup
      .get('action')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value !== this.authorization.action) {
          if (value === 'deny') {
            this.minDetailsInput = 0;
            this.authNarrativeConfig.quantity.min = 0;
          } else {
            this.minDetailsInput = 1;
            if (
              this.authorization.narrativeTextList.findIndex(
                (narrative) =>
                  narrative.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE' ||
                  narrative.type ===
                    'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE'
              ) > -1
            ) {
              setNarrativeMinimumQuantity(
                this.authorization.narrativeTextList,
                this.authNarrativeConfig
              );
            }
          }
          if (
            this.narrativeTextFormGroup &&
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ]
          ) {
            setNarrativeMinimumQuantity(
              this.authorization.narrativeTextList,
              this.authNarrativeConfig
            );
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ].setValidators([
              Validators.min(this.authNarrativeConfig.quantity.min),
              Validators.required
            ]);
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ].updateValueAndValidity();
          }
          if (this.locationDetailsFormGroup.get('allLocations')) {
            this.locationDetailsFormGroup.get('authAction').setValue(value);

            let array: FormArray = this.locationDetailsFormGroup.get(
              'allLocations'
            ) as FormArray;
            array.controls.forEach((control, index) => {
              let formControlName = 'remainingQuantity';
              if (array.controls[index].get('numAppointments')) {
                formControlName = 'numAppointments';
              }
              array.controls[index]
                .get(formControlName)
                .setValidators([
                  Validators.required,
                  Validators.min(this.minDetailsInput)
                ]);
              array.controls[index]
                .get(formControlName)
                .updateValueAndValidity();
            });
          }
        }
      });

    /* Listening to the Detail Location Section to update the store$ object with new values LAN ONLY*/
    this.locationDetailsFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((changes) => {
        changes.allLocations.forEach((location) => {
          let locationChangeIndex =
            this.authorization.authorizationChangeSummary.findIndex(
              (changeSummary) =>
                changeSummary.changeType ===
                'OPEN_AUTHORIZATION_LOCATION_CHANGE'
            );
          if (locationChangeIndex >= 0) {
            let locationSummaryChangeIndex =
              this.authorization.authorizationChangeSummary[
                locationChangeIndex
              ].locationSummary.findIndex(
                (locationChange) =>
                  locationChange.locationId === location.locationId
              );
            let locationIndex =
              this.authorization.authorizationUnderReview.locations.findIndex(
                (locationRef) => locationRef.locationId === location.locationId
              );
            this.authorization.authorizationUnderReview.locations[
              locationIndex
            ].approved = location.approved;
            if (locationSummaryChangeIndex >= 0) {
              this.authorization.authorizationChangeSummary[
                locationChangeIndex
              ].locationSummary[locationSummaryChangeIndex].remainingQuantity =
                location.remainingQuantity;
            } else {
              if (locationIndex >= 0) {
                this.authorization.authorizationUnderReview.locations[
                  locationIndex
                ].numAppointments = location.numAppointments;
              }
            }
          } else {
            let locationIndex =
              this.authorization.authorizationUnderReview.locations.findIndex(
                (locationRef) => locationRef.locationId === location.locationId
              );
            this.authorization.authorizationUnderReview.locations[
              locationIndex
            ].approved = location.approved;

            if (locationIndex >= 0) {
              this.authorization.authorizationUnderReview.locations[
                locationIndex
              ].numAppointments = location.numAppointments;
            }
          }
        });
        this.updateAuthorization(this.authorization);
      });

    /* Listening to the Narrative Component Section to update the store$ object with new values
    (This implementation needs to be modify for other services as the narrative changes per services)*/
    this.narrativeTextFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((changes) => {
        let originalTotal = 0;
        let quantityChangeIndex =
          this.authorization.authorizationChangeSummary.findIndex(
            (summary) =>
              summary.changeType === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE'
          );
        if (quantityChangeIndex >= 0) {
          const quantityChangeSummary =
            this.authorization.authorizationChangeSummary[quantityChangeIndex];
          originalTotal = quantityChangeSummary.previousQuantityApproved;

          if (changes.quantity) {
            quantityChangeSummary.quantityRequested = changes.quantity;
            quantityChangeSummary.newTotalQuantityApproved =
              changes.quantity + originalTotal;
          }
        }

        this.authorization.authorizationChangeSummary.forEach(
          (changeSummary, i) => {
            if (changes.startDate) {
              this.authorization.authorizationChangeSummary[i].newStartDate =
                changes.startDate;
            }
            if (changes.endDate) {
              this.authorization.authorizationChangeSummary[i].newEndDate =
                changes.endDate;
            }
          }
        );
        if (changes.startDate) {
          this.authorization.authorizationUnderReview.startDate =
            changes.startDate;
        }
        if (changes.endDate) {
          this.authorization.authorizationUnderReview.endDate = changes.endDate;
        }
        if (changes.quantity) {
          this.authorization.authorizationUnderReview.quantity =
            changes.quantity + originalTotal;
        }
        this.updateAuthorization(this.authorization);
      });
  }
}
