import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'healthe-step-advancer',
  templateUrl: './step-advancer.component.html',
  styleUrls: ['./step-advancer.component.scss']
})
export class StepAdvancerComponent implements OnInit {
  @Input()
  continueDisabled: boolean;
  @Input()
  previousDisabled: boolean;
  @Input()
  showContinueButton: boolean = true;
  @Input()
  showSubmitButton: boolean = false;
  @Input()
  disableSubmitButton: boolean = true;
  @Output()
  continue: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  previous: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  submitButtonEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveAsDraftEvent: EventEmitter<any> = new EventEmitter<any>();



  constructor() {}

  ngOnInit() {}
}
