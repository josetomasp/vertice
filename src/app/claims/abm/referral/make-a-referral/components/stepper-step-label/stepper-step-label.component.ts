import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  faCheckCircle,
  faExclamationCircle,
  IconDefinition
} from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'healthe-stepper-step-label',
  templateUrl: './stepper-step-label.component.html',
  styleUrls: ['./stepper-step-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperStepLabelComponent implements OnInit, OnChanges {
  @Input() labelClass: string;
  @Input() iconClass: string;
  @Input() serviceName: string;
  @Input()
  step: {
    label: string;
    name: string;
  };
  icon: IconDefinition;
  constructor() {}
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.iconClass) {
      const iconClass = changes.iconClass.currentValue;
      if (iconClass === 'valid') {
        this.icon = faCheckCircle;
      } else {
        this.icon = faExclamationCircle;
      }
    }
  }
}
