import { InjectionToken } from '@angular/core';

export interface ServerErrorOverlayData {
  errorMessages?: string[];
  retryCallback?: () => void;
}

export const SERVER_ERROR_OVERLAY_DATA: InjectionToken<ServerErrorOverlayData> =
  new InjectionToken('HEALTHE_SERVER_ERROR_DATA');
