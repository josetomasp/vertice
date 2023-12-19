import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  debounceTime,
  first,
  map,
  mergeMap,
  startWith,
  take
} from 'rxjs/operators';
import { IcdCodeSet } from 'src/app/claim-view/store/models/icd-codes.models';
import { RootState } from 'src/app/store/models/root.models';

import {
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../store/selectors/router.selectors';
import { ClaimsService } from '../../../../../claims.service';
import {
  SaveReferralICDCodes,
  SetICdCodeModalSaveButtonState
} from '../../../store/actions/referral-id.actions';
import {
  ICDCode,
  ICDCodeSaveRequest
} from '../../../store/models/referral-id.models';
import {
  getICDCodes,
  getIcdModalIsSaveDisabled
} from '../../../store/selectors/referral-id.selectors';
import { ReferralIdService } from '../../referral-id.service';

interface EditableICDCode extends ICDCode {
  isNew: boolean;
  isDeleted: boolean;
  displayText: string;
}

@Component({
  selector: 'healthe-icd-codes-edit-modal',
  templateUrl: './icd-codes-edit-modal.component.html',
  styleUrls: ['./icd-codes-edit-modal.component.scss']
})
export class IcdCodesEditModalComponent implements OnInit, OnDestroy {
  isAlive = true;
  isCore = false;
  ICDCodeList: EditableICDCode[] = [];

  isSaveButtonDisabled$: Observable<boolean> = this.store$.pipe(
    select(getIcdModalIsSaveDisabled)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  referralICDCodes$: Observable<EditableICDCode[]> = this.store$.pipe(
    select(getICDCodes),
    take(1),
    map((icdCodeSet) => {
      return icdCodeSet.map((icdCode) => {
        return {
          ...icdCode,
          isNew: false,
          isDeleted: false,
          displayText: this.generateIcdSuggestionDisplayText(icdCode)
        };
      });
    })
  );

  icdAutoComplete = new FormControl();
  icdCodeSuggestions$ = this.icdAutoComplete.valueChanges.pipe(
    debounceTime(250),

    mergeMap((value) => {
      return this.setAutoCompleteValue(value);
    }),
    startWith([])
  );

  constructor(
    public dialogRef: MatDialogRef<IcdCodesEditModalComponent>,
    public store$: Store<RootState>,
    public referralIdService: ReferralIdService,
    public claimsService: ClaimsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.router.url.indexOf('transportation') > -1) {
      this.isCore = true;
    }

    this.referralICDCodes$.subscribe((icdList) => {
      this.ICDCodeList = icdList;
    });

    this.store$.dispatch(new SetICdCodeModalSaveButtonState(true));
  }

  // For preventing the auto-complete from flashing a value after you do a selection
  autoCompleteDisplayNull() {
    return null;
  }

  generateIcdSuggestionDisplayText(icdCode: ICDCode): string {
    if (null == icdCode) {
      return '';
    }
    return icdCode.icdCode + ' - ' + icdCode.icdDescription;
  }

  addNewIcdCode(value: ICDCode) {
    this.icdAutoComplete.setValue('', { emitEvent: false });

    const isIcdCodeADuplicate = (icd) => {
      return (
        icd.icdCode === value.icdCode && icd.icdVersion === value.icdVersion
      );
    };

    if (true === this.ICDCodeList.some(isIcdCodeADuplicate)) {
      this.claimsService.showSnackBar(
        'The selected diagnosis code is already associated with the referral',
        false
      );
    } else {
      this.ICDCodeList.push({
        ...value,
        isNew: true,
        isDeleted: false,
        displayText: this.generateIcdSuggestionDisplayText(value)
      });

      this.store$.dispatch(new SetICdCodeModalSaveButtonState(false));
    }
  }

  saveICDCodes() {
    combineLatest(this.encodedReferralId$, this.encodedCustomerId$)
      .pipe(first())
      .subscribe(([referralId, customerId]) => {
        const saveRequest: ICDCodeSaveRequest = {
          icdCodeList: this.ICDCodeList.filter((icdCode) => {
            return false === icdCode.isDeleted;
          }),
          referralId: referralId,
          customerId: customerId,
          isCore: this.isCore
        };
        this.store$.dispatch(new SaveReferralICDCodes(saveRequest));
      });
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
    return this.referralIdService.icdCodeSearch(value).pipe(
      map((retval: IcdCodeSet) => {
        return retval.icds;
      }),
      catchError((x) => {
        return EMPTY;
      })
    );
  }

  deleteItem(item: EditableICDCode) {
    item.isDeleted = true;
    this.store$.dispatch(new SetICdCodeModalSaveButtonState(false));
  }

  getIcdDisplayTextClass(item: EditableICDCode): string {
    let retval = '';

    if (!item.isDeleted && item.isNew) {
      retval = 'isNew';
    }

    if (item.isDeleted) {
      retval = 'isDeleted';
    }

    return retval;
  }

  unDeleteItem(item: EditableICDCode) {
    item.isDeleted = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
