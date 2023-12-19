import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'healthe-reasons-modal',
  templateUrl: './reasons-modal.component.html',
  styleUrls: ['./reasons-modal.component.scss']
})
export class ReasonsModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public reasons) {}

  ngOnInit() {}
}
