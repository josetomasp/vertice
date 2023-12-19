import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

@Component({
  templateUrl: './server-error-modal.component.html',
  styleUrls: ['./server-error-modal.component.scss']
})
export class ServerErrorModalComponent implements OnInit {
  faExclamationTriangle = faExclamationTriangle;
  faTimes = faTimes;

  constructor(@Inject(MAT_DIALOG_DATA) public errorMessages: string[] = []) {
  }

  ngOnInit(): void {
  }

}
