import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { Drug, DrugModalData } from '@shared/models/drug';
import { Observable } from 'rxjs';
import { RootState } from 'src/app/store/models/root.models';
import { Store, select } from '@ngrx/store';
import { isUserInternal } from 'src/app/user/store/selectors/user.selectors';
import { first } from 'rxjs/operators';

const notAvailable = 'Not Available';

@Component({
  selector: 'healthe-drug-info-modal',
  templateUrl: './drug-info-modal.component.html',
  styleUrls: ['./drug-info-modal.component.scss']
})
export class DrugInfoModalComponent implements OnInit {
  faInfo = faInfoCircle;
  drugObject: Drug = {
    awpDrugPrices: [],
    gpiReference: null,
    ahfsTherapeuticClass: '',
    deaClass: '',
    displayName: '',
    dosageForm: '',
    gpi: '',
    itemName: '',
    multiSourceCode: '',
    multiSource: '',
    ndc: '',
    packSize: '',
    productName: '',
    repackInd: '',
    routeOfAdministration: '',
    rxOtcCode: '',
    rxOtc: '',
    strength: '',
    strengthUnit: '',
    teeCode: '',
    awpCost: '',
    awpPackagePrice: '',
    dosageFormAbbr: '',
    routeOfAdministrationAbbr: '',
    unitCost: ''
  };

  userIsInternal$: Observable<boolean> = this.store$.pipe(
    select(isUserInternal)
  );

  constructor(
    public store$: Store<RootState>,
    public dialogRef: MatDialogRef<DrugInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public drugData: DrugModalData
  ) {}

  ngOnInit() {
    this.drugObject = this.drugData.drugData;
    this.setUnavailableFields();
  }

  setUnavailableFields() {
    if (this.drugObject.packSize === '') {
      this.drugObject.packSize = notAvailable;
      this.drugObject.awpPackagePrice = notAvailable;
    }

    if (this.drugObject.awpCost === '') {
      this.drugObject.awpCost = notAvailable;
    }

    if (this.drugObject.unitCost === '') {
      this.drugObject.unitCost = notAvailable;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
