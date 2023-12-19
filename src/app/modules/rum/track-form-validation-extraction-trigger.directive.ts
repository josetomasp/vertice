import { Directive, HostListener, Input, OnInit } from '@angular/core';
import {
  TrackFormValidationExtractionService
} from '@modules/rum/track-form-validation-extraction.service';

@Directive({ selector: '[trackFormValidationExtractionTrigger]' })
export class TrackFormValidationExtractionTriggerDirective {
  constructor(private trackFormValidationExtractionService: TrackFormValidationExtractionService) {}
  @Input('trackFormValidationExtractionTrigger')
  eventName: string;
  @HostListener('click', ['$event'])
  private onClick() {
    this.trackFormValidationExtractionService.sendTrackEvent(this.eventName);
  }
}
