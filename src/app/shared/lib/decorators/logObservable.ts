import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Adds standard format of logging to an observable.
 * This will only work if the observable is subscribed to.
 * Format is [ ClassName :: propertyName ] : value
 *
 * @example
 *
 * export class SomeClass {
 *   public someData$: Observable<any> = this.someSource.get()
 *   constructor(public someSource) {}
 * }
 *
 */
export function log$(target: any, property: string) {
  let propertyValue;
  Object.defineProperty(target, property, {
    get: () => {
      return propertyValue;
    },
    set: (val) => {
      if (val instanceof Observable) {
        propertyValue = val.pipe(
          tap((result) => {
            if (
              (Array.isArray(result) && result.length > 0) ||
              (typeof result === 'object' && result != null)
            ) {
              console.log(
                `%c[${target.constructor.name} :: ${property}] :`,
                'color: #C00662'
              );
              console.table(result);
            } else {
              console.log(
                `%c[${target.constructor.name} :: ${property}] : ` +
                  `%c${result}`,
                'color: #C00662',
                'color: #bf2828;'
              );
            }
          })
        );
      } else {
        propertyValue = val;
      }
    },
    enumerable: true,
    configurable: true
  });
}
