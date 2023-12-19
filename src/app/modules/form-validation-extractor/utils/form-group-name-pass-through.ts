import {
  ControlContainer,
  FormGroup,
  FormGroupDirective
} from '@angular/forms';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

/**
 * The intention around this abstract class is to use it in scenarios where you
 * need to use a formGroupName directive on a sub component that has a form inside,
 * and you need to preserve the form path.
 *
 * You can choose to extend the abstract class, or implement the interface it if there are other base
 * classes already implemented with the caveat that you will have to reimplement
 * the
 *
 * @example
 * ```html app.component.html
 * <div [formGroup]="orderFormGroup">
 *   <ng-container [formArrayName]="'pizzas'">
 *     <sub-form-component
 *     *ngFor="let group of pizzas.controls; index as $index"
 *     [formGroupName]="$index"
 *     >
 *     </sub-form-component>
 *   </ng-container>
 * </div>
 * ```
 * @example
 * ```typescript sub-form.component.ts
 * @Component(...)
 *
 * export class SubFormComponent extends AbstractFormGroupNamePassThrough {
 *
 *   constructor(
 *         @Inject(ControlContainer) public parent: FormGroupName,
 *         @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
 *   ) {super();}
 *
 * }
 * ```
 */
export abstract class AbstractFormGroupNamePassThrough
  extends DestroyableComponent
  implements FormGroupNamePassThrough
{
  abstract formGroupDirective: FormGroupDirective;
  abstract parent: ControlContainer;

  public get parentFormGroup(): FormGroup | null {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  public get parentPath(): string[] {
    return getParentPath(this.parent);
  }
}

export interface FormGroupNamePassThrough {
  formGroupDirective: FormGroupDirective;
  parent: ControlContainer;
  parentFormGroup: FormGroup;
  parentPath: string[];
}

export function getParentFormGroup(
  formGroupDirective: FormGroupDirective,
  parent: ControlContainer
): FormGroup {
  return formGroupDirective.form.get(parent.path) as FormGroup;
}

export function getParentPath(parent ?: ControlContainer): string[] {
  return parent?.path ?? [];
}
