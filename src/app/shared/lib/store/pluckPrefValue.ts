import { Preference } from '../../../preferences/store/models/preferences.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Plucks a value from a preference.
 *
 *
 *
 * @example
 * pluckPrefValue({id: 0, value: 25})
 * // returns 25
 *
 *
 * @example
 * const observable = of({id: 0, value: 25})
 * observable.pipe(pluckPrefValue).subscribe(valueBundle => {
 *   console.log(valueBundle);
 * })
 * // returns 25
 */

function _pluckPrefValue<T>(raw: Preference<T>): T {
  return raw ? raw.value : undefined;
}

export function pluckPrefValue<T>(
  raw: Observable<Preference<T>>
): Observable<T>;
export function pluckPrefValue<T>(raw: Preference<T>): T;
export function pluckPrefValue<T>(
  raw: Preference<T> | Observable<Preference<T>>
): T | Observable<T> {
  if (raw instanceof Observable) {
    return raw.pipe(
      map((oRaw) => {
        return _pluckPrefValue(oRaw);
      })
    );
  } else {
    return _pluckPrefValue(raw);
  }
}
