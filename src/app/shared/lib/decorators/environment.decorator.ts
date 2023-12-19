import { get, has } from 'lodash';
import { environment } from '../../../../environments/environment';

/**
 *  Wires a property to the environment file.
 *  If no property name is supplied, it uses actual
 *  target properties name.
 *  WARNING... Not supplying a property name will not
 *  give deep properties.
 *
 */

export function Environment(environmentPropertyName?: string) {
  return function decorator(target, propertyName) {
    if (!environmentPropertyName) {
      environmentPropertyName = propertyName;
    }
    Object.defineProperty(target, propertyName, {
      get: () => {
        if (!has(environment, environmentPropertyName)) {
          console.warn(
            `[${
              target.constructor.name
            }] property ${propertyName} was assigned to environment.${environmentPropertyName} but no property was found in 'envrionment.ts'! You can supply a property name in the @Environment() decorator. Dot notated properties are allowed.`
          );
        } else {
          return get(environment, environmentPropertyName);
        }
      }
    });
  };
}
