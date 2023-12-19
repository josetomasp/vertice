import { Directive, OnInit } from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { CreateNewAuthorizationService } from './create-new-authorization.service';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Directive()
export class CreateNewAuthorizationAbstractBaseComponent
  extends DestroyableComponent
  implements OnInit {
  formGroup: FormGroup = new FormGroup({});

  protected constructor(
    protected createNewAuthorizationServiceService: CreateNewAuthorizationService
  ) {
    super();
  }
  ngOnInit() {
    // The formGroup should be set in the sub-class init before this init method is called.
    this.buildFormGroup();

    this.createNewAuthorizationServiceService.addFormGroup(this.formGroup);

    this.createNewAuthorizationServiceService.showErrors$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
        this.formGroup.updateValueAndValidity();
      });

    this.createNewAuthorizationServiceService.saveFormData$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.saveFormData();
      });
  }

  protected buildFormGroup() {}
  protected saveFormData() {}
}
