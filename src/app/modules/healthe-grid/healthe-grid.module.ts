import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HealtheGridComponent } from './healthe-grid/healthe-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskModule } from 'ngx-mask';
import {
  FormValidationExtractorModule
} from '@modules/form-validation-extractor';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [HealtheGridComponent],
  exports: [HealtheGridComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule,
    FormValidationExtractorModule,
    SharedModule
  ]
})
export class HealtheGridModule {}
