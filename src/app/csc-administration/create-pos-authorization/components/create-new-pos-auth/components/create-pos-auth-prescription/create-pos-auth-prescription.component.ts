import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  AddedPosAuthPrescriptions,
  CreatePosAuthPrimaryRejectCode,
  CreatePosAuthSecondaryRejectCode,
  PbmPrescriptionDetail
} from '../../create-new-pos-auth.models';
import {
  faFile,
  faInfoCircle,
  faTrashAlt
} from '@fortawesome/pro-light-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompoundModalData, CompoundModalIngredient, ConfirmationModalData } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { first } from 'rxjs/operators';

import * as _moment from 'moment';
import { DrugLookup } from '@shared/components/info-lookup-launcher/info-lookup-launcher.component';
import { environment } from 'src/environments/environment';
import { validatorDateIsNotFuture } from '../validators/ValidatorDateIsNotFuture';
import { Prescriber } from 'projects/lomn/src/app/store/models/prescriber';
import { ListOfPrescribersModalService } from 'src/app/csc-administration/components/list-of-prescribers-modal/list-of-prescribers-modal.service';

const moment = _moment;

@Component({
  selector: 'healthe-create-pos-auth-prescription',
  templateUrl: './create-pos-auth-prescription.component.html',
  styleUrls: ['./create-pos-auth-prescription.component.scss']
})
export class CreatePosAuthPrescriptionComponent implements OnInit, OnDestroy {
  @Input()
  row: AddedPosAuthPrescriptions;

  @Input()
  index: number;
  @Input()
  readonly: boolean = false;

  @Input()
  rejectCodeOptions: CreatePosAuthPrimaryRejectCode[];

  @Output()
  remove: EventEmitter<AddedPosAuthPrescriptions> = new EventEmitter<
    AddedPosAuthPrescriptions
  >();

  markedForRemoval = false;
  faTrashAlt = faTrashAlt;
  faInfoCircle = faInfoCircle;
  faFile = faFile;
  displayPhoneNumber: string;

  confirmModalData: ConfirmationModalData = {
    titleString: 'Remove ',
    bodyHtml: 'Please press "Continue" to confirm removal.',
    affirmString: 'CONTINUE',
    denyString: 'CANCEL'
  };
  prescriber: Prescriber;

  readonly NOT_AVAILABLE = 'Not Available';

  getQuantityFormControl(): FormControl {
    return this.row.addedPrescriptionsFG.get('quantity') as FormControl;
  }

  getPrimaryRejectCodeFormControl(): FormControl {
    return this.row.addedPrescriptionsFG.get(
      'primaryRejectCode'
    ) as FormControl;
  }

  getSecondaryRejectCodeFormControl(): FormControl {
    return this.row.addedPrescriptionsFG.get(
      'secondaryRejectCode'
    ) as FormControl;
  }

  getDaysSupplyFormControl(): FormControl {
    return this.row.addedPrescriptionsFG.get('daysSupply') as FormControl;
  }

  getServiceDateFormControl(): FormControl {
    return this.row.addedPrescriptionsFG.get('dateOfService') as FormControl;
  }

  constructor(
    public confirmationModalService: ConfirmationModalService,
    public listOfPrescribersModalService: ListOfPrescribersModalService
  ) {}

  ngOnInit() {
    this.confirmModalData.titleString =
      'Remove ' + this.row.detail.prescriptionName + '?';

    if (null == this.row.addedPrescriptionsFG) {
      let currentPrescriptionDetails = this.row.detail;
      this.row.addedPrescriptionsFG = new FormGroup({'prescriberInfoFG': new FormGroup({})});
      this.row.addedPrescriptionsFG.addControl(
        'dateOfService',
        new FormControl(
          this.row.summary ? new Date(this.row.summary.dateFilled) : null,
          [Validators.required, validatorDateIsNotFuture]
        )
      );
      this.row.addedPrescriptionsFG.addControl(
        'primaryRejectCode',
        new FormControl(null, Validators.required)
      );
      this.row.addedPrescriptionsFG.addControl(
        'secondaryRejectCode',
        new FormControl(null, Validators.required)
      );
      this.row.addedPrescriptionsFG.addControl(
        'samaritanDoseApproved',
        new FormControl(false)
      );
      this.row.addedPrescriptionsFG.addControl(
        'quantity',
        new FormControl(currentPrescriptionDetails.quantity, Validators.min(1))
      );
      this.row.addedPrescriptionsFG.addControl(
        'daysSupply',
        new FormControl(
          currentPrescriptionDetails.daysSupply,
          Validators.min(1)
        )
      );

      this.row.addedPrescriptionsFG.addControl(
        'prescriptionNote',
        new FormControl()
      );

      if (this.row.summary && this.row.summary.deaNumber) {
        this.listOfPrescribersModalService
          .getPrescriberById(this.row.summary.deaNumber)
          .subscribe((prescriber: Prescriber) => {
            this.prescriber = prescriber;
            this.setPrescriberValues(prescriber);
          });
      }

      this.initializeRejectCodeValues(currentPrescriptionDetails);
    }
  }

