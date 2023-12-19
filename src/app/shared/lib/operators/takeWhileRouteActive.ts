import { Observable } from 'rxjs';
import { RootState } from '../../../store/models/root.models';
import { takeWhile } from 'rxjs/operators';

/**
 *
 * Prevents route selectors from running in contexts where those parameters don't apply
 *
 * Takes a route segment that, when the route switches, will close the observable
 * if that segment no longer exists in the url
 *
 * Should be used in the first position of a store$.pipe()
 *
 * @param routeSegment - a subset of the route that's used in an `includes`
 *
 *
 * @example
 * ```typescript
 * decodedClaimNumber$ = this.store$
 * .pipe(takeWhileRouteActive('pbm'), select(getDecodedClaimNumber));
 * ```
 */
export function takeWhileRouteActive<T>(routeSegment: string) {
  return function _takeUntilRouteDeactivate(
    observable: Observable<T>
  ): Observable<T> {
    return observable.pipe<T>(
      takeWhile((state: T) => {
        if (!state.hasOwnProperty('router')) {
          console.warn(
            "Couldn't find the router state. Is this the first operator in a store$.pipe()?"
          );
          return true;
        }
        return (state as unknown as RootState).router.state.url.includes(routeSegment);
      })
    );
  };
}
