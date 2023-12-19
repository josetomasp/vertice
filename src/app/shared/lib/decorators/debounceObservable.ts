import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Adds a debounce to an observable
 *
 * @example
 * ```javascript
 *
 * export class SomeClass {
 *
 *   @debounce$(1000)
 *   someVal$: Observable<string> = this.someSource;
 *
 *   constructor(public someSource) {
 *     // will only emit after 1000 milliseconds
 *     this.someVal$.subscribe(val => console.log(val));
 *   }
 * }
 *
 * ```
 */
export function debounce$(milliseconds: number) {
  return function decorator(target, property) {
    let propertyValue;
    Object.defineProperty(target, property, {
      get: () => {
        return propertyValue;
      },
      set: (val) => {
        if (val instanceof Observable) {
          propertyValue = val.pipe(debounceTime(milliseconds));
        } else {
          propertyValue = val;
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}
