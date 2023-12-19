import { Component, Inject, Input, OnInit } from '@angular/core';
import { PrescriberInformationLookupModel } from '@modules/prescriber-information-lookup';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormGroupName,
  Validators
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ListOfPrescribersModalComponent } from '@modules/prescriber-information-lookup/list-of-prescribers-modal/list-of-prescribers-modal.component';
import { Prescriber } from '@shared/models/prescriber';
import {
  FormGroupNamePassThrough,
  getParentFormGroup,
  getParentPath
} from '@modules/form-validation-extractor';

@Component({
  selector: 'healthe-prescriber-information-lookup',
  templateUrl: './prescriber-information-lookup.component.html',
  styleUrls: ['./prescriber-information-lookup.component.scss']
})
export class PrescriberInformationLookupComponent
  implements FormGroupNamePassThrough, OnInit
{
  prescriberValues: PrescriberInformationLookupModel = {
    prescriberFirstName: '',
    prescriberId: '',
    prescriberLastName: '',
    prescriberPhone: ''
  };

  public get parentFormGroup(): FormGroup {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  public get parentPath(): string[] {
    return getParentPath(this.parent);
  }

  @Input()
  index: number = 0;

  @Input()
  readonly: boolean = false;

  @Input()
  set fieldValues(value: PrescriberInformationLookupModel) {
    if (
      this.parentFormGroup &&
      Object.keys(this.parentFormGroup.controls).length === 0
    ) {
      this.parentFormGroup.addControl(
        'prescriberId',
        new FormControl('', Validators.required)
      );

      this.parentFormGroup.addControl(
        'prescriberFirstName',
        new FormControl('', Validators.required)
      );

      this.parentFormGroup.addControl(
        'prescriberLastName',
        new FormControl('', Validators.required)
      );

      this.parentFormGroup.addControl(
        'prescriberPhone',
        new FormControl('', Validators.required)
      );
    }

    if (null != value) {
      this.prescriberValues = value;
      this.parentFormGroup.setValue(value);
    }
  }

  constructor(
    public dialog: MatDialog,
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {}

  ngOnInit(): void {}

  openPrescriberModal() {
    this.dialog
      .open(ListOfPrescribersModalComponent, {
        autoFocus: false,
        width: '800px',
        data: {
          NPI: this.parentFormGroup.get('prescriberId').value,
          FirstName: this.parentFormGroup.get('prescriberFirstName').value,
          LastName: this.parentFormGroup.get('prescriberLastName').value
        }
      })
      .afterClosed()
      .subscribe((chosenPrescriber: Prescriber) => {
        if (chosenPrescriber) {
          this.parentFormGroup
            .get('prescriberId')
            .setValue(chosenPrescriber.npi);
          this.parentFormGroup
            .get('prescriberFirstName')
            .setValue(chosenPrescriber.firstName);
          this.parentFormGroup
            .get('prescriberLastName')
            .setValue(chosenPrescriber.lastName);
          this.parentFormGroup
            .get('prescriberPhone')
            .setValue(
              chosenPrescriber.primaryPhone
                ? chosenPrescriber.primaryPhone.split('-').join('')
                : ''
            );
        }
      });
  }
}
