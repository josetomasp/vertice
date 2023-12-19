import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LOMNLineItemFormValue } from '../../../../../store/models/create-lomn.models';
import {
  AuthorizationLineItem,
  AuthorizationLineItemPrescriber
} from '../../../../../store/models/pbm-authorization-information.model';
import { takeUntil } from 'rxjs/operators';
import { PrescriberModalService } from '../../../../../prescriber-lookup-modal/prescriber-modal.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'healthe-lomn-medication-preview-card',
  templateUrl: './lomn-medication-preview-card.component.html',
  styleUrls: ['./lomn-medication-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnMedicationPreviewCardComponent
  implements OnInit, OnDestroy {
  @Input()
  $index: number;
  @Input()
  medicationFormGroup: FormGroup;
  @Input()
  letterType: string;
  @Input()
  disablePreviewButton: boolean;
  @Input()
  maxNotesCharacters: number = 1000;
  @Input()
  lineItem: AuthorizationLineItem;

  @Output()
  previewLOMN: EventEmitter<LOMNLineItemFormValue> = new EventEmitter<
    LOMNLineItemFormValue
  >();
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
  }
  onDestroy$ = new Subject();
  ngOnDestroy () {
    this.onDestroy$.next();
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

    if (this.lineItem && this.lineItem.compound) {
      this.lineItem.drugDisplayName = 'Compound';
    }
  }

  openPrescriberModal() {
    this.prescriberModalService.showModal(
      this.medicationFormGroup.value.prescriber.prescriberId
    );
  }

  previewLetter(medicationForm: LOMNLineItemFormValue) {
    this.previewLOMN.next(medicationForm);
  }
}
