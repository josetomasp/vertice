import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'healthe-ordering-prescriber-information',
  templateUrl: './ordering-prescriber-information.component.html',
  styleUrls: ['./ordering-prescriber-information.component.scss']
})
export class OrderingPrescriberInformationComponent implements OnInit {
  @Input()
  parentFormGroup: FormGroup;

  constructor() {}

  ngOnInit() {}
}
