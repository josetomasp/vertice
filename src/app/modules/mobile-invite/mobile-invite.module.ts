import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MobileInviteModalComponent } from './mobile-invite-modal/mobile-invite-modal.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskModule } from 'ngx-mask';
import {
  MobileInviteService
} from '@modules/mobile-invite/mobile-invite-modal/mobile-invite.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [MobileInviteModalComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveComponentModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    NgxMaskModule,
    MatTooltipModule
  ],
  providers: [MobileInviteService]
})
export class MobileInviteModule {}
