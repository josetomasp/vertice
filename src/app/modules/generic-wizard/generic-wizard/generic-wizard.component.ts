import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {
  GenericErrorInfo,
  GenericStepConfig,
  GenericStepType,
  GenericWizardServiceConfigMap,
  GenericWizardStatus
} from '@modules/generic-wizard/generic-wizard.models';
import { Observable } from 'rxjs';
import {
  GenericWizardServiceConfigMapToken
} from '../generic-wizard-service-config-map.token';
import {
  GenericWizardStore
} from '@modules/generic-wizard/generic-wizard.store';
import {
  FormValidationExtractorService
} from '@modules/form-validation-extractor';
import {
  GenericStepStateReporterDirective
} from '@modules/generic-wizard/generic-step-label/generic-step-state-reporter.directive';
import { first } from 'rxjs/operators';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { faFlag } from '@fortawesome/pro-light-svg-icons';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'healthe-generic-wizard',
  templateUrl: './generic-wizard.component.html',
  styleUrls: ['./generic-wizard.component.scss'],
  providers: [GenericWizardStore, FormValidationExtractorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericWizardComponent<FormState = { [key: string]: any }> {
  @ViewChild('stepper', { read: GenericStepStateReporterDirective })
  private stepStateReporter: GenericStepStateReporterDirective;

  @Output()
  begin: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  deleteService: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  submitEvent = new EventEmitter<FormState>();
  protected readonly GenericStepType = GenericStepType;
  private _serviceType!: string;

  protected readonly GenericWizardStatus = GenericWizardStatus;
  protected readonly faCheck = faCheck;
  protected readonly faFlag = faFlag;

  @Input()
  errorInfoCardState: { errorTitle: string; errorInfoList: GenericErrorInfo[] };

  get serviceType(): string {
    return this._serviceType ?? '';
  }

  @Input()
  set serviceType(serviceType: string) {
    this._serviceType = serviceType;
    if (this.config instanceof Observable) {
      (this.config as Observable<any>).subscribe((config) => {
        this.store.init(config[serviceType]);
      });
    } else {
      this.store.init(this.config[serviceType]);
    }
    if (this.stepStateReporter) {
      this.stepStateReporter.reinitialize();
    }
    this.changeDetectorRef.detectChanges();
  }

  onSubmit() {
    this.submitEvent.emit(this.store.formGroup.value);
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public store: GenericWizardStore<FormState>,
    public formValidationExtractorService: FormValidationExtractorService,
    @Inject(GenericWizardServiceConfigMapToken)
    public config:
      | GenericWizardServiceConfigMap
      | Observable<GenericWizardServiceConfigMap>
  ) {
  }

  toggleExpanded(wizardStatus: GenericWizardStatus) {
    if (wizardStatus === GenericWizardStatus.NotStarted) {
      this.begin.emit();
    }
    this.store.toggleWizardExpansion();
  }

  clearErrors() {
    this.errorInfoCardState = null;
    this.changeDetectorRef.detectChanges();
  }

  goToStepByFormPath(formPath: string) {
    this.store
      .getStepIndexByFormPath(formPath)
      .pipe(first())
      .subscribe((stepIndex) => {
        this.stepStateReporter.matStepper.selectedIndex = stepIndex;
      });
  }

  submit(successMessage?: string, warningMessage?: string) {
    this.store.submit({ successMessage, warningMessage });
  }

  getAbstractControl(step: GenericStepConfig): AbstractControl {
    return this.store.formGroup.get(step.stepName) ?? new FormControl();
  }
}
