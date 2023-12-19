import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

/**
 * Supplies the first value of an observable
 * that is not empty, then unsubscribes.
 *
 * @example
 * ```javascript
 *
 * export class SomeClass {
 *
 *   @once$()
 *   someVal$: Observable<string> = this.someSource;
 *
 *   constructor(public someSource) {
 *     // will only get one value that isnt empty;
 *     this.someVal$.subscribe(val => console.log(val));
 *   }
 * }
 *
 * ```
 */
export function once$(target, propertyKey) {
  let propertyValue;

  function getter() {
    return propertyValue;
  }

  function setter(value: Observable<any>) {
    value.pipe(
      first((val) => {
        return !_.isEmpty(val);
      })
    );
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}
