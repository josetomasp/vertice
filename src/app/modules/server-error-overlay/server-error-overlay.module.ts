import { NgModule } from '@angular/core';
import {
  ServerErrorOverlayAnchorDirective
} from '@modules/server-error-overlay/server-error-overlay-anchor.directive';
import {
  ServerErrorOverlayComponent
} from '@modules/server-error-overlay/server-error-overlay.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ServerErrorOverlayAnchorDirective, ServerErrorOverlayComponent],
  exports: [ServerErrorOverlayAnchorDirective, ServerErrorOverlayComponent],
  imports: [FontAwesomeModule, MatButtonModule, FlexLayoutModule, CommonModule]
})
export class ServerErrorOverlayModule {
}
