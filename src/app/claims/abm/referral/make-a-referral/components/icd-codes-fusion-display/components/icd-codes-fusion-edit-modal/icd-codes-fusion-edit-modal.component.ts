import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  mergeMap,
  startWith
} from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { MakeAReferralService } from '../../../../make-a-referral.service';
import { ClaimsService } from '../../../../../../../claims.service';
import { FusionICDCode } from '../../../../../store/models/fusion/fusion-make-a-referral.models';
import { SetICdCodeModalSaveButtonState } from '../../../../../store/actions/referral-id.actions';

@Component({
  selector: 'healthe-icd-codes-edit-modal',
  templateUrl: './icd-codes-fusion-edit-modal.component.html',
  styleUrls: ['./icd-codes-fusion-edit-modal.component.scss']
})
export class IcdCodesFusionEditModalComponent implements OnInit {
  selectedICDCodeList: FusionICDCode[] = [];
  icdAutoComplete = new FormControl();

  icdCodeSuggestions$ = this.icdAutoComplete.valueChanges.pipe(
    debounceTime(250),

    mergeMap((value) => {
      return this.setAutoCompleteValue(value);
    }),
    startWith([])
  );

  constructor(
    public dialogRef: MatDialogRef<IcdCodesFusionEditModalComponent>,
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService,
    public claimsService: ClaimsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.data.icdCodeList$.subscribe((icdCodes: FusionICDCode[]) => {
      this.selectedICDCodeList = icdCodes.map((icdCode) => {
        return {
          ...icdCode,
          isDeleted: false,
          isNew: false
        };
      });
    });
  }

  // For preventing the auto-complete from flashing a value after you do a selection
  autoCompleteDisplayNull() {
    return null;
  }

  addNewIcdCode(value: FusionICDCode) {
    this.icdAutoComplete.setValue('', { emitEvent: false });

    const isIcdCodeADuplicate = (icd) => {
      return icd.code === value.code;
    };

    if (true === this.selectedICDCodeList.some(isIcdCodeADuplicate)) {
      this.claimsService.showSnackBar(
        'The selected diagnosis code is already associated with the referral',
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

  deleteItem(item: FusionICDCode) {
    item.isDeleted = true;
    this.store$.dispatch(new SetICdCodeModalSaveButtonState(false));
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
}
