import { Component, Input, OnInit } from '@angular/core';
import { HealtheComponentConfig } from '@modules/healthe-grid';

@Component({
  selector: 'healthe-prescription-details',
  templateUrl: './prescription-details.component.html',
  styleUrls: ['./prescription-details.component.scss']
})
export class PrescriptionDetailsComponent implements OnInit {
  @Input()
  componentConfig: HealtheComponentConfig;

  constructor() {}

  ngOnInit() {
  }
}
