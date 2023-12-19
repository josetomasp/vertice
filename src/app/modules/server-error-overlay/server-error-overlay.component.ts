import { Component, Inject } from '@angular/core';
import {
  SERVER_ERROR_OVERLAY_DATA,
  ServerErrorOverlayData
} from '@modules/server-error-overlay/server-error-overlay.data';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';

@Component({
  templateUrl: './server-error-overlay.component.html',
  styleUrls: ['./server-error-overlay.component.scss']
})
export class ServerErrorOverlayComponent {
  faAlert = faExclamationTriangle;

  constructor(
    @Inject(SERVER_ERROR_OVERLAY_DATA) public data: ServerErrorOverlayData
  ) {
  }
}
