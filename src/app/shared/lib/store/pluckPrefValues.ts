import { Preference } from '../../../preferences/store/models/preferences.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PreferenceBundle {
  [key: string]: Preference<any>;

  [key: number]: Preference<any>;
}

export interface ValueBundle {
  [key: string]: any;

  [key: number]: any;
}

/**
 * Transforms object of preferencesStore into an object of values
 *
 *
 *
 * @example
 * pluckPrefValue()
 * // returns {pageSize: 25, leftNavOpened: true}
 *
 *
 * @example
 * const observable = of({pageSize: {id: 252, value: 25}, leftNavOpened: {id: 215, value: true}})
 * observable.pipe(pluckPrefValue).subscribe(valueBundle => {
 *   console.log(valueBundle);
 * })
 * // returns {pageSize: 25, leftNavOpened: true}
 */

function _pluckPrefValues(raw: PreferenceBundle): ValueBundle {
  const valueBundle = {};
  Object.keys(raw).forEach((key) => {
    valueBundle[key] = raw[key].value;
  });
  return valueBundle;
}

export function pluckPrefValues(raw: PreferenceBundle): ValueBundle;
export function pluckPrefValues(
  raw: Observable<PreferenceBundle>
): Observable<ValueBundle>;
export function pluckPrefValues(
  raw: PreferenceBundle | Observable<PreferenceBundle>
): ValueBundle | Observable<ValueBundle> {
  if (raw instanceof Observable) {
    return raw.pipe(
      map((oRaw) => {
        return _pluckPrefValues(oRaw);
      })
    );
  } else {
    return _pluckPrefValues(raw);
  }
}
