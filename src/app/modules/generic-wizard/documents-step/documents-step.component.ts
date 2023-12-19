import { Component, Inject, OnDestroy, Optional } from '@angular/core';
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
  selector: 'healthe-documents-step',
  templateUrl: './documents-step.component.html',
  styleUrls: ['./documents-step.component.scss']
})
export class DocumentsStepComponent
  implements AbstractFormGroupNamePassThrough, OnDestroy
{
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

  onDestroy$: Subject<void> = new Subject();

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
