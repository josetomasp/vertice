import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  faCheckCircle,
  faExclamationCircle,
  IconDefinition
} from '@fortawesome/pro-light-svg-icons';
import {
  HealtheTooltipAdvancedPosition,
  HealtheTooltipAdvancedService
} from '@healthe/vertice-library';
import { GenericWizardStore } from '@modules/generic-wizard/generic-wizard.store';

@Component({
  selector: 'healthe-generic-step-label',
  templateUrl: './generic-step-label.component.html',
  styleUrls: ['./generic-step-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HealtheTooltipAdvancedService]
})
export class GenericStepLabelComponent implements OnInit {
  @Input()
  stepIndex: number;
  labelClass: string;
  @Input() serviceName: string;
  @Input()
  step: {
    label: string;
    name: string;
  };
  icon: IconDefinition;
  iconClass: string;
  protected readonly HealtheTooltipAdvancedPosition =
    HealtheTooltipAdvancedPosition;

  constructor(
    private store: GenericWizardStore<any>,
    private cdR: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.store.vm$.subscribe(
      ({ activeStepIndex, touchedSteps, validSteps }) => {
        const isActive = activeStepIndex === this.stepIndex;
        const isTouched = touchedSteps.includes(this.stepIndex);
        const isValid = validSteps.includes(this.stepIndex);
        if (isActive) {
          this.labelClass = 'selected';
          if (isTouched && isValid) {
            this.iconClass = 'valid';
            this.icon = faCheckCircle;
          } else if (isTouched && !isValid) {
            this.iconClass = 'invalid';
            this.icon = faExclamationCircle;
          } else {
            this.iconClass = 'default';
            this.icon = faExclamationCircle;
          }
        } else {
          if (isTouched && isValid) {
            this.labelClass = 'valid';
            this.iconClass = 'valid';
            this.icon = faCheckCircle;
          } else if (isTouched && !isValid) {
            this.labelClass = 'invalid';
            this.iconClass = 'invalid';
            this.icon = faExclamationCircle;
          } else if (!isTouched) {
            this.labelClass = 'default';
            this.iconClass = 'default';
            this.icon = faExclamationCircle;
          }
        }
        this.cdR.detectChanges();
      }
    );
  }
}
