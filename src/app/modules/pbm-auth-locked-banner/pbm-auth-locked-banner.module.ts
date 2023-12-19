import { NgModule } from '@angular/core';
import { PbmAuthLockedBannerComponent } from '@modules/pbm-auth-locked-banner/pbm-auth-locked-banner.component';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    FlexModule,
    MatButtonModule,
    FontAwesomeModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [PbmAuthLockedBannerComponent],
  exports: [PbmAuthLockedBannerComponent]
})
export class PbmAuthLockedBannerModule {}
