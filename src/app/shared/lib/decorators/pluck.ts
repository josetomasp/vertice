/**
 *  Gets the property and returns it in the observable.
 */
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

export function pluck$<T>(propertyName: string) {
  return function decorator(target, property) {
    let propertyValue;
    Object.defineProperty(target, property, {
      get: (): Observable<T> => {
        if (propertyValue instanceof Observable) {
          return propertyValue.pipe(pluck(propertyName));
        } else {
          return propertyValue;
        }
      },
      set: (value) => {
        propertyValue = value;
      }
    });
  };
}
