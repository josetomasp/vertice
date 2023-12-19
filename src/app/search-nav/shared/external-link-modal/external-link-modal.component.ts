import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'healthe-external-link-modal',
  templateUrl: './external-link-modal.component.html',
  styleUrls: ['./external-link-modal.component.scss']
})
export class ExternalLinkModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public link) {}

  ngOnInit() {}
}
