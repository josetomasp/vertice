import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { scrollToAnchor } from '@shared';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { ClaimTableListSettingsComponent } from './claim-table-list-settings/claim-table-list-settings.component';
import { ClaimViewBannerSettingsComponent } from './claim-view-banner-settings/claim-view-banner-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import {
  UpdateClaimViewBannerCardExpanded,
  UpdateClaimViewListsCardExpanded,
  UpdateGeneralCardExpanded
} from './store/actions/preferences-screen.actions';
import {
  DeleteAllPreferences,
  GetAllPreferences,
  SavePreferences
} from './store/actions/preferences.actions';
import { RootPreferencesState } from './store/models/preferences.models';

import {
  isClaimBannerSettingsDirty,
  isClaimBannerSettingsExpanded,
  isClaimViewListsDirty,
  isClaimViewListsExpanded,
  isGeneralSettingsDirty,
  isGeneralSettingsExpanded
} from './store/selectors/preferences-screen.selectors';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { PageTitleService } from '@shared/service/page-title.service';

@Component({
  selector: 'healthe-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, AfterViewInit {
  idPrefix: string = 'preferences';

  @ViewChild('generalSettingsControls')
  generalSettingsControls: GeneralSettingsComponent;
  @ViewChild('claimViewBannerControls')
  claimViewBannerControls: ClaimViewBannerSettingsComponent;
  @ViewChild('claimTableListControls')
  claimTableListControls: ClaimTableListSettingsComponent;

  isGeneralSettingsExpanded$: Observable<boolean> = this.store$.pipe(
    select(isGeneralSettingsExpanded)
  );
  isClaimViewBannerExpanded$: Observable<boolean> = this.store$.pipe(
    select(isClaimBannerSettingsExpanded)
  );
  isClaimViewListsExpanded$: Observable<boolean> = this.store$.pipe(
    select(isClaimViewListsExpanded)
  );

  isGeneralSettingsDirty$: Observable<boolean> = this.store$.pipe(
    select(isGeneralSettingsDirty)
  );
  isClaimViewBannerDirty$: Observable<boolean> = this.store$.pipe(
    select(isClaimBannerSettingsDirty)
  );
  isClaimViewListsDirty$: Observable<boolean> = this.store$.pipe(
    select(isClaimViewListsDirty)
  );

  constructor(
    public store$: Store<RootPreferencesState>,
    private route: ActivatedRoute,
    private confirmationModalService: ConfirmationModalService,
    private pageTitleService: PageTitleService
  ) {
    this.pageTitleService.setTitle('Preferences');
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.route.fragment.pipe(first()).subscribe((anchorLink) => {
      if (null != anchorLink) {
        scrollToAnchor(anchorLink, 100);
      }
    });
  }

  generalSettingsExpandToggle(expanded: boolean) {
    this.store$.dispatch(new UpdateGeneralCardExpanded(expanded));
  }

  claimViewBannerPreferencesExpandToggle(expanded: boolean) {
    this.store$.dispatch(new UpdateClaimViewBannerCardExpanded(expanded));
  }

  claimViewListsPreferencesExpandToggle(expanded: boolean) {
    this.store$.dispatch(new UpdateClaimViewListsCardExpanded(expanded));
  }

  getActionText(expanded: any) {
    return expanded ? 'Collapse' : 'Expand';
  }

  cancel() {
    this.store$.dispatch(new GetAllPreferences());
  }

  reset() {
    this.confirmationModalService
      .displayModal({
        titleString: 'Reset to Default?',
        bodyHtml:
          "Choosing 'yes' will reset and save all of your preferences to the default settings.",
        affirmString: 'Yes',
        denyString: 'No'
      })
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe(() => this.store$.dispatch(new DeleteAllPreferences()));
  }

  saveAll() {
    this.store$.dispatch(
      new SavePreferences([
        ...this.generalSettingsControls.getUpdatedPreferences(),
        ...this.claimViewBannerControls.getUpdatedPreferences(),
        ...this.claimTableListControls.getUpdatedPreferences()
      ])
    );
  }
}
