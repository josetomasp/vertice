import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { RootState } from '../../store/models/root.models';
import { IcdCodesRequest } from '../store/actions/icd-codes-tab.actions';
import { IcdCode } from '../store/models/icd-codes.models';
import {
  didIcdTabFetchFromServer,
  getIcdCodeSet,
  getIsIcdCodesLoading
} from '../store/selectors/icd-codes-tab.selector';
import { FeatureFlagService } from 'src/app/customer-configs/feature-flag.service';
import { PageTitleService } from '@shared/service/page-title.service';

@Component({
  selector: 'icd-codes-tab',
  templateUrl: './icd-codes.component.html',
  styleUrls: ['./icd-codes.component.scss']
})
export class IcdCodesComponent implements OnInit {
  didIcdTabFetchFromServer$ = this.store$.pipe(
    select(didIcdTabFetchFromServer)
  );

  isLoading$ = this.store$.pipe(select(getIsIcdCodesLoading));
  icdCodeSet$ = this.store$.pipe(select(getIcdCodeSet));
  eligibilityInfo$ = this.store$.pipe(select(getClaimV3));

  tableColumns: Array<string> = [
    'icdCode',
    'icdVersion',
    'compensabilityDescription',
    'icdDescription'
  ].filter((name) => {
    return !this.featureFlagService.shouldElementBeRemoved(
      'icd-code-tab',
      name
    );
  });

  constructor(
    public store$: Store<RootState>,
    public featureFlagService: FeatureFlagService,
    private pageTitleService: PageTitleService
  ) {
    this.pageTitleService.setTitleWithClaimNumber('Claim View', 'ICD Codes');
  }

  ngOnInit() {
    combineLatest(this.didIcdTabFetchFromServer$, this.eligibilityInfo$)
      .pipe(
        first(([didIcdTabFetch, eligibilityInfo]) => {
          return eligibilityInfo.icdCodes.length > 0;
        })
      )
      .subscribe(([didFetchFromServer, eligibilityInfo]) => {
        if (true !== didFetchFromServer) {
          const IcdCodeList: IcdCode[] = [];

          eligibilityInfo.icdCodes.forEach((value) => {
            IcdCodeList.push({
              icdCode: value.icdCode,
              icdVersion: value.version,
              compensabilityDescription: value.compensabilityDescription
            });
          });

          this.store$.dispatch(new IcdCodesRequest({ icds: IcdCodeList }));
        }
      });
  }
}
