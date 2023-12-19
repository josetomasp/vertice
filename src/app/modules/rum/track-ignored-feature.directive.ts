import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { TrackIgnoredFeatureService } from '@modules/rum/track-ignored-feature.service';

@Directive({ selector: '[trackIgnoredFeature]' })
export class TrackIgnoredFeatureDirective implements OnInit {
  constructor(private trackIgnoredFeatureService: TrackIgnoredFeatureService) {}
  @Input('trackIgnoredFeature')
  featureName: string;
  @HostListener('click', ['$event'])
  private onClick() {
    this.trackIgnoredFeatureService.markFeatureInteracted(this.featureName);
  }
  ngOnInit() {
    this.trackIgnoredFeatureService.registerFeature(this.featureName);
  }
}
