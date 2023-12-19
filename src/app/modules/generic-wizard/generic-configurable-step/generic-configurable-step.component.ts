import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input, OnDestroy,
  Optional
} from '@angular/core';
import {
  GenericConfigurableStepConfig,
  GenericFormFieldType
} from '@modules/generic-wizard/generic-wizard.models';
import {
  AbstractFormGroupNamePassThrough,
  getParentFormGroup,
  getParentPath
} from '@modules/form-validation-extractor';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormGroupName
} from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'healthe-generic-configurable-step',
  templateUrl: './generic-configurable-step.component.html',
  styleUrls: ['./generic-configurable-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericConfigurableStepComponent<StepConfig>
  implements AbstractFormGroupNamePassThrough, OnDestroy
{
  @Input()
  config: GenericConfigurableStepConfig<StepConfig>;

  constructor(
    @Inject(ControlContainer) @Optional() public parent: FormGroupName,
    @Inject(FormGroupDirective)
    @Optional()
    public formGroupDirective: FormGroupDirective
  ) {}

  get parentFormGroup(): FormGroup | null {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  get parentPath(): string[] {
    return getParentPath(this.parent);
  }

  protected readonly GenericFormFieldType = GenericFormFieldType;
  onDestroy$: Subject<void> = new Subject();

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
