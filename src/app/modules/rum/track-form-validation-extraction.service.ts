import { Injectable } from '@angular/core';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { first } from 'rxjs/operators';
import { datadogRum } from '@datadog/browser-rum';
import { VerticeRumService } from '@modules/rum/vertice-rum.service';

@Injectable({ providedIn: 'any' })
export class TrackFormValidationExtractionService {
  constructor(
    private formValidationService: FormValidationExtractorService,
    private rumService: VerticeRumService
  ) {}

  sendTrackEvent(eventName: string) {
    this.formValidationService.errorMessages$
      .pipe(first())
      .subscribe((errorMessages) => {
        const payload = { errorCount: errorMessages.length };
        errorMessages.forEach((message) => {
          payload[message.path] = message.message;
        });
        /**
         * Pendo doesn't support the amount of data this would send
         */
        this.rumService.emitEvent(eventName, payload, {
          sendToPendo: false,
          sendToDataDog: true
        });
      });
  }
}
