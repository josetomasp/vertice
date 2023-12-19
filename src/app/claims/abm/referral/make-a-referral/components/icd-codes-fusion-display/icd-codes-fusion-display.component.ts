import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { RootState } from 'src/app/store/models/root.models';
import { loadFusionICDCodes } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { FusionICDCode } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { getFusionICDCodes } from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { MakeAReferralService } from '../../make-a-referral.service';
import { IcdCodesFusionEditModalComponent } from './components/icd-codes-fusion-edit-modal/icd-codes-fusion-edit-modal.component';

@Component({
  selector: 'healthe-icd-codes-display',
  templateUrl: './icd-codes-fusion-display.component.html',
  styleUrls: ['./icd-codes-fusion-display.component.scss']
})
export class IcdCodesFusionDisplayComponent implements OnInit {
  diagnosisCodesAndDescriptionsCsv: string = '';
  openICDCodesModalLabel: string = '';

  noICDCodesPlaceholder: string =
    'No Diagnosis Codes associated with this claim.';
  noICDCodesPlaceholderLbl: string = 'Add';
  iCDCodesPlaceholderLbl: string = 'View/Edit all';

  // Gets the list of codes for the claim
  diagnosisCodesAndDescriptionsForClaim$ = this.store$.pipe(
    select(getFusionICDCodes)
  );
  diagnosisCodesAndDescriptionsSelected$: Observable<FusionICDCode[]> = of([]);

  @Input()
  diagnosisCodes: FormControl;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public makeAReferralService: MakeAReferralService
  ) {}

  ngOnInit() {
    // If there is not already a selected list in the form control
    // Fire the get ICD Codes action and
    // suscribe to the stored list, then apply the list to the current
    // subservice list.
    if (!this.diagnosisCodes.value) {
      this.store$.dispatch(loadFusionICDCodes());
      this.diagnosisCodesAndDescriptionsForClaim$.subscribe(
        (icdCodeList: FusionICDCode[]) => {
          this.diagnosisCodes.setValue(icdCodeList);
        }
      );
    } else {
      // These values are most likely set from a draft
      let draftIcdCodes = this.diagnosisCodes.value;
      if (draftIcdCodes.length > 0) {
        this.makeAReferralService
          .repairIcdCodes(draftIcdCodes.map((obj) => obj.code))
          .subscribe((values) => {
            this.diagnosisCodes.setValue(values);
            this.diagnosisCodesAndDescriptionsSelected$ = of(values);
          });
      }
    }

    // Subscribe to the FormControl change event
    this.diagnosisCodes.valueChanges.subscribe(
      (icdCodeList: FusionICDCode[]) => {
        this.diagnosisCodesAndDescriptionsCsv = this.icdCodeListToCsv(
          icdCodeList
        );

        this.setModalButtonLabel(icdCodeList.length);
        this.diagnosisCodesAndDescriptionsSelected$ = new Observable((ob) => {
          ob.next(icdCodeList);
        });
      }
    );
  }

  // Open the modal and provide it the icd codes observable.
  // Once closed, get the selected list for the sub-service.
  openICDCodesModal() {
    this.dialog
      .open(IcdCodesFusionEditModalComponent, {
        autoFocus: false,
        width: '702px',
        data: {
          icdCodeList$: this.diagnosisCodesAndDescriptionsSelected$
        }
      })
      .afterClosed()
      .subscribe((icdCodeList: FusionICDCode[]) => {
        if (icdCodeList) {
          this.diagnosisCodes.setValue(icdCodeList);
        }
      });
  }

  private icdCodeListToCsv(icdCodeList: FusionICDCode[]) {
    if (icdCodeList.length > 0) {
      return icdCodeList
        .map((icdCode) => icdCode.code.concat(' - ', icdCode.desc))
        .join(', ');
    } else {
      return this.noICDCodesPlaceholder;
    }
  }

  private setModalButtonLabel(icdCodeListLength: Number) {
    if (icdCodeListLength > 0) {
      this.openICDCodesModalLabel = this.iCDCodesPlaceholderLbl;
    } else {
      this.openICDCodesModalLabel = this.noICDCodesPlaceholderLbl;
    }
  }
}