  removeThis() {
    this.confirmationModalService
      .displayModal(this.confirmModalData)
      .afterClosed()
      .pipe(first())
      .subscribe((value) => {
        if (value) {
          this.remove.emit(this.row);
          this.markedForRemoval = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.markedForRemoval) {
      this.row.addedPrescriptionsFG = null;
    }
  }

  setPrescriberValues(prescriber: Prescriber) {
    if (prescriber) {
      this.row.prescriberInformationLookupInitialValues = {
        prescriberFirstName: prescriber.firstName,
        prescriberId: prescriber.npi,
        prescriberLastName: prescriber.lastName,
        prescriberPhone:  prescriber.primaryPhone?prescriber.primaryPhone.split('-').join(''):''
      };
    } else {
      this.row.prescriberInformationLookupInitialValues = {
        prescriberFirstName: '',
        prescriberId: '',
        prescriberLastName: '',
        prescriberPhone: ''
      };
    }
  }

  getDrugLookupParameters(row: AddedPosAuthPrescriptions): DrugLookup {
    if (row.detail.isCompound) {
      return undefined;
    } else {
      return {
        drugID: row.detail.ndc,
        quantity: row.addedPrescriptionsFG?.get('quantity').value,
        drugDate: moment()
          .format('MM/DD/YYYY')
          .toString()
      } as DrugLookup;
    }
  }

  getCompoundModalDetails(row: AddedPosAuthPrescriptions): CompoundModalData {
    if (row.detail.isCompound) {
      return {
        ingredients: row.detail.compounds.map((ingredient) => {
          return {
            drugName: ingredient.drugName,
            ndc: ingredient.ndc,
            quantity: +ingredient.quantity,
            createdDate: moment(
              row.addedPrescriptionsFG.get('dateOfService').value
            ).format(environment.dateFormat),
            rejectReason: {
              description: '',
              ncpdpRejectCode: row.addedPrescriptionsFG.get('primaryRejectCode')
                .value?.rejectCode
            } // TODO: This should be the reject code selected
          } as CompoundModalIngredient;
        })
      } as CompoundModalData;
    } else {
      return undefined;
    }
  }

  primaryRejectReasonChange(event: CreatePosAuthPrimaryRejectCode) {
    const secondaryFC = this.getSecondaryRejectCodeFormControl();
    if (null == event.secondaryRejectCodes) {
      secondaryFC.disable();
      secondaryFC.setValue(null);
    } else {
      secondaryFC.enable();
    }
  }

  private initializeRejectCodeValues(
    currentPrescriptionDetails: PbmPrescriptionDetail
  ) {
    const primaryRejectCodeFC = this.getPrimaryRejectCodeFormControl();
    const secondaryRejectCodeFC = this.getSecondaryRejectCodeFormControl();
    secondaryRejectCodeFC.disable();

    const primaryRejectCode: CreatePosAuthPrimaryRejectCode = this.findMatchingRejectCode(
      currentPrescriptionDetails.primaryRejectCode,
      this.rejectCodeOptions
    );
    if (null != primaryRejectCode) {
      primaryRejectCodeFC.setValue(primaryRejectCode);
      this.primaryRejectReasonChange(primaryRejectCode);

      if (null != primaryRejectCode.secondaryRejectCodes) {
        const secondaryRejectCode: CreatePosAuthSecondaryRejectCode = this.findMatchingRejectCode(
          currentPrescriptionDetails.secondaryRejectCode,
          primaryRejectCode.secondaryRejectCodes
        );
        if (null != secondaryRejectCode) {
          secondaryRejectCodeFC.setValue(secondaryRejectCode);
        }
      }
    }
  }

  private findMatchingRejectCode(
    rejectCode: string,
    rejectCodeOptions: CreatePosAuthSecondaryRejectCode[]
  ) {
    let result = null;
    rejectCodeOptions.forEach((value) => {
      if (rejectCode === value.rejectCode) {
        result = value;
      }
    });

    return result;
  }
}
