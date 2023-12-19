import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { RootState } from '../../../../store/models/root.models';

interface InfoField {
  name: string;
  label: string;
  value?: any;
  fallback: any;
}

@Component({
  selector: 'healthe-auth-info-expansion-panel',
  templateUrl: './risk-info-expansion-panel.component.html',
  styleUrls: ['./risk-info-expansion-panel.component.scss']
})
export class RiskInfoExpansionPanelComponent {
  topInfoFieldDefinitions: InfoField[] = [
    { name: 'prescriptionMME', label: 'PRESCRIPTION MME', fallback: 0 },
    { name: 'mmeBeforeRX', label: 'CLAIM MME BEFORE RX', fallback: 0 },
    { name: 'mmeAfterRX', label: 'CLAIM MME AFTER RX', fallback: 0 },
    {
      name: 'estimatedPillCountOnHand',
      label: 'ESTIMATED PILL COUNT ON HAND',
      fallback: 'Unknown'
    }
  ];
  topInfoFields$ = of([]);
  // TODO: Add back when we do POS Auth
  // topInfoFields$: Observable<InfoField[]> = this.store$.pipe(
  //   select(getPOSAuthorizationRiskInfo),
  //   mergeMap((info: AuthorizationRiskInformation) =>
  //     from(this.topInfoFieldDefinitions).pipe(
  //       tap((field: InfoField) => (field.value = get(info, field.name))),
  //       toArray()
  //     )
  //   )
  // );

  constructor(public store$: Store<RootState>) {}
}
