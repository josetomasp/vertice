import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  mergeMap,
  startWith
} from 'rxjs/operators';
import { ClaimsService } from 'src/app/claims/claims.service';
import { MakeAReferralService } from 'src/app/claims/abm/referral/make-a-referral/make-a-referral.service';
import { FusionICDCode } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';

@Component({
  selector: 'healthe-auth-icd-codes-modal',
  templateUrl: './auth-icd-codes-modal.component.html',
  styleUrls: ['./auth-icd-codes-modal.component.scss']
})
export class AuthIcdCodesModalComponent implements OnInit {
  selectedICDCodeList: FusionICDCode[] = [];
  icdAutoComplete = new FormControl();
  isReadOnly = false;

  icdCodeSuggestions$ = this.icdAutoComplete.valueChanges.pipe(
    debounceTime(250),

    mergeMap((value) => {
      return this.setAutoCompleteValue(value);
    }),
    startWith([])
  );

  constructor(
    public dialogRef: MatDialogRef<AuthIcdCodesModalComponent>,
    public makeAReferralService: MakeAReferralService,
    public claimsService: ClaimsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.data.icdCodeList$.subscribe((icdCodes: FusionICDCode[]) => {
      this.selectedICDCodeList = icdCodes.map((icdCode) => {
        if (!icdCode.displayText) {
          icdCode.displayText = icdCode.code.concat(' - ', icdCode.desc);
        }
        return {
          ...icdCode,
          isDeleted: false,
          isNew: false,
          isReadOnly: icdCode.isReadOnly
        };
      });
    });

    if (this.data.isReadOnly) {
      this.isReadOnly = this.data.isReadOnly;
    }
  }

  getIcdDisplayTextClass(item: FusionICDCode): string {
    let retval = '';

    if (!item.isDeleted && item.isNew) {
      retval = 'isNew';
    }

    if (item.isDeleted) {
      retval = 'isDeleted';
    }

    return retval;
  }

  showDeleteIcon(icdCode: FusionICDCode): boolean {
    if (!icdCode.isDeleted) {
      // General and detail Read Only
      if (this.isReadOnly || icdCode.isReadOnly) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  showRestoreIcon(icdCode: FusionICDCode): boolean {
    if (icdCode.isDeleted) {
      // General and detail Read Only
      if (this.isReadOnly || icdCode.isReadOnly) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  deleteItem(item: FusionICDCode) {
    item.isDeleted = true;
  }

  unDeleteItem(item: FusionICDCode) {
    item.isDeleted = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

  saveAndcloseModal() {
    // remove the deleted options from the list
    this.selectedICDCodeList = this.selectedICDCodeList.filter(
      (icdCode) => !icdCode.isDeleted
    );
    // return the selected list of ICD Codes
    this.dialogRef.close(this.selectedICDCodeList);
  }

  // For preventing the auto-complete from flashing a value after you do a selection
  autoCompleteDisplayNull() {
    return null;
  }

  setAutoCompleteValue(value: any) {
    if (null == value) {
      return EMPTY;
    }
    if (typeof value === 'string') {
      return this.doICDCodeSearch(value);
    }

    // IF its none of the above, it must be our ICDCode type
    this.addNewIcdCode(value);
    return EMPTY;
  }

  doICDCodeSearch(value: string) {
    return this.makeAReferralService.fusionIcdCodeSearch(value).pipe(
      map((icdCodes) =>
        icdCodes.map((icdCode) => {
          return {
            ...icdCode,
            displayText: icdCode.code.concat(' - ', icdCode.desc)
          };
        })
      ),
      catchError((x) => {
        return EMPTY;
      })
    );
  }

  addNewIcdCode(value: FusionICDCode) {
    this.icdAutoComplete.setValue('', { emitEvent: false });

    const isIcdCodeADuplicate = (icd) => {
      return icd.code === value.code;
    };

    if (true === this.selectedICDCodeList.some(isIcdCodeADuplicate)) {
      this.claimsService.showSnackBar(
        'The selected diagnosis code is already associated with the authorization',
        false
      );
    } else {
      this.selectedICDCodeList.push({
        ...value,
        isNew: true,
        isDeleted: false,
        displayText: value.code.concat(' - ', value.desc)
      });
    }
  }
}
