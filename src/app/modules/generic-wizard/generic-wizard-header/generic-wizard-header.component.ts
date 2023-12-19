import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import {
  GenericWizardStatus
} from '@modules/generic-wizard/generic-wizard.models';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import {
  faChevronDown
} from '@fortawesome/pro-regular-svg-icons/faChevronDown';

@Component({
  selector: 'healthe-generic-wizard-header',
  templateUrl: './generic-wizard-header.component.html',
  styleUrls: ['./generic-wizard-header.component.scss']
})
export class GenericWizardHeaderComponent {
  @Input()
  expanded: boolean;
  @Input()
  serviceDisplayName: string;
  @Input()
  sectionStatus: GenericWizardStatus;
  @Input()
  referralOnly: boolean;

  @Input()
  expansionToggleLabel: string;

  @Output()
  delete = new EventEmitter<void>();
  @Output()
  toggleExpanded = new EventEmitter<void>();
  constructor() {}
  public readonly faTrashAlt = faTrashAlt;
  public readonly GenericStepperStatus = GenericWizardStatus;
  public readonly faChevronUp = faChevronUp;
  public readonly faChevronDown = faChevronDown;
}
