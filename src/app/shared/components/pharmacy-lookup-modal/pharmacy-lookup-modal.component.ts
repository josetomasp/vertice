import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Pharmacy,
  PharmacyDisplayItem,
  PharmacyModalData
} from '@shared/models/pharmacy';

@Component({
  selector: 'healthe-pharmacy-lookup-modal',
  templateUrl: './pharmacy-lookup-modal.component.html',
  styleUrls: ['./pharmacy-lookup-modal.component.scss']
})
export class PharmacyLookupModalComponent implements OnInit {
  pharmacyInfo: Partial<PharmacyDisplayItem>[] = [
    {
      fieldName: 'name',
      label: 'PHARMACY NAME',
      isArray: false
    },
    {
      fieldName: 'address',
      label: 'ADDRESS',
      isArray: true
    },
    {
      fieldName: 'nabp',
      label: 'PHARMACY NCPDP',
      isArray: false
    },
    {
      fieldName: 'phoneNumber',
      label: 'PHONE NUMBER',
      isArray: false
    },
    {
      fieldName: 'faxNumber',
      label: 'FAX NUMBER',
      isArray: false
    },
    // Added an empty one so flex thinks there are 3
    // items in the row and ends up aligning the
    // fax number where it should be
    {
      fieldName: '',
      label: '',
      isArray: false
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<PharmacyLookupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public pharmacyData: PharmacyModalData
  ) {}

  ngOnInit() {
    this.marshalPharmacyInfo(this.pharmacyData.pharmacy);
  }

  marshalPharmacyInfo(prescriberData: Pharmacy) {
    this.pharmacyInfo.forEach((item) => {
      item.fieldValue = prescriberData[item.fieldName];
    });
  }
}
