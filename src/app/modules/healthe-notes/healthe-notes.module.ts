import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealtheNotesComponent } from './healthe-notes/healthe-notes.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [HealtheNotesComponent],
  exports: [HealtheNotesComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatInputModule,
    FlexModule,
    MatButtonModule
  ]
})
export class HealtheNotesModule {}
