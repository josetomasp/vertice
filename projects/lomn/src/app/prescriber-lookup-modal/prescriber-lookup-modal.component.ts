import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Prescriber,
  PrescriberDisplayItem,
  PrescriberModalData
} from '../store/models/prescriber';

@Component({
  selector: 'healthe-prescriber-lookup-modal',
  templateUrl: './prescriber-lookup-modal.component.html',
  styleUrls: ['./prescriber-lookup-modal.component.scss']
})
export class PrescriberLookupModalComponent implements OnInit {
  prescriberInfo: Partial<PrescriberDisplayItem>[] = [
    {
      fieldName: 'prescriberId',
      label: 'PRESCRIBER',
      isArray: false,
      columnWidth: 33.33,
      isPhone: false
    },
    {
      fieldName: 'specality',
      label: 'PRESCRIBER SPECIALTY',
      isArray: true,
      columnWidth: 44.44,
      isPhone: false
    },
    {
      fieldName: 'npi',
      label: 'NPI',
      columnWidth: 22.22,
      isPhone: false
    },
    {
      fieldName: 'orginization',
      label: 'ORGANIZATION',
      isArray: true,
      columnWidth: 95,
      isPhone: false
    },
    {
      fieldName: 'orginizationSpecality',
      label: 'ORGANIZATION SPECIALTY',
      isArray: true,
      columnWidth: 95,
      isPhone: false
    },
    {
      fieldName: 'primaryAddress',
      label: 'PRESCRIBER PRIMARY ADDRESS',
      isArray: true,
      columnWidth: 33.33,
      isPhone: false
    },
    {
      fieldName: 'primaryPhone',
      label: 'PRIMARY PHONE',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    },
    {
      fieldName: 'primaryAltPhone',
      label: 'ALT. PHONE',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    },
    {
      fieldName: 'primaryFax',
      label: 'PRIMARY FAX',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    },
    {
      fieldName: 'secondaryAddress',
      label: 'PRESCRIBER SECONDARY ADDRESS',
      isArray: true,
      columnWidth: 33.33,
      isPhone: false
    },
    {
      fieldName: 'secondaryPhone',
      label: 'SECONDARY PHONE',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    },
    {
      fieldName: 'secondaryAltPhone',
      label: 'SEC. ALT. PHONE',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    },
    {
      fieldName: 'secondaryFax',
      label: 'SECONDARY FAX',
      isArray: false,
      columnWidth: 22.22,
      isPhone: true
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<PrescriberLookupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public prescriberData: PrescriberModalData
  ) {}

  ngOnInit() {
    this.marshalprescriberInfo(this.prescriberData.prescriber);
  }

  marshalprescriberInfo(prescriberData: Prescriber) {
    this.prescriberInfo.forEach((item) => {
      if (item.fieldName === 'prescriberId') {
        item.fieldValue = this.prescriberData.prescriberId;
      } else {
        item.fieldValue = prescriberData[item.fieldName];
      }
    });
  }
}
