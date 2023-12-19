import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenu } from '@angular/material/menu';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { debounceTime, first, map } from 'rxjs/operators';
import { CLAIM_VIEW_DATE_PICKER_OPTIONS } from '../../../claim-view/store/models/claim-view.models';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { RootState } from '../../../store/models/root.models';
import * as fromUser from '../../../user/store/selectors/user.selectors';
import {
  ClaimSearchExport,
  ClaimSearchExportRequest,
  ClaimSearchOptionsRequest,
  ClaimSearchRequest,
  UpdateClaimSearchForm
} from '../../store';
import * as fromClaimsSearch from '../../store/selectors/claim-search.selectors';
import { ClaimSearchForm } from '@shared/store/models';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

const claimSearchDaterangeOptions = _.clone(CLAIM_VIEW_DATE_PICKER_OPTIONS);

claimSearchDaterangeOptions.applyLabel = 'OK';

@Component({
  selector: 'claim-search-filter-box',
  templateUrl: './claim-search-filter-box.component.html',
  styleUrls: ['./claim-search-filter-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimSearchFilterBoxComponent implements OnInit {
  constructor(
    public store$: Store<RootState>,
    public featureFlagService: FeatureFlagService
  ) {
    this.store$.dispatch(new ClaimSearchOptionsRequest(null));
    this.claimsSearchFormGroup.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((form) => {
        this.store$.dispatch(new UpdateClaimSearchForm(form));
      });
    this.claimsSearchFormState$.pipe(first()).subscribe((formState) => {
      this.claimsSearchFormGroup.setValue(formState);
    });
    this.email$.subscribe((email) => {
      const assignedAdjuster =
        this.claimsSearchFormGroup.get('assignedAdjuster');
      if (assignedAdjuster.value === '') {
        assignedAdjuster.setValue(email);
      }
    });
  }

  public assignedAdjusterOptions$ = this.store$.pipe(
    select(fromClaimsSearch.getAssignedAdjusterOptions)
  );
  public riskCategoryOptions$ = this.store$.pipe(
    select(fromClaimsSearch.getRiskCategoryOptions)
  );
  public riskLevelOptions$ = this.store$.pipe(
    select(fromClaimsSearch.getRiskLevelOptions)
  );
  public stateOfVenueOptions$ = this.store$.pipe(
    select(fromClaimsSearch.getStateOfVenueOptions)
  );
  public claimsSearchFormState$ = this.store$.pipe(
    select(fromClaimsSearch.getClaimSearchFormState)
  );
  public email$ = this.store$.pipe(
    select(fromUser.getUserInfo),
    map((info) => info.email),
    first((email) => email !== '')
  );

  datePickerOptions = claimSearchDaterangeOptions;

  faCalendarAlt = faCalendarAlt;

  componentGroupName = 'claim-search-filter-box';

  claimsSearchFormGroup: FormGroup = new FormGroup({
    claimNumber: new FormControl(),
    claimantLastName: new FormControl(),
    claimantFirstName: new FormControl(),
    assignedAdjuster: new FormControl(),
    dateOfInjury: new FormControl(),
    riskLevel: new FormControl(),
    riskCategory: new FormControl(),
    stateOfVenue: new FormControl()
  });
  columns = [
    'claimNumber',
    'dateOfInjury',
    'claimantName',
    'phiMemberId',
    'adjusterName',
    'adjusterEmail',
    'stateAndOfficeID',
    'riskLevel',
    'riskCategory',
    'claimMME',
    'previousActions',
    'interventions',
    'action'
  ].filter((name) => {
    return !this.featureFlagService.shouldElementBeRemoved(
      'claim-search-results-table',
      name
    );
  });

  ngOnInit() {}

  doSearchExport(exportType: string) {
    let exportData: ClaimSearchExport =
      this.claimsSearchFormGroup.getRawValue();
    exportData.exportType = exportType;
    exportData.columns = this.columns;
    this.store$.dispatch(new ClaimSearchExportRequest(exportData));
  }

  search() {
    let formData: ClaimSearchForm = this.claimsSearchFormGroup.getRawValue();
    this.store$.dispatch(new ClaimSearchRequest(formData));
  }

  reset() {
    this.email$.subscribe((email) => {
      this.claimsSearchFormGroup.reset({
        claimNumber: '',
        claimantLastName: '',
        claimantFirstName: '',
        assignedAdjuster: email,
        dateOfInjury: null,
        riskLevel: 'All',
        riskCategory: 'All',
        stateOfVenue: 'All'
      });
    });
  }
}
