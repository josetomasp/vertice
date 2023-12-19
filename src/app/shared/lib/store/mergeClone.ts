import { cloneDeep, isArray, mergeWith } from 'lodash';

/**
 * @deprecated avoid using this because it's terribly inefficient
 *
 * Take source clone object and deep merge.
 *
 * @example
 * ``` typescript
 * const a = { x: 'y', z: { w: 'a' }}
 * const b = { x: '', z: {} }
 * const c = mergeClone(a, b);
 * // outputs {x: 'y', z: { w: 'a'}}
 * ```
 */
export function mergeClone(obj, assignment) {
  return mergeWith(cloneDeep(obj), assignment, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return srcValue;
    }
  });
}
