import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData } from '@shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'healthe-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss']
})
export class InformationModalComponent implements OnInit {
  safeHTML: SafeHtml;
  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ModalData,
    private _sanitizer: DomSanitizer
  ) {
    if (null == modalData.affirmClass) {
      modalData.affirmClass = 'info-button';
    }

    this.safeHTML = this._sanitizer.bypassSecurityTrustHtml(modalData.bodyHtml);
  }

  ngOnInit() {}
}
