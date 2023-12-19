import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'healthe-generic-wizard-footer',
  templateUrl: './generic-wizard-footer.component.html',
  styleUrls: ['./generic-wizard-footer.component.scss']
})
export class GenericWizardFooterComponent implements OnInit {
  @Input()
  showBackButton: boolean;
  @Input()
  showNextButton: boolean;
  @Input()
  showSubmitButton: boolean;
  @Input()
  disableSubmitButton: boolean;

  @Output()
  next = new EventEmitter();
  @Output()
  back = new EventEmitter();
  @Output()
  submit = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }
}
