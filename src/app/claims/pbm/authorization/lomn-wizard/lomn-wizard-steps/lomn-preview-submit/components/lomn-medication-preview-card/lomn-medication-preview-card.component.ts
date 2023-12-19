import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {

  LOMNLineItemFormValue
} from '../../../../../store/models/create-lomn.models';
import { takeUntil } from 'rxjs/operators';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {
  PrescriberModalService
} from '@shared/components/prescriber-lookup-modal/prescriber-modal.service';
import {
  AuthorizationLineItem,
  AuthorizationLineItemPrescriber
} from '../../../../../store/models/pbm-authorization-information/authorization-line-item.models';

@Component({
  selector: 'healthe-lomn-medication-preview-card',
  templateUrl: './lomn-medication-preview-card.component.html',
  styleUrls: ['./lomn-medication-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnMedicationPreviewCardComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  $index: number;
  @Input()
  medicationFormGroup: FormGroup;
  @Input()
  letterType: string;
  @Input()
  maxNotesCharacters: number = 1000;
  @Input()
  lineItem: AuthorizationLineItem;

  @Output()
  previewLOMN: EventEmitter<LOMNLineItemFormValue> = new EventEmitter<LOMNLineItemFormValue>();
  prescriber: AuthorizationLineItemPrescriber;
  lastFaxValue: string;
  deliveryMethod = {
    FAX: 'fax',
    REGULAR_MAIL: 'mail'
  };
  cardDeliveryMethodFormControl: FormControl = new FormControl(
    this.deliveryMethod.FAX,
    []
  );

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public prescriberModalService: PrescriberModalService
  ) {
    super();
  }

  ngOnInit() {
    this.cardDeliveryMethodFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selectedDeliveryMethod) => {
        if (selectedDeliveryMethod === this.deliveryMethod.REGULAR_MAIL) {
          this.medicationFormGroup.get('prescriberFax').setValue(null);
          this.medicationFormGroup.get('prescriberFax').disable();
        } else {
          this.medicationFormGroup
            .get('prescriberFax')
            .setValue(this.lastFaxValue);
          this.medicationFormGroup.get('prescriberFax').enable();
        }

        this.changeDetectorRef.detectChanges();
      });

    this.medicationFormGroup
      .get('prescriberFax')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((prescriberFax) => {
        if (prescriberFax !== null) {
          this.lastFaxValue = prescriberFax;
        }
      });

    this.prescriber = this.medicationFormGroup.get('prescriber').value;
    if (this.prescriber.primaryFax) {
      this.medicationFormGroup
        .get('prescriberFax')
        .setValue(this.prescriber.primaryFax);
    }

    if (this.lineItem?.compound) {
      this.lineItem.drugDisplayName = 'Compound';
    }
  }

  openPrescriberModal() {
    this.prescriberModalService.showModal(this.prescriber.prescriberId);
  }

  previewLetter(medicationForm: LOMNLineItemFormValue) {
    if(!this.isFormInvalid()){
      this.previewLOMN.next(medicationForm);
    }
    else{
        Object.keys(this.medicationFormGroup.controls).forEach(key => {
          this.medicationFormGroup.get(key).markAllAsTouched();
          this.medicationFormGroup.get(key).updateValueAndValidity();
        });
    }

  }

  isFormInvalid() {
    if(this.medicationFormGroup &&  this.medicationFormGroup.invalid){
      return this.medicationFormGroup.invalid;
    }
    else{
      return false;
    }
  }
}
