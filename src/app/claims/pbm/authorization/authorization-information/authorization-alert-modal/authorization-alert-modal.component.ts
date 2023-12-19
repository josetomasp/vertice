import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'healthe-authorization-alert-modal',
  templateUrl: './authorization-alert-modal.component.html',
  styleUrls: ['./authorization-alert-modal.component.scss']
})
export class AuthorizationAlertModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit() {}
}
