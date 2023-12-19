import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../store/models/root.models';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HartfordConfig } from './customerConfig/hartford.config';
import { ZurichConfig } from './customerConfig/zurich.config';
import { WestfieldConfig } from './customerConfig/westfield.config';
import { AcuityConfig } from './customerConfig/acuity.config';
import { GallagherConfig } from './customerConfig/gallagher.config';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { getAbmClaimStatus } from '@shared/store/selectors/claim.selectors';
import { StateFundConfig } from './customerConfig/stateFund.config';

@Injectable({
  providedIn: 'root'
})
export class RequestorInformationCustomerConfigService {
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  constructor(private store$: Store<RootState>) {}

  prepareFormGroupValidations(
    fg: FormGroup,
    customerId: string,
    abmClaimStatus: string
  ) {
    switch (customerId) {
      default:
        break;

      case 'HARTFORD':
        HartfordConfig.initialFormGroupSetup(fg);
        break;

      case 'Zurich':
        ZurichConfig.initialFormGroupSetup(fg);
        break;

      case '6000WEST':
        WestfieldConfig.initialFormGroupSetup(fg);
        break;

      case 'Acuity':
        AcuityConfig.initialFormGroupSetup(fg);
        break;

      case 'GALLAGHER':
        GallagherConfig.initialFormGroupSetup(fg);
        break;

      // State Fund
      case '6000SCIF':
        StateFundConfig.initialFormGroupSetup(fg, abmClaimStatus);

        break;
    }
  }
}
