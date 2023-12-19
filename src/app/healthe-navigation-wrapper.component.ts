import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { HealtheNavItem } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { pluckPrefValue } from '@shared';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { FeatureFlagService } from './customer-configs/feature-flag.service';
import {
  ComponentType,
  PreferenceType
} from './preferences/store/models/preferences.models';
import { getPreferenceByQuery } from './preferences/store/selectors/user-preferences.selectors';
import { RootState } from './store/models/root.models';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser/openCenteredNewWindow';
import { isSSOUser } from '@shared/lib/browser';
import {
  faChartLine,
  faEnvelope,
  faExclamationTriangle,
  faExternalLink,
  faFilesMedical,
  faSearch,
  faSlidersH,
  faTachometerSlowest,
  faWindow,
  faWrench
} from '@fortawesome/pro-light-svg-icons';
import { faClipboardList } from '@fortawesome/pro-solid-svg-icons';
import { isEmpty } from 'lodash';
import {
  getJarvisSSOLink,
  getUserOKTASettingsURL,
  isJarvisLinkHidden
} from './user/store/selectors/user.selectors';
import { Observable } from 'rxjs';
import { MobileInviteService } from '@modules/mobile-invite/mobile-invite-modal/mobile-invite.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

/*
WARNING: Do not have multiple items with the same NavItem.name value even if
there are different children as a bug will potentially cause the wrong
item to be expanded/selected
 */
interface NavItem extends HealtheNavItem {
  tooltip?: string;
  externalLink?: boolean;
  needsConfirmation?: boolean;
  alternateRouteNames?: Array<string>;
  elementName?: string;
  children?: NavItem[];
  image?: string;
  mailTo?: string;
  isFeedback?: boolean;
  newWindow?: boolean;
  hiddenForSSO?: boolean;
  hide$?: Observable<boolean>;
  route$?: Observable<string>;
}

@Component({
  selector: 'healthe-router',
  styleUrls: ['./healthe-navigation-wrapper.component.scss'],
  templateUrl: './healthe-navigation-wrapper.component.html'
})
export class HealtheNavigationWrapperComponent implements OnInit {
  isSSOUser = isSSOUser;
  listItemSelectedClass: string = 'list-item-selected';
  componentGroupName = 'sideNav';
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  changePasswordNavItem: NavItem = {
    name: 'changePassword',
    displayName: 'Change Password',
    elementName: 'changePassword',
    route: 'https://www.google.com',
    externalLink: true,
    newWindow: true,
    hiddenForSSO: true
  };

  changeSecurityQuestions: NavItem = {
    name: 'changeSecurityQuestions',
    displayName: 'Change Security/Questions',
    elementName: 'changeSecurityQuestions',
    route: 'https://www.google.com',
    externalLink: true,
    newWindow: true,
    hiddenForSSO: true
  };

