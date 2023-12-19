import {
  VerticeMediatedResponse
} from '../../models/vertice-mediated-response.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/component-store';
import { pipe } from 'rxjs';

export type VoidRequestCallback<T> = (data: T, isMediated?: boolean) => void;

/**
 * Provides a consistent way to handle http responses from mediated endpoints.
 * Expects this is being used in the pipe of a service call returning HttpResponse<SuccessResponse>
 *
 * @param successCb - returns if the request returns 200 and unwraps the HttpResponse
 * @param errorOrPartialCb - returns the 206 mediated response and 500 if the third callback isn't provided.
 * @param errorCb - returns only if 500, Assumes response returns ProblemDetail
 *
 *
 * @example ``` typescript
 *
 *  class SomeStore extends ComponentStore<object> {
 *
 *    loadData = this.effect((id$: Observable<string>) =>
 *      id$.pipe(switchMap((id) => this.dataService
 *      .makeCall(id).pipe(
 *         tapBffResponse((data) => {
 *           // Happy Path!
 *           this.setStuff(data);
 *         }, (res, isMediated) => {
 *            // Handle mediated or error case
 *         } )
 *      ))));
 *  }
 *
 * ```
 *
 */
export function tapBffResponse<SuccessResponse, MediatedResponse>(
  successCb: VoidRequestCallback<SuccessResponse>,
  errorOrPartialCb: VoidRequestCallback<(MediatedResponse & VerticeMediatedResponse) | HttpErrorResponse>,
  errorCb?: VoidRequestCallback<HttpErrorResponse>
) {
  return pipe(
    tapResponse(
      (
        res: HttpResponse<SuccessResponse | (MediatedResponse & VerticeMediatedResponse)>
      ) => {
        switch (res.status) {
          case 200:
            successCb(res.body as SuccessResponse);
            break;
          case 206:
            errorOrPartialCb(
              res.body as MediatedResponse & VerticeMediatedResponse, true
            );
            break;
        }
      },
      (e: HttpErrorResponse) => {
        console.error(e);
        return errorCb ? errorCb(e, false) : errorOrPartialCb(e, false);
      }
    )
  );
}
