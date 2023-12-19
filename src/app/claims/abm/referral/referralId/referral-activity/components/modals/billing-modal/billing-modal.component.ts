import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getNumericSuffix } from '@shared';
import { TransportationModalType } from '../../../../../store/models';

interface BillingLineItem {
  service: string;
  quantity: string;
  unitOfMeasure: string;
  cost: string;
}
interface BillingSet {
  lineItems: BillingLineItem[];
  total: string;
}

interface BillingData {
  billingSet: BillingSet[];
  billRequestedDate: string;
  billSubmittedDate: string;
  healthePaidDate: string;
  vendorPaidDate: string;
  providerPaid: string;
}

@Component({
  selector: 'healthe-billing-modal',
  templateUrl: './billing-modal.component.html',
  styleUrls: ['./billing-modal.component.scss']
})
export class BillingModalComponent implements OnInit {
  TransportationModalType = TransportationModalType;
  itineraryData: BillingData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData,
    public dialogRef: MatDialogRef<BillingModalComponent>
  ) {
    this.itineraryData = modalData['itineraryData'];
  }

  ngOnInit() {}

  getTitleLine(index: number): string {
    index++;
    return index.toString() + getNumericSuffix(index) + ' Leg';
  }
}