  navItems: Array<NavItem> = [
    {
      name: 'dashboard',
      displayName: 'Dashboard',
      elementName: 'dashboard',
      icon: faTachometerSlowest,
      route: '/dashboard'
    },
    {
      name: 'v25Link',
      displayName: 'Classic Vertice',
      elementName: 'v25Link',
      icon: faWindow,
      route: '/HesDashboard/customer.jsp#Welcome',
      externalLink: true
    },
    {
      name: 'cscAdmin',
      displayName: 'CSC Administration',
      elementName: 'cscAdmin',
      image: '././assets/img/E.svg',
      children: [
        {
          name: 'authorizationStatusQueue',
          displayName: 'Auth Status Queue',
          elementName: 'authorization-status-queue',
          route: '/csc-administration/authorization-status-queue'
        },
        {
          name: 'realTimeRejectsQueue',
          displayName: 'Real Time Rejects Queue',
          elementName: 'real-time-rejects-queue',
          route: '/csc-administration/real-time-rejects-queue'
        },
        {
          name: 'authorizationSearch',
          displayName: 'POS Authorization Search',
          elementName: 'pos-authorization-search',
          route: '/csc-administration/pos-authorization-search'
        },
        {
          name: 'addFirstFill',
          displayName: 'Add First Fill',
          elementName: 'add-first-fill',
          route: '/csc-administration/add-first-fill'
        },
        {
          name: 'reportReturnedLOMN',
          displayName: 'Report Returned LOMN',
          elementName: 'report-returned-lomn',
          route: '/csc-administration/report-returned-lomn'
        },
        {
          name: 'firstFills',
          displayName: 'First Fill Web Queue',
          elementName: 'first-fills-queue',
          route: '/csc-administration/first-fills-queue'
        }
      ]
    },

    {
      name: 'authorizations',
      displayName: 'Authorizations',
      elementName: 'authorizations',
      icon: faClipboardList,
      children: [
        {
          name: 'all',
          displayName: 'All',
          elementName: 'authorizations_all',
          route: '/search-nav/all-authorizations'
        },
        {
          name: 'epaq',
          displayName: 'POS (ePAQ)',
          elementName: 'authorizations_epaq',
          route: '/search-nav/epaq-authorizations'
        },
        {
          name: 'paper',
          displayName: 'Retro (Paper)',
          elementName: 'authorizations_paper',
          route: '/search-nav/paper-authorizations'
        },
        {
          name: 'mailOrder',
          displayName: 'Mail Order',
          elementName: 'authorizations_mail_order',
          route: '/search-nav/mail-order-authorizations'
        },
        {
          name: 'claimResolution',
          displayName: 'Claim Resolution',
          elementName: 'authorizations_claim_resolution',
          route: '/search-nav/claim-resolution-authorizations'
        },
        {
          name: 'clinical',
          displayName: 'Clinical Services',
          elementName: 'authorizations_clinical',
          route: '/search-nav/clinical-authorizations'
        },
        {
          name: 'authorizations_referrals',
          displayName: 'Referrals',
          elementName: 'authorizations_referrals',
          route: '/search-nav/referral-authorizations'
        }
      ]
    },

    {
      name: 'referrals',
      displayName: 'Referrals',
      elementName: 'referrals',
      icon: faFilesMedical,
      children: [
        {
          name: 'make-a-referral',
          displayName: 'Make a Referral',
          elementName: 'make-a-referrals',
          route: '/referrals/make-a-referral-search'
        },
        {
          name: 'referrals_authorizations',
          displayName: 'Authorizations',
          elementName: 'referrals_authorizations',
          route: '/referrals/authorizations'
        },
        {
          name: 'referral-activity',
          displayName: 'Referral Activity',
          elementName: 'referral-activity',
          route: '/search-nav/referral-activity'
        },
        {
          name: 'pending-referrals',
          displayName: 'Pending Referrals',
          elementName: 'pending-referrals',
          route: '/search-nav/pending-referrals'
        },
        {
          name: 'draft-referrals',
          displayName: 'Draft Referrals',
          elementName: 'draft-referrals',
          route: '/search-nav/draft-referrals'
        }
      ]
    },

    {
      name: 'riskQueue',
      displayName: 'Risk Queue',
      elementName: 'claims_riskQueue',
      icon: faExclamationTriangle,
      route: '/claims/riskQueue'
    },

    {
      name: 'search',
      displayName: 'Search',
      elementName: 'search',
      icon: faSearch,
      alternateRouteNames: ['claimview'],
      children: [
        {
          name: 'claimSearch',
          displayName: 'Claim Search',
          elementName: 'claims_claimSearch',
          route: '/claims/claimSearch'
        },
        {
          name: 'referralSearch',
          displayName: 'Referral Search',
          elementName: 'referralSearch',
          route: '/search-nav/referral-search'
        },
        {
          name: 'drugSearch',
          displayName: 'Drug Search',
          elementName: 'drugSearch',
          route:
            '/HesDashboard/popup.jsp?header=stripeonly&popup=drugsearch#POPUP',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'pharmacySearch',
          displayName: 'Pharmacy Search',
          elementName: 'pharmacySearch',
          route: '/search-nav/pharmacy-search'
        },
        {
          name: 'pbmImageSearch',
          displayName: 'PBM Image Search',
          elementName: 'pbmImageSearch',
          route: '/PbmPaper/pbmpaper.jsp?header=stripeonly#ImageSearch',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'pbmEobSearch',
          displayName: 'PBM EOB Search',
          elementName: 'pbmEobSearch',
          route: '/PbmPaper/pbmpaper.jsp?header=stripeonly#EobSearch',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'feeUcrLookup',
          displayName: 'FEE / UCR Look up',
          elementName: 'feeUcrLookup',
          route: '/HesDashboard/popup.jsp?header=stripeonly&popup=feeucr#POPUP',
          externalLink: true,
          newWindow: true
        }
      ]
    },

    {
      name: 'reports',
      displayName: 'Reports',
      elementName: 'reports',
      icon: faChartLine,
      route: '/reports'
    },

    {
      name: 'tools',
      displayName: 'Tools',
      elementName: 'tools',
      icon: faWrench,
      children: [
        {
          name: 'paymentReconciliation',
          displayName: 'Payment Reconciliation',
          elementName: 'paymentReconciliation',
          route:
            '/HesBilling/index.jsp?header=stripeonly#PSD;status=Authorization%20Required;searchType=simple',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'outOfOfficeManager',
          displayName: 'Out of Office Manager',
          elementName: 'outOfOfficeManager',
          route:
            '/HesDashboard/common.jsp?header=stripeonly#ReassignmentSearch',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'latestNews',
          displayName: 'Latest News',
          elementName: 'latestNews',
          route: 'https://healthesystems.com/workers-comprehensive/',
          externalLink: true
        },
        {
          name: 'myResources',
          displayName: 'My Resources',
          elementName: 'myResources',
          route:
            '/HesDashboard/popup.jsp?header=stripeonly&popup=myresources#POPUP',
          externalLink: true,
          newWindow: true
        },
        {
          name: 'healthesystems',
          displayName: 'Healthesystems Website',
          elementName: 'healthesystems',
          route: 'https://www.healthesystems.com/',
          externalLink: true
        },
        {
          name: 'preferences',
          displayName: 'User Preferences',
          elementName: 'preferences',
          icon: faSlidersH,
          route: '/preferences'
        },
        this.changePasswordNavItem,
        this.changeSecurityQuestions
      ]
    },
    {
      name: 'contactUs',
      displayName: 'Contact Us',
      elementName: 'contactUs',
      icon: faEnvelope,
      children: [
        {
          name: 'askAPharmacist',
          displayName: 'Ask a Pharmacist',
          elementName: 'askAPharmacist',
          route:
            'https://www.healthesystems.com/resources-tools/ask-a-pharmacist',
          externalLink: true
        },
        {
          name: 'contactUs',
          displayName: 'Customer Support',
          elementName: 'contactUs',
          mailTo: 'mailto:support@healthesystems.com',
          externalLink: true
        },
        {
          name: 'feedback',
          displayName: 'FeedBack',
          elementName: 'feedback',
          isFeedback: true,
          externalLink: true
        },
        {
          name: 'incidentReports',
          displayName: 'Incident Reports',
          elementName: 'incidentReports',
          route:
            '/HesDashboard/popup.jsp?header=stripeonly&popup=incidentreport#POPUP',
          externalLink: true,
          newWindow: true
        }
      ]
    },
    {
      name: 'jarvisPortal',
      displayName: 'Jarvis Portal',
      elementName: 'jarvisPortal',
      externalLink: true,
      needsConfirmation: true,
      icon: faExternalLink,
      hide$: this.store$.pipe(select(isJarvisLinkHidden)),
      route$: this.store$.pipe(select(getJarvisSSOLink))
    }
    // {
    //   name: 'tasks',
    //   displayName: 'Tasks',
    //   elementName: 'tasks',
    //   iconName: ['fal', 'fa-list-alt']
    // },
    // {
    //   name: 'watchlist',
    //   displayName: 'Watchlist',
    //   elementName: 'watchList',
    //   iconName: ['fal', 'fa-search']
    // },
  ];

