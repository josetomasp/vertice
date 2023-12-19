import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loadDiagnosticsDraft,
  loadDMEDraft,
  loadHomeHealthDraft,
  loadLanguageDraft,
  loadPhysicalMedicineDraft,
  loadTRPDraft
} from '../claims/abm/referral/store/actions/make-a-referral-draft.actions';
import { RootState } from '../store/models/root.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationLinkingService {
  constructor(public store$: Store<RootState>) {}

  gotoDraft(serviceType: string, referralId: string) {
    switch (serviceType) {
      case 'Language':
      case 'LAN':
        this.store$.dispatch(loadLanguageDraft({ referralId }));
        break;
      case 'Physical Medicine':
      case 'PM':
        this.store$.dispatch(loadPhysicalMedicineDraft({ referralId }));
        break;
      case 'Diagnostics':
      case 'DX':
        this.store$.dispatch(loadDiagnosticsDraft({ referralId }));
        break;
      case 'Home Health':
      case 'HH':
        this.store$.dispatch(loadHomeHealthDraft({ referralId }));
        break;
      case 'DME':
        this.store$.dispatch(loadDMEDraft({ referralId }));
        break;
      case 'Transportation':
        this.store$.dispatch(loadTRPDraft({ referralId }));
        break;
      default:
        console.warn('Service ' + serviceType + ' Not supported yet');
    }
    // window.alert(
    //   'Need to handle click event for draft ID row during API integration: ' +
    //   JSON.stringify(row, null, 2)
    // );
  }
}
