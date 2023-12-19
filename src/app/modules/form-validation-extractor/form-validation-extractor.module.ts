import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationExtractorDirective } from './form-validation-extractor.directive';

@NgModule({
  declarations: [FormValidationExtractorDirective],
  exports: [FormValidationExtractorDirective],
  imports: [CommonModule]
})
export class FormValidationExtractorModule {}