  activeLink;
  currentNavItem: NavItem = this.navItems[0];
  highlightedNav: NavItem = this.navItems[0];
  selectedParentNavItem: NavItem = this.navItems[0];
  fallbackNavItem: NavItem;
  isNavExpanded: boolean = false;
  screenInnerWidth: number;
  subMenuExpansionMap = {};

  constructor(
    public router: Router,
    public store$: Store<RootState>,
    public featureFlagService: FeatureFlagService,
    public confirmationModalService: ConfirmationModalService
  ) {
    this.screenInnerWidth = window.innerWidth;
    this.store$
      .pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.Expanded,
          componentTypeName: ComponentType.LeftNav
        }),
        pluckPrefValue
      )
      .subscribe(
        (expanded: boolean) =>
          (this.isNavExpanded = expanded && this.screenInnerWidth >= 960)
      );

    this.store$
      .pipe(select(getUserOKTASettingsURL), first())
      .subscribe((url) => {
        this.changePasswordNavItem.route = url;
        this.changeSecurityQuestions.route = url;
      });
  }

  ngOnInit(): void {
    // This might should belong in the constructor. In another instance
    //  (authorizations-search-container) I was finding that NavigationEnd was only
    //  emitted before ngOnInit so it was unable to capture route changes from ngOnInit
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => e.urlAfterRedirects),
        map((url) => {
          let activeNavItemArray = this.navItems.filter((navItem) =>
            this.hasRoute(url, navItem)
          );
          if (activeNavItemArray.length > 0) {
            if (activeNavItemArray[0].children) {
              let navItem: NavItem;

              for (let i = 0; i < activeNavItemArray[0].children.length; i++) {
                if (this.hasRoute(url, activeNavItemArray[0].children[i])) {
                  navItem = activeNavItemArray[0].children[i];
                }
              }

              return navItem ? navItem : activeNavItemArray[0];
            }
            return activeNavItemArray[0];
          }
        })
      )
      .subscribe((currentNavItem) => {
        if (currentNavItem) {
          this.highlightedNav = currentNavItem;
          this.currentNavItem = currentNavItem;
          this.fallbackNavItem = currentNavItem;
          this.activeLink = currentNavItem.route;
          this.findSelectedParent(currentNavItem);
        }
      });
  }

  toggleNavExpanded() {
    this.isNavExpanded = !this.isNavExpanded;
  }

  onItemSelected(item: NavItem, popupMenu?: MatMenuTrigger): void {
    if (item.needsConfirmation) {
      this.confirmationModalService
        .displayModal(
          {
            titleString: 'You are leaving Verticē',
            bodyHtml: `
       You are opening a new web application outside the Verticē portal
      `,
            affirmString: 'PROCEED',
            denyString: 'CANCEL'
          },
          '260px',
          '360px'
        )
        .afterClosed()
        .pipe(
          filter((confirmed) => confirmed),
          switchMap(() => item.route$)
        )
        .subscribe((route) => {
          window.open(route);
        });
    } else {
      if (!item || !item.elementName) {
        return;
      }

      if (!this.isElementDisabled(item.elementName)) {
        if (!item.children || !item.children.length) {
          // redirect user to item.route
          this.selectItemAndRoute(item);
        }
        if (item.children && item.children.length) {
          this.fallbackNavItem = this.highlightedNav.children
            ? this.fallbackNavItem
            : this.highlightedNav;

          this.updateSubItemExpansionState(item);

          this.highlightedNav = item;

          if (popupMenu) {
            popupMenu.menuClosed.subscribe(() => {
              if (this.highlightedNav.children) {
                this.highlightedNav = this.fallbackNavItem;
              }
            });
          }
        }

        this.findSelectedParent(item);
      }
    }
  }

  updateSubItemExpansionState(navItemClicked: NavItem) {
    if (this.subMenuExpansionMap[navItemClicked.displayName]) {
      this.subMenuExpansionMap[navItemClicked.displayName] = false;
    } else {
      this.subMenuExpansionMap[navItemClicked.displayName] = true;
    }
  }

  selectItemAndRoute(item: NavItem) {
    if (!item || !item.elementName) {
      return;
    }

    if (!this.isElementDisabled(item.elementName)) {
      if (item.externalLink) {
        if (item.mailTo) {
          window.open(item.mailTo);
        } else {
          if (item.isFeedback) {
            document.getElementById('atlwdg-trigger').click();
          } else if (item.newWindow) {
            openCenteredNewWindowDefaultSize(this.getExternalItemRoute(item));
          } else {
            window.open(this.getExternalItemRoute(item), '_blank');
          }
        }
      } else {
        this.router.navigateByUrl(item.route).then(() => {
          this.highlightedNav = item;
          this.fallbackNavItem = item;

          // Route to the page
          this.currentNavItem = item;
        });
      }
    }
  }

  getMenuStateClass(item: NavItem): string[] {
    let returnValue: string[] = [];
    // If this is the highlighted item or currently selected item, then add selected class
    if (!item) {
      return returnValue;
    }

    if (
      (this.highlightedNav.name === item.name && !this.isNavExpanded) ||
      this.currentNavItem.name === item.name
    ) {
      returnValue.push(this.listItemSelectedClass);
    }

    // If a child is the highlighted item, then add selected class
    if (item.children) {
      item.children.forEach((child: NavItem) => {
        if (this.currentNavItem.name === child.name) {
          returnValue = [this.listItemSelectedClass];
        }
      });
    }
    return returnValue;
  }

  hasRoute(url: string, navItem: NavItem) {
    url = url.replace(/#.*/, '');

    if (isEmpty(navItem.children)) {
      return navItem.route === url;
    } else {
      if (navItem.alternateRouteNames) {
        for (let child of navItem.children) {
          if (child.route === url) {
            return true;
          }
        }

        return navItem.alternateRouteNames.includes(
          url.substring(1, url.indexOf('/', 1))
        );
      }

      for (let child of navItem.children) {
        if (child.route === url) {
          return true;
        }
      }
    }
    return false;
  }

  getYear() {
    return new Date().getFullYear();
  }

  isElementDisabled(elementName: string): boolean {
    if (!elementName) {
      return;
    }
    return this.featureFlagService.shouldElementBeDisabled(
      this.componentGroupName,
      elementName
    );
  }

  determineTooltip(item: NavItem): string {
    if (!item || !item.elementName) {
      return 'Coming soon!';
    }

    return this.featureFlagService.shouldElementBeDisabled(
      this.componentGroupName,
      item.elementName
    )
      ? item.displayName + ' - Coming soon!'
      : item.displayName;
  }

  // For whatever item is selected, find its parent.,
  private findSelectedParent(currentNavItem: NavItem) {
    this.navItems.forEach((parentItem) => {
      if (currentNavItem.name === parentItem.name) {
        this.selectedParentNavItem = parentItem;
      } else {
        if (parentItem.children) {
          parentItem.children.forEach((childItem) => {
            if (currentNavItem.name === childItem.name) {
              // Re-assinging the same value will force uneeded dom updates.
              if (this.selectedParentNavItem.name !== parentItem.name) {
                this.selectedParentNavItem = parentItem;
              }
            }
          });
        }
      }
    });
  }

  private getExternalItemRoute(item: NavItem) {
    switch (item.elementName) {
      default:
        return item.route;
    }
  }

  shouldShowElementWithSSOStatusInMind(item: NavItem): boolean {
    return !(isSSOUser() && item.hiddenForSSO);
  }

  // Not currently used, but leaving in case we want it
  // private replaceUserNameInRoute(route: string): string {
  //   this.store$
  //     .pipe(
  //       select(getUsername),
  //       first()
  //     )
  //     .subscribe((username) => {
  //       route = route.replace('#USERNAME#', username);
  //     });
  //
  //   return route;
  // }
}
