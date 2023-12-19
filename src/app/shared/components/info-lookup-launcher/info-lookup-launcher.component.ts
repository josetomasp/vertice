import { Component, Input, OnInit } from '@angular/core';
import { DrugInfoModalService } from '../drug-info-modal/drug-info-modal.service';
import { PrescriberModalService } from '../prescriber-lookup-modal/prescriber-modal.service';
import { PharmacyModalService } from '../pharmacy-lookup-modal/pharmacy-modal.service';
import { MatDialog } from '@angular/material/dialog';
import { CompoundModalComponent } from '@shared/components/compound-modal/compound-modal.component';
import { CompoundModalData } from '@shared';

export interface DrugLookup {
  drugID: string;
  quantity: number;
  drugDate: string;
}

@Component({
  selector: 'healthe-info-lookup-launcher',
  templateUrl: './info-lookup-launcher.component.html',
  styleUrls: ['./info-lookup-launcher.component.scss']
})
/**
 * Provides a popup modal for prescriber, pharmacy or drug lookup.
 * Provide only ONE of these inputs.
 */
export class InfoLookupLauncherComponent implements OnInit {
  constructor(
    public drugLookupService: DrugInfoModalService,
    public prescriberModalService: PrescriberModalService,
    public pharmacyModalService: PharmacyModalService,
    public dialog: MatDialog
  ) {}

  @Input()
  displayText;

  @Input()
  prescriberID: string = null;

  @Input()
  drugLookup: DrugLookup = null;

  @Input()
  nabp: any = null;

  @Input()
  compoundDetails: CompoundModalData = null;

  public isLinkEnabled = false;
  public pendoID: string = 'UnknownType';

  ngOnInit() {
    if (null != this.prescriberID && this.prescriberID.trim() !== '') {
      this.isLinkEnabled = true;
      this.pendoID = 'prescriberLookupModalTrigger';
    } else {
      if (null != this.drugLookup) {
        if (
          null != this.drugLookup.drugID &&
          this.drugLookup.drugID.trim() !== ''
        ) {
          this.isLinkEnabled = true;
          this.pendoID = 'drugLookupModalTrigger';
        }
      } else if (this.nabp && this.nabp !== 'No Nabp') {
        this.isLinkEnabled = true;
        this.pendoID = 'pharmacyLookupModalTrigger';
      } else if (null != this.compoundDetails) {
        this.isLinkEnabled = true;
        this.pendoID = 'drugLookupModalTrigger';
      }
    }
  }

  public showModal(event: Event) {
    // This is to stop some outer components click event from firing, ie: the expand / collapse in the header of an expansion panel.
    event.preventDefault();
    event.stopPropagation();

    if (null != this.prescriberID) {
      this.prescriberModalService.showModal(this.prescriberID);
    } else if (this.drugLookup) {
      this.drugLookupService.showDrugInfoModal(
        this.drugLookup.drugID,
        this.drugLookup.drugDate,
        this.drugLookup.quantity
      );
    } else if (this.nabp) {
      // If it is a pharmacy lookup
      let localNabp = this.nabp;

      // For pending activities the nabp comes as an array of strings
      // The current modal only handles 1 entity.
      if (Array.isArray(this.nabp) && this.nabp.length > 0) {
        localNabp = this.nabp[0];
      }
      this.pharmacyModalService.showModal(localNabp);
    } else if (this.compoundDetails) {
      this.dialog.open(CompoundModalComponent, {
        autoFocus: false,
        width: '700px',
        data: this.compoundDetails
      });
    }
  }
}
