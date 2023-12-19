import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { IcdCodesService } from '../../icd-codes/icd-codes.service';
import * as fromIcdCodesTab from '../actions/icd-codes-tab.actions';
import { IcdCodeSet } from '../models/icd-codes.models';
import { find } from 'lodash';

@Injectable()
export class IcdCodesTabEffects {
  constructor(
    public actions$: Actions,
    public store$: Store<RootState>,
    public icdCodesService: IcdCodesService
  ) {}

  public fetchIcdCodesRequest$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromIcdCodesTab.ActionType.ICD_CODES_REQUEST),

      mergeMap((action: fromIcdCodesTab.IcdCodesRequest) => {
        return this.icdCodesService.lookupIcdCodes(action.payload).pipe(
          map((response: IcdCodeSet) => {
            response.icds.map((respICD) => {
              // What this bit of code is doing putting the compensabilityDescription from the initial request
              // into the response.  The api providing the response does not supply the compensabilityDescription field.
              const icdCode = respICD.icdCode;
              const compensableICD = find(action.payload.icds, { icdCode });
              if (compensableICD) {
                const compensable = compensableICD.compensabilityDescription;
                if (null != compensable) {
                  respICD.compensabilityDescription = compensable;
                } else {
                  respICD.compensabilityDescription = '';
                }
              }

              return respICD;
            });

            return new fromIcdCodesTab.IcdCodesRequestSuccess(response);
          }),
          catchError((error) => {
            return of(new fromIcdCodesTab.IcdCodesRequestFail(error));
          })
        );
      })
    )
  );
}
