import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-authorizations-search-container',
  templateUrl: './authorizations-search-container.component.html',
  styleUrls: ['./authorizations-search-container.component.scss']
})
export class AuthorizationsSearchContainerComponent extends DestroyableComponent
  implements OnInit {
  currentTabLink: string = '';
  // Regarding healtheRemoveElementIfTrue and removing elements for certain customers
  //  that we don't support certain services/products for, this configuration needs
  //  the elementName to match what was set up in healthe-navigation-wrapper.component.ts
  //  in order to re-use the existing componentGroupName = 'sideNav' config
  tabs = [
    {
      link: 'all-authorizations',
      label: 'All',
      elementName: 'authorizations_all'
    },
    {
      link: 'epaq-authorizations',
      label: 'POS (ePAQ)',
      elementName: 'authorizations_epaq'
    },
    {
      link: 'paper-authorizations',
      label: 'Retro (Paper)',
      elementName: 'authorizations_paper'
    },
    {
      link: 'mail-order-authorizations',
      label: 'Mail Order',
      elementName: 'authorizations_mail_order'
    },
    {
      link: 'claim-resolution-authorizations',
      label: 'Claim Resolution',
      elementName: 'authorizations_claim_resolution'
    },
    {
      link: 'clinical-authorizations',
      label: 'Clinical Services',
      elementName: 'authorizations_clinical'
    },
    {
      link: 'referral-authorizations',
      label: 'Referrals',
      elementName: 'authorizations_referrals'
    }
  ];

  constructor(protected router: Router, public activatedRoute: ActivatedRoute) {
    super();
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => e.urlAfterRedirects),
        takeUntil(this.onDestroy$)
      )
      .subscribe((urlAfterRedirects: string) => {
        let urlPaths: string[] = urlAfterRedirects.split('/');

        this.tabs.forEach((tab) => {
          if (tab.link === urlPaths[urlPaths.length - 1]) {
            this.currentTabLink = tab.link;
          }
        });
      });
  }

  ngOnInit() {}

  gotoLink(tab: any) {
    this.router.navigate(['./' + tab.link], {
      relativeTo: this.activatedRoute
    });
  }

  linkIsActive(tab: any) {
    return this.currentTabLink === tab.link;
  }
}
