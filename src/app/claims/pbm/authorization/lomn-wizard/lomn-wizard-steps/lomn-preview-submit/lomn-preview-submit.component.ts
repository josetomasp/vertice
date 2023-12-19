import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import {
  LOMNSubmitContactInfo,
  LOMNSubmitMessage
} from '../../../store/models/create-lomn.models';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationLineItem } from '../../../store/models/pbm-authorization-information/authorization-line-item.models';

@Component({
  selector: 'healthe-lomn-preview-submit',
  templateUrl: './lomn-preview-submit.component.html',
  styleUrls: ['./lomn-preview-submit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnPreviewSubmitComponent extends DestroyableComponent {
  private formArraySubscription;
  private _medicationListFormArray: FormArray;
  private _letterTypes: { [key: string]: string } = {};
  @Input()
  ndcToLineItemMap: { [ndc: string]: AuthorizationLineItem };

  @Input()
  set letterTypes(letterTypes: { [key: string]: string }) {
    this._letterTypes = letterTypes;
    this.changeDetectorRef.detectChanges();
  }

  get letterTypes() {
    return this._letterTypes;
  }
  @Input()
  set medicationListFormArray(formArray: FormArray) {
    this._medicationListFormArray = formArray;
    if (this.formArraySubscription) {
      this.formArraySubscription.unsubscribe();
    }
    this.formArraySubscription = this._medicationListFormArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  get medicationListFormArray(): FormArray {
    return this._medicationListFormArray;
  }

  @Input()
  claimantContactInfo: LOMNSubmitContactInfo;
  @Input()
  attorneyInfo: LOMNSubmitContactInfo;
  @Input()
  claimNumber: string;
  @Input()
  customerId: string;

  @Output()
  previewLomn: EventEmitter<LOMNSubmitMessage> = new EventEmitter();
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  previewLOMN(lineItemForm) {
    this.previewLomn.emit({
      ...this.ndcToLineItemMap[lineItemForm.ndc],
      ...lineItemForm,
      npi: lineItemForm.prescriber.npi,
      comment: lineItemForm.displayNotes,
      attorney: this.attorneyInfo,
      claimant: this.claimantContactInfo,
      claimNo: this.claimNumber,
      customerID: this.customerId
    });
  }

  getLetterTypeByNDC(ndc: string) {
    return this.letterTypes[ndc] || '';
  }
}
