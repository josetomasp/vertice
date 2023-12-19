import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DrugInfoModalComponent } from './drug-info-modal.component';
import { DrugRequest } from '@shared/models/drug';
import { DrugLookupService } from '@shared/service/drug-lookup.service';

const errorMessage = "Couldn't find any information for drug with NDC = ";
const errorButton = 'Close';

@Injectable({
  providedIn: 'root'
})
export class DrugInfoModalService {
  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private drugLookupService: DrugLookupService
  ) {}

  showDrugInfoModal(ndc, date, AWPQuantity) {
    let request: DrugRequest = {
      ndc: ndc,
      fromDate: date,
      AWPQuantity: AWPQuantity
    };

    this.drugLookupService.getDrugInfoByNDC(request).subscribe(
      (drugData) => {
        this.openDrugInfoModal(drugData);
      },
      (error) => {
        this.displayErrorSnackBar(request.ndc);
      }
    );
  }

  private openDrugInfoModal(DrugDataParam) {
    this.dialog.open(DrugInfoModalComponent, {
      data: { drugData: DrugDataParam },
      autoFocus: false,
      width: '750px'
    });
  }

  private displayErrorSnackBar(ndc) {
    this._snackBar.open(errorMessage + ndc, errorButton, {
      duration: 4000,
      panelClass: ['danger', 'snackbar']
    });
  }
}
