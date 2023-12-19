import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { CustomerConfigNameValuePair } from './customer-configs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  shouldElementBeRemoved(
    componentGroupName: string,
    elementName: string
  ): boolean {
    return this.doElementConfigCheck(
      componentGroupName,
      elementName,
      'elementsToRemove'
    );
  }

  shouldElementBeDisabled(
    componentGroupName: string,
    elementName: string
  ): boolean {
    return this.doElementConfigCheck(
      componentGroupName,
      elementName,
      'elementsToDisable'
    );
  }

  labelChange(defaultName: string, elementName: string): string {
    const labelChanges = AppConfig?.customerConfigs?.labelChanges?.find(
      (i) => i.name === elementName
    );
    return labelChanges ? labelChanges.value : defaultName;
  }

  disableRouteIfTrue(routeName: string): boolean {
    const route = AppConfig?.customerConfigs?.routesToDisable?.find(
      (i) => i.name === routeName
    );
    return route ? !!route.value : false;
  }

  private doElementConfigCheck(
    componentGroupName,
    elementName,
    collectionName: 'elementsToDisable' | 'elementsToRemove'
  ) {
    let element: CustomerConfigNameValuePair;
    // Read the value from the config service
    const elementCollection = AppConfig.customerConfigs[collectionName].find(
      (i) => i.componentGroupName === componentGroupName
    );
    if (elementCollection) {
      element = elementCollection.elements.find((i) => i.name === elementName);
    }
    if (!element) {
      return false;
    }
    // Default to false so elements can be removed from list when implemented in all environments
    switch (typeof element.value) {
      case 'boolean':
        return element.value;
      case 'string':
        return element.value === 'true';
      default:
        return false;
    }
  }
}
