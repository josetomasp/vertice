import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerConfigsLabelComponent } from './customer-configs-label/customer-configs-label.component';
import { DisableElementIfTrueDirective } from './disable-element-if-true.directive';
import { FeatureFlagService } from './feature-flag.service';
import { RemoveElementIfTrueDirective } from './remove-element-if-true.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    RemoveElementIfTrueDirective,
    DisableElementIfTrueDirective,
    CustomerConfigsLabelComponent
  ],
  exports: [
    RemoveElementIfTrueDirective,
    DisableElementIfTrueDirective,
    CustomerConfigsLabelComponent
  ],
  providers: [FeatureFlagService]
})
export class CustomerConfigsModule {}
