import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faExclamationTriangle } from '@fortawesome/pro-light-svg-icons/faExclamationTriangle';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { authorizationInformation } from '../../../../../in-memory-data/authorization/authorizationInformation-data';
import { RootState } from '../../../../../store/models/root.models';
import { AuthorizationAlertModalComponent } from '../authorization-alert-modal/authorization-alert-modal.component';

@Component({
  selector: 'healthe-authorization-alert-card',
  templateUrl: './authorization-alert-card.component.html',
  styleUrls: ['./authorization-alert-card.component.scss']
})
export class AuthorizationAlertCardComponent implements OnInit {
  faExclamationTriangle = faExclamationTriangle;

  // TODO: Uncomment this when we figure out the api stuff
  // authAlerts$ = this.store$.pipe(select(getAuthorizationAlerts));
  authAlerts$ = of(authorizationInformation.authorizationAlerts);
  firstAlert$ = this.authAlerts$.pipe(map((alerts) => alerts[0]));
  remainingAlerts$ = this.authAlerts$.pipe(
    map((alerts) => alerts.splice(1, alerts.length))
  );
  countAlerts = authorizationInformation.authorizationAlerts.length;
  showAlertCard$ = this.authAlerts$.pipe(map((alerts) => alerts.length > 0));
  moreThanOneAlert$ = this.authAlerts$.pipe(map((alerts) => alerts.length > 1));
  panelOpenedOrClosedLabels: Array<string> = ['See all alerts', 'Close Alerts'];
  panelOpenedOrClosedIndex: Number = 0;

  constructor(public store$: Store<RootState>, public dialog: MatDialog) {}

  ngOnInit() {}

  openAlertModal(e: MouseEvent, alertModalHTML: string) {
    e.preventDefault();
    e.stopPropagation();
    this.dialog.open(AuthorizationAlertModalComponent, {
      data: alertModalHTML,
      height: '75%',
      width: '50%',
      autoFocus: false
    });
  }

  setExpansionOpened() {
    this.panelOpenedOrClosedIndex = 1;
  }

  setExpansionClosed() {
    this.panelOpenedOrClosedIndex = 0;
  }
}
