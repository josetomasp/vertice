import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriberInformationLookupComponent } from './prescriber-information-lookup/prescriber-information-lookup.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormValidationExtractorModule
} from '@modules/form-validation-extractor';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';
import {
  ListOfPrescribersModalComponent
} from './list-of-prescribers-modal/list-of-prescribers-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '@shared';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    PrescriberInformationLookupComponent,
    ListOfPrescribersModalComponent
  ],
  exports: [PrescriberInformationLookupComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormValidationExtractorModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMaskModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class PrescriberInformationLookupModule {}
