import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { TrackIgnoredFeatureService } from '@modules/rum/track-ignored-feature.service';

@Directive({ selector: '[trackIgnoredFeatureTrigger]' })
export class TrackIgnoredFeatureTriggerDirective {
  constructor(private trackIgnoredFeatureService: TrackIgnoredFeatureService) {}
  @Input('trackIgnoredFeatureTrigger')
  eventName: string;
  @HostListener('click', ['$event'])
  private onClick() {
    this.trackIgnoredFeatureService.sendTrackEvent(this.eventName);
  }
}
