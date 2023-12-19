import {Component, Inject, Input, OnInit} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup, FormGroupDirective, FormGroupName,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HealtheTableColumnDef } from '@healthe/vertice-library';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionAuthorizationDMEDetailsTable,
  FusionClinicalAlert
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { RootState } from 'src/app/store/models/root.models';
import { FusionAuthorizationCardBase } from '../fusion-authorization-card-base';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';

const moment = _moment;

@Component({
  selector: 'healthe-dme-authorization-card',
  templateUrl: './dme-authorization-card.component.html',
  styleUrls: ['./dme-authorization-card.component.scss']
})
export class DmeAuthorizationCardComponent
  extends FusionAuthorizationCardBase
  implements OnInit
{
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
  @Input()
  authorization: FusionAuthorization;
  @Input()
  clinicalAlerts: FusionClinicalAlert[];
  @Input()
  $index: number;
  @Input()
  formArray: FormArray;
  @Input()
  isSubstitutionCard: boolean = false;

  // AFS-5624 - The Qty can be 0 regardless the action
  minQuantity = 0;

  actionFormGroup = new FormGroup({});
  authInformationFormGroup = new FormGroup({});

  substitutionMessage = '';
  dmeAuthTitle: string = '';

  tableDataSource$: Observable<FusionAuthorizationDMEDetailsTable[]> = of([]);
  columnDefinitions$: Observable<HealtheTableColumnDef[]> = of([
    {
      name: 'description',
      label: 'DESCRIPTION',
      headerClasses: ['auth-table--description_header', 'auth-table_header'],
      cellClasses: ['auth-table--description_cell', 'auth-table_cell']
    },
    {
      name: 'dateOfService',
      label: 'DATE OF SERVICE',
      headerClasses: ['auth-table--dateOfService_header', 'auth-table_header'],
      cellClasses: ['auth-table--dateOfServices_cell', 'auth-table_cell']
    },
    {
      name: 'qty',
      label: 'QTY',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'hcpc',
      label: 'HCPC',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'uom',
      label: 'UOM',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'feeAmount',
      label: 'FEE/UCR AMOUNT',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'expectedAmount',
      label: 'VENDOR EXPECTED AMOUNT',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'requestorName',
      label: 'REQUESTOR ROLE/NAME',
      cellClasses: ['auth-table_cell']
    }
  ]);

  constructor(
    store$: Store<RootState>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {
    super(store$, dialog, parent, formGroupDirective);
    this.actionFormGroup.addControl(
      'action',
      new FormControl(null, Validators.required)
    );
    this.actionFormGroup.addControl(
      'approvalReason',
      new FormControl(null, [Validators.required])
    );
    this.actionFormGroup.addControl(
      'denialReason',
      new FormControl(null, [Validators.required])
    );
    this.actionFormGroup.addControl(
      'pendReason',
      new FormControl(null, [Validators.required])
    );
  }

  ngOnInit() {
    let authMaxQty: number;
    if (this.isSubstitutionCard) {
      authMaxQty =
        this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.authMaxQty;
      this.dmeAuthTitle =
        this.authorization.authorizationUnderReview.substitutionAuthorizationUnderReview.description;
    } else {
      authMaxQty = this.authorization.authorizationUnderReview.authMaxQty;
      this.dmeAuthTitle =
        this.authorization.authorizationUnderReview.categoryDesc;
    }
    this.authInformationFormGroup.addControl(
      'authMaxQty',
      new FormControl(authMaxQty, [
        Validators.min(this.minQuantity),
        Validators.required
      ])
    );
    /* Adding Sections FormGroups to a FormArray to we have all validations in a single object
    so that the submit button can be enable or disable as the forms validity change */
    this.formArray.push(this.detailNoteFormControl);
    if (this.isEditMode()) {
      this.formArray.push(this.authInformationFormGroup);
      this.formArray.push(this.actionFormGroup);

      /* Listening Action value change to update min value for the Location Details inputs
    but this subscribe can be use in other services if there is any condition to the action value like set min value in narrative*/
      this.actionFormGroup
        .get('action')
        .valueChanges.pipe(takeUntil(this.onDestroy$))
        .subscribe((value) => {
          if (value !== this.authorization.action) {
            if (this.authInformationFormGroup.controls['authMaxQty']) {
              this.authInformationFormGroup.controls[
                'authMaxQty'
              ].setValidators([
                Validators.min(this.minQuantity),
                Validators.required
              ]);
              this.authInformationFormGroup.controls[
                'authMaxQty'
              ].updateValueAndValidity();
            }
          }
        });

      this.authInformationFormGroup.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((changes) => {
          if (changes && changes.authMaxQty !== null) {
            if (this.isSubstitutionCard) {
              this.authorization.authorizationUnderReview.substitutionAuthorizationUnderReview.authMaxQty =
                changes.authMaxQty;
            } else {
              this.authorization.authorizationUnderReview.authMaxQty =
                changes.authMaxQty;
            }

            this.authorization.authorizationChangeSummary.forEach(
              (change, index) => {
                this.authorization.authorizationChangeSummary[
                  index
                ].newQuantity = changes.authMaxQty;
                this.authorization.authorizationChangeSummary[
                  index
                ].quantityRequested = changes.authMaxQty;

                if (changes.startDate) {
                  const startDate = this.datePipe.transform(
                    new Date(changes.startDate),
                    'yyyy-MM-dd'
                  );
                  this.authorization.authorizationChangeSummary[
                    index
                  ].newStartDate = startDate;
                  this.isSubstitutionCard
                    ? (this.authorization.authorizationUnderReview.substitutionAuthorizationUnderReview.startDate =
                        startDate)
                    : (this.authorization.authorizationUnderReview.startDate =
                        startDate);
                }
                if (changes.endDate) {
                  const endDate = this.datePipe.transform(
                    new Date(changes.endDate),
                    'yyyy-MM-dd'
                  );
                  this.authorization.authorizationChangeSummary[
                    index
                  ].newEndDate = endDate;
                  this.isSubstitutionCard
                    ? (this.authorization.authorizationUnderReview.substitutionAuthorizationUnderReview.endDate =
                        endDate)
                    : (this.authorization.authorizationUnderReview.endDate =
                        endDate);
                }
              }
            );
            this.updateAuthorization(this.authorization);
          }
        });
    }

    // Substitution Message
    if (this.authorization.authorizationUnderReview.isSubstitution) {
      if (this.authorization.authorizationUnderReview.substitutionApproved) {
        if (this.isSubstitutionCard) {
          this.substitutionMessage =
            'Substituted Item - Substitution Approved by Physician';
        } else {
          this.substitutionMessage =
            'Original Item - Substitution Approved by Physician';
        }
      } else {
        if (this.isSubstitutionCard) {
          this.substitutionMessage =
            'Substituted Item - Substitution Denied by Physician';
        } else {
          this.substitutionMessage =
            'Original Item - Substitution Denied by Physician';
        }
      }
    }
    this.setDetailsDefination();
  }

  setDetailsDefination() {
    let displayDateOfService;
    let anticipatedDeliveryDate;
    let dateOfService;
    let startDate;
    let endDate;
    if (this.isSubstitutionCard) {
      anticipatedDeliveryDate =
        this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.anticipatedDeliveryDate;
      dateOfService =
        this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.dateOfService;
      startDate =
        this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.startDate;
      endDate =
        this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.endDate;
    } else {
      anticipatedDeliveryDate =
        this.authorization.authorizationUnderReview.anticipatedDeliveryDate;
      dateOfService = this.authorization.authorizationUnderReview.dateOfService;
      startDate = this.authorization.authorizationUnderReview.startDate;
      endDate = this.authorization.authorizationUnderReview.endDate;
    }

    if (dateOfService && dateOfService !== '1900-01-01') {
      displayDateOfService = `${moment(dateOfService).format(
        environment.dateFormat
      )}`;
    } else if (
      startDate &&
      endDate &&
      startDate !== '1900-01-01' &&
      endDate !== '1900-01-01'
    ) {
      displayDateOfService = `${moment(startDate).format(
        environment.dateFormat
      )}`
        .concat(' - ')
        .concat(`${moment(endDate).format(environment.dateFormat)}`);
    } else {
      displayDateOfService = 'Est: '.concat(
        `${moment(anticipatedDeliveryDate).format(environment.dateFormat)}`
      );
    }

    let detailsData;
    if (this.isSubstitutionCard) {
      detailsData = {
        description:
          this.authorization.authorizationUnderReview
            .substitutionAuthorizationUnderReview.description,
        dateOfService: displayDateOfService,
        qty: this.authorization.authorizationUnderReview.substitutionAuthorizationUnderReview.authMaxQty.toString(),
        hcpc: this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.hcpc,
        uom: this.authorization.authorizationUnderReview
          .substitutionAuthorizationUnderReview.uom,
        feeAmount:
          '$' +
          this.authorization.authorizationUnderReview
            .substitutionAuthorizationUnderReview.feeUcrAmt,
        expectedAmount:
          '$' +
          this.authorization.authorizationUnderReview
            .substitutionAuthorizationUnderReview.vendorExpectedAmount,
        requestorName:
          this.authorization.authorizationUnderReview.requestedByRole
            .concat('/')
            .concat(this.authorization.authorizationUnderReview.requestedByName)
      };
    } else {
      detailsData = {
        description: this.authorization.authorizationUnderReview.categoryDesc,
        dateOfService: displayDateOfService,
        qty: this.authorization.authorizationUnderReview.quantity.toString(),
        hcpc: this.authorization.authorizationUnderReview.hcpc,
        uom: this.authorization.authorizationUnderReview.unitOfMeasure,
        feeAmount: '$' + this.authorization.authorizationUnderReview.feeUcrAmt,
        expectedAmount:
          '$' +
          this.authorization.authorizationUnderReview.vendorExpectedAmount,
        requestorName:
          this.authorization.authorizationUnderReview.requestedByRole
            .concat('/')
            .concat(this.authorization.authorizationUnderReview.requestedByName)
      };
    }
    this.tableDataSource$ = of([detailsData]);
  }

  isEditMode() {
    // Edit if it's not a substitution
    // OR if it's a substitution
    // THEN if it's approved then the subs card is editable
    // BUT if it's not approved then the original card is editable
    return (
      !this.authorization.authorizationUnderReview.isSubstitution ||
      (this.authorization.authorizationUnderReview.isSubstitution &&
        ((this.authorization.authorizationUnderReview.substitutionApproved &&
          this.isSubstitutionCard) ||
          (!this.authorization.authorizationUnderReview.substitutionApproved &&
            !this.isSubstitutionCard)))
    );
  }

  showActionsForCard() {
    return this.isEditMode();
  }

  getNarrativeMode() {
    if (this.isEditMode()) {
      return AuthNarrativeMode.EditDetails;
    } else {
      return AuthNarrativeMode.PostSubmit;
    }
  }
}
