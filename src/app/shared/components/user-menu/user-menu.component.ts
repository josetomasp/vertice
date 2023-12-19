import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { RootState } from '../../../store/models/root.models';
import {
  getUsername,
  getUserOKTASettingsURL
} from '../../../user/store/selectors/user.selectors';
import {
  isSSOUser,
  openCenteredNewWindowDefaultSize
} from '@shared/lib/browser';

interface UserMenuItem {
  isExternal: boolean;
  displayName: string;
  route: string;
  elementName: string;
  newWindow?: boolean;
  hiddenForSSO?: boolean;
}

@Component({
  selector: 'healthe-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('menu')
  menu: MatMenu;

  isSSOUser = isSSOUser();

  // Use the side nav group so we can share configuration.
  componentGroupName = 'sideNav';
  userName = '';

  changePassword: UserMenuItem = {
    isExternal: true,
    displayName: 'Change Password',
    route: 'https://www.google.com',
    elementName: 'changePassword',
    newWindow: true,
    hiddenForSSO: true
  };
  changeSecurityQuestions: UserMenuItem = {
    isExternal: true,
    displayName: 'Change Security Questions',
    route: 'https://www.google.com',
    elementName: 'changeSecurityQuestions',
    newWindow: true,
    hiddenForSSO: true
  };

  menuIcon = faChevronDown;
  menuItems: UserMenuItem[] = [
    {
      isExternal: false,
      displayName: 'User Preferences',
      route: '/preferences',
      elementName: 'preferences'
    },
    this.changePassword,
    this.changeSecurityQuestions,
    {
      isExternal: true,
      displayName: 'Logout',
      route: ' /LogOut.jsp',
      elementName: 'logout'
    }
  ];

  constructor(public router: Router, public store$: Store<RootState>) {
    this.store$
      .pipe(
        select(getUsername),
        first()
      )
      .subscribe((username) => {
        this.userName = username;
      });

    this.store$
      .pipe(
        select(getUserOKTASettingsURL),
        first()
      )
      .subscribe((url) => {
        this.changePassword.route = url;
        this.changeSecurityQuestions.route = url;
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.menu.closed.subscribe(() => {
      this.menuIcon = faChevronDown;
    });
  }

  menuOpen() {
    this.menuIcon = faChevronUp;
  }

  menuItemClicked(item: UserMenuItem) {
    if (item.newWindow) {
      openCenteredNewWindowDefaultSize(item.route);
    } else if (item.isExternal) {
      window.open(item.route, '_blank');
    } else {
      this.router.navigateByUrl(item.route);
    }
  }

  shouldShowElementWithSSOStatusInMind(item: UserMenuItem): boolean {
    return !(isSSOUser() && item.hiddenForSSO);
  }
}
