import { Injectable } from '@angular/core';
import { datadogRum } from '@datadog/browser-rum';
import { VerticeRumService } from '@modules/rum/vertice-rum.service';
export interface ITrackIgnoredFeatureService {
  registerFeature(featureName: string): void;
  markFeatureInteracted(featureName: string): void;
  sendTrackEvent(eventName: string): void;
}
@Injectable({ providedIn: 'any' })
export class TrackIgnoredFeatureService implements ITrackIgnoredFeatureService {
  /**
   * Bucket for registered feature names
   * When a tagged element is registered, an entry is made with a default value
   * of true, indicated it is "ignored"
   *
   * if an element tagged with the feature name is interacted with, that entry's
   * value is flipped
   */
  ignoredFeatures = {};
  constructor(private rumService: VerticeRumService) {

  }

  /**
   * TrackIgnoredFeatureDirective calls on init to register itself
   * @param featureName
   */
  registerFeature(featureName: string) {
    this.ignoredFeatures[featureName] = true;
    if (!window.pendo) {
      console.warn("Pendo wasn't found! registerFeature...", featureName);
    }
  }

  /**
   * TrackIgnoredFeatureDirective calls this on click to mark itself interacted
   * @param featureName
   */
  markFeatureInteracted(featureName: string) {
    this.ignoredFeatures[featureName] = false;
  }

  /**
   * TrackIgnoredFeatureTriggerDirective calls this when clicked
   */
  sendTrackEvent(eventName: string) {
    this.rumService.emitEvent(eventName, {...this.ignoredFeatures});
  }
}
