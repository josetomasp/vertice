import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ReferralTab } from '../../referral-id.models';
import {
  faFileExclamation,
  faStickyNote
} from '@fortawesome/pro-light-svg-icons';
import { Vertice25Service } from '@shared/service/vertice25.service';
import { OpenReferralDetailModal } from '../../../store/actions/referral-activity.actions';
import { ReferralStage } from '../../../store/models';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../../store/models/root.models';
import {
  ReferralAuthorizationAction,
  ReferralAuthorizationArchetype
} from '../../referral-authorization/referral-authorization.models';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'healthe-referral-activity-tab-bar',
  templateUrl: './referral-activity-tab-bar.component.html',
  styleUrls: ['./referral-activity-tab-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralActivityTabBarComponent extends DestroyableComponent
  implements OnInit {
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  @Input() url: string;

  faFileExclamation = faFileExclamation;
  faStickyNote = faStickyNote;

  isFusionAuthInfoDisabled = false;

  private _tabs: ReferralTab[] = [];
  get tabs(): ReferralTab[] {
    return this._tabs;
  }

  @Input()
  set tabs(value: ReferralTab[]) {
    this._tabs = value;
    const splitElement = this.url.split('/');
    let authLink = splitElement[splitElement.length - 1];

    authLink = authLink.split('#')[0];
    if (authLink === 'grid' || authLink === 'table') {
      authLink = 'activity';
    }

    this.tabGroup.selectedIndex = this._tabs.findIndex(
      (tab) => tab.link === authLink
    );
  }

  @Input()
  archeType: ReferralAuthorizationArchetype;

  @Input()
  referralAuthorizationAction: ReferralAuthorizationAction;

  transportationArcheType = ReferralAuthorizationArchetype.Transportation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public vertice25Service: Vertice25Service,
    public store$: Store<RootState>
  ) {
    super();

    // When a router.navigate is used, such as for the cancel referral modal, tab
    // control will end up on the wrong selected tab even though the right page will be shown.
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((navEvent: NavigationEnd) => {
        // I do not like the substring search, but it's all I have to work with
        // Just be aware if we add new tabs that will have a substring match, then the below logic will get confused.
        // The easy fix is to pick a better name (in the route) that will not run into a substring match problem.
        const tabIndex = this._tabs.findIndex(
          (tab) => navEvent.url.indexOf(tab.link) !== -1
        );

        if (tabIndex >= 0 && tabIndex !== this.tabGroup.selectedIndex) {
          this.tabGroup.selectedIndex = tabIndex;
        }
      });
  }

  ngOnInit(): void {}

  gotoLink(index: number): void {
    this.router.navigate(['./' + this._tabs[index].link], {
      relativeTo: this.activatedRoute
    });
  }

  reportNewIncident() {
    this.vertice25Service.createIncidentReport();
  }

  viewEditDocNotes() {
    this.store$.dispatch(
      new OpenReferralDetailModal({
        stage: ReferralStage.VENDOR_ASSIGNMENT,
        modalData: { dateOfService: '' }
      })
    );
  }

  isTabDisabled(tabLink: string) {
    if (tabLink === 'authorization') {
      return (
        this.referralAuthorizationAction === ReferralAuthorizationAction.NOTHING
      );
    } else {
      return false;
    }
  }
}
