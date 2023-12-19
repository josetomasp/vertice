import {Component, Inject, Input, OnInit} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup, FormGroupDirective, FormGroupName,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faUsers } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngrx/store';
import { HealtheTableColumnDef } from '@shared';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../../../../store/models/root.models';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionAuthorizationPhysicalMedicineDetailsTable
} from '../../../../../../store/models/fusion/fusion-authorizations.models';
import { AuthNarrativeConfig } from '../../../../referral-authorization.models';
import { FusionAuthorizationCardBase } from '../fusion-authorization-card-base';
import { FusionICDCode } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { setNarrativeMinimumQuantity } from '../../../lib';
import { bodyPartFormArrayActionValidator } from '../fusion-authorization-card.component';

const moment = _moment;

@Component({
  selector: 'healthe-physical-medicine-authorization-card',
  templateUrl: './physical-medicine-authorization-card.component.html',
  styleUrls: ['./physical-medicine-authorization-card.component.scss']
})
export class PhysicalMedicineAuthorizationCardComponent
  extends FusionAuthorizationCardBase
  implements OnInit {
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
  @Input()
  authorization: FusionAuthorization;
  @Input()
  $index: number;
  @Input()
  formArray: FormArray;
  actionFormGroup = new FormGroup({});
  faUsers = faUsers;
  // Location Details Min Input
  minDetailsInput: number = 1;
  authNarrativeConfig: AuthNarrativeConfig = {
    startDate: { controlName: 'startDate', isDisabled: true },
    endDate: { controlName: 'endDate', equalGreaterThan: '' },
    originalEndDate: { controlName: 'originalEndDate', isDisabled: true },
    serviceDate: { controlName: 'serviceDate', useFormControl: false },
    quantity: {
      controlName: 'quantity',
      min: 1,
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
      Validators.min(this.authNarrativeConfig.quantity.min)
    ])
  });
  icdCodesFormControl = new FormControl([]);
  authBodyPartsFormArray = new FormArray([], []);
  tableDataSource$: Observable<
    FusionAuthorizationPhysicalMedicineDetailsTable[]
  > = of([]);
  columnDefinitions$: Observable<HealtheTableColumnDef[]> = of([
    {
      name: 'dateOfService',
      label: 'DATE OF SERVICE',
      headerClasses: ['auth-table--dateOfService_header', 'auth-table_header'],
      cellClasses: ['auth-table--dateOfServices_cell', 'auth-table_cell']
    },
    {
      name: 'perDiem',
      label: 'PER DIEM',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'qtyCompleted',
      label: 'QTY COMPLETED',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'authAmount',
      label: 'AUTHORIZATION AMOUNT',
      cellClasses: ['auth-table_cell']
    },
    {
      name: 'requestorName',
      label: 'REQUESTOR ROLE/NAME',
      cellClasses: ['auth-table_cell']
    }
  ]);

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {
    super(store$, dialog, parent, formGroupDirective);
    this.actionFormGroup.addControl(
      'action',
      new FormControl(null, [Validators.required])
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
    if (
      this.authorization.narrativeTextList.findIndex(
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
    /* Adding Sections FormGroups to a FormArray so we have all validations in a single object
    and the submit button can be enable or disable as the forms validity change */

    this.formArray.push(
      new FormGroup(
        {
          actionFormGroup: this.actionFormGroup,
          authBodyPartsFormArray: this.authBodyPartsFormArray
        },
        [bodyPartFormArrayActionValidator()]
      )
    );
    this.formArray.push(this.narrativeTextFormGroup);
    this.formArray.push(this.icdCodesFormControl);
    this.formArray.push(this.detailNoteFormControl);
    /* Set endDate date validation */
    this.authNarrativeConfig.endDate.equalGreaterThan = this.datePipe.transform(
      new Date(this.authorization.authorizationUnderReview.lastServiceDate),
      'MM/dd/yyyy',
      '+0000'
    );

    const hasQuantityChange = !!this.authorization.narrativeTextList.find(
      (narrativeItem) =>
        narrativeItem.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE' ||
        narrativeItem.type === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE'
    );

    if (!hasQuantityChange) {
      this.narrativeTextFormGroup
        .get('quantity')
        .setValue(this.authorization.authorizationUnderReview.quantity);
    }

    /* Listening Action value change to update min value for the Location Details inputs
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
            setNarrativeMinimumQuantity(
              this.authorization.narrativeTextList,
              this.authNarrativeConfig
            );
          }
          if (
            this.narrativeTextFormGroup &&
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ]
          ) {
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ].setValidators([
              Validators.min(this.authNarrativeConfig.quantity.min)
            ]);
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ].updateValueAndValidity();
          }
        }
      });

    /* Listening to the Narrative Component Section to update the store$ object with new values
    (This implementation needs to be modify for other services as the narrative changes per services)*/
    this.narrativeTextFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((changes) => {
        let originalTotal = 0;
        let quantityChangeIndex = this.authorization.authorizationChangeSummary.findIndex(
          (summary) =>
            summary.changeType === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE'
        );
        if (quantityChangeIndex >= 0) {
          originalTotal = this.authorization.authorizationChangeSummary[
            quantityChangeIndex
          ].previousQuantityApproved;

          if (changes.quantity) {
            this.authorization.authorizationChangeSummary[
              quantityChangeIndex
            ].quantityRequested = changes.quantity;

            this.authorization.authorizationChangeSummary[
              quantityChangeIndex
            ].newTotalQuantityApproved = changes.quantity + originalTotal;
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

    this.authBodyPartsFormArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((changes: string[]) => {
        for (let i = 0; i < changes.length; i++) {
          this.authorization.authorizationUnderReview.bodyParts[i].status =
            changes[i];
        }
        this.updateAuthorization(this.authorization);
      });

    this.icdCodesFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((icdCodes: FusionICDCode[]) => {
        this.authorization.authorizationUnderReview.icdCodes = icdCodes;
        this.updateAuthorization(this.authorization);
      });

    this.tableDataSource$ = of([
      {
        dateOfService: (this.authorization.authorizationUnderReview.startDate
          ? `${moment(
              this.authorization.authorizationUnderReview.startDate
            ).format(environment.dateFormat)}`
          : 'N/A'
        )
          .concat(' - ')
          .concat(
            this.authorization.authorizationUnderReview.endDate
              ? `${moment(
                  this.authorization.authorizationUnderReview.endDate
                ).format(environment.dateFormat)}`
              : 'N/A'
          ),
        perDiem: this.authorization.authorizationUnderReview.perDiem.toString(),
        qtyCompleted: this.authorization.authorizationUnderReview
          .quantityCompleted,
        authAmount: this.currencyPipe.transform(
          this.authorization.authorizationUnderReview.authorizationAmount
        ),
        requestorName: (this.authorization.authorizationUnderReview
          .requestorRole
          ? this.authorization.authorizationUnderReview.requestorRole
          : 'N/A'
        )
          .concat(' - ')
          .concat(
            this.authorization.authorizationUnderReview.requestorName
              ? this.authorization.authorizationUnderReview.requestorName
              : 'N/A'
          )
      }
    ]);
  }
}
