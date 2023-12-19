import {Component, Inject, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FusionAuthorizationCardBase } from '../fusion-authorization-card-base';
import { Observable, of } from 'rxjs';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionAuthorizationDiagnosticsDetailsTable
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup, FormGroupDirective, FormGroupName,
  Validators
} from '@angular/forms';
import { AuthNarrativeConfig } from '../../../../referral-authorization.models';
import { HealtheTableColumnDef } from '@shared';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { FusionICDCode } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { setNarrativeMinimumQuantity } from '../../../lib';
import { bodyPartFormArrayActionValidator } from '../fusion-authorization-card.component';

const moment = _moment;

@Component({
  selector: 'healthe-diagnostics-authorization-card',
  templateUrl: './diagnostics-authorization-card.component.html',
  styleUrls: ['./diagnostics-authorization-card.component.scss']
})
export class DiagnosticsAuthorizationCardComponent
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

  // SECTIONS
  // Narrative Configuration
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

  // View Details Table for DX
  // we need to check where all this info will come from
  tableDataSource$: Observable<
    FusionAuthorizationDiagnosticsDetailsTable[]
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

  // Location Details Min Input
  minDetailsInput: number = 1;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {
    super(store$, dialog, parent, formGroupDirective);
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
    this.setDetailsDefination();
  }

  setDetailsDefination() {
    let displayDateOfService;
    if (
      this.authorization.authorizationUnderReview.startDate &&
      this.authorization.authorizationUnderReview.endDate &&
      this.authorization.authorizationUnderReview.startDate !== '1900-01-01' &&
      this.authorization.authorizationUnderReview.endDate !== '1900-01-01'
    ) {
      displayDateOfService = `${moment(
        this.authorization.authorizationUnderReview.startDate
      ).format(environment.dateFormat)}`
        .concat(' - ')
        .concat(
          `${moment(this.authorization.authorizationUnderReview.endDate).format(
            environment.dateFormat
          )}`
        );
    } else if (
      this.authorization.authorizationUnderReview.dateOfService &&
      this.authorization.authorizationUnderReview.dateOfService !== '1900-01-01'
    ) {
      displayDateOfService = `${moment(
        this.authorization.authorizationUnderReview.dateOfService
      ).format(environment.dateFormat)}`;
    } else {
      displayDateOfService = 'Est: '.concat(
        `${moment(
          this.authorization.authorizationUnderReview.anticipatedDeliveryDate
        ).format(environment.dateFormat)}`
      );
    }
    this.tableDataSource$ = of([
      {
        dateOfService: displayDateOfService,
        perDiem: this.authorization.authorizationUnderReview.perDiem.toString(),
        qtyCompleted: this.authorization.authorizationUnderReview
          .quantityCompleted,
        authAmount:
          '$' + this.authorization.authorizationUnderReview.authorizationAmount,
        requestorName: this.authorization.authorizationUnderReview.requestorRole
          .concat('/')
          .concat(this.authorization.authorizationUnderReview.requestorRole)
      }
    ]);
  }
}
