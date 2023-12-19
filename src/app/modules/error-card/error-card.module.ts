import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorCardComponent } from './error-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const DECLARATION_EXPORTS = [ErrorCardComponent];

@NgModule({
  declarations: [...DECLARATION_EXPORTS],
  exports: [...DECLARATION_EXPORTS],
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    FlexLayoutModule,
    FontAwesomeModule
  ]
})
export class ErrorCardModule {}
