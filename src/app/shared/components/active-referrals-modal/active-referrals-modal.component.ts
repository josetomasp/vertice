import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { RootState } from 'src/app/store/models/root.models';
import { resetFusionAuthorizationState } from '../../../claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  ACTIVE_REFERRAL_MODAL_COLUMNS,
  PM_EXTEND_ACTIVE_REFERRAL_MODAL_COLUMN
} from './columns';
import { PmAuthorizationExtensionModalComponent } from 'src/app/claims/abm/referral/referralId/referral-authorization/fusion/components/pm-authorization-extension-modal/pm-authorization-extension-modal.component';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { AuthorizationExtendableStatuses } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';

@Component({
  selector: 'healthe-active-referrals-modal',
  templateUrl: './active-referrals-modal.component.html',
  styleUrls: ['./active-referrals-modal.component.scss']
})
export class ActiveReferralsModalComponent extends DestroyableComponent
  implements OnInit {
  masterColumnList = [...ACTIVE_REFERRAL_MODAL_COLUMNS];
  dataSource = new HealtheDataSource([], null, this
    .masterColumnList as HealtheSortableColumn[]);
  serviceType: string;
  showExtendColumn: boolean = false;
  displayColumns;

  @ViewChild('matSort', { static: true }) matSort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ActiveReferralsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public store$: Store<RootState>,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.dataSource.data = this.data.activeReferrals;
    this.serviceType = this.data.serviceType;
    this.dataSource.sort = this.matSort;
    this.dataSource.data.forEach((referral) => {
      if (referral.datesOfService) {
        let endDate;
        let dates: string[] = referral.datesOfService.split(' - ');
        dates.length > 1
          ? (endDate = dates[1])
          : (endDate = referral.datesOfService);
        let showExtendButton = this.showExtension(endDate);
        if (showExtendButton) {
          this.showExtendColumn = showExtendButton;
        }
        referral['showExtendButton'] = showExtendButton;
      }
    });
    if (this.serviceType === 'Physical Medicine') {
      this.dataSource.data.forEach((referral) => {
        if (referral.datesOfService) {
          let endDate;
          let dates: string[] = referral.datesOfService.split(' - ');
          dates.length > 1
            ? (endDate = dates[1])
            : (endDate = referral.datesOfService);
          let showExtendButton =
            this.showExtension(endDate) &&
            AuthorizationExtendableStatuses.includes(referral.status);
          if (showExtendButton) {
            this.showExtendColumn = showExtendButton;
          }
          referral['showExtendButton'] = showExtendButton;
        }
      });
      if (this.showExtendColumn) {
        this.masterColumnList.push(PM_EXTEND_ACTIVE_REFERRAL_MODAL_COLUMN);
      }
    }
    this.displayColumns = this.masterColumnList.map((col) => col.name);
  }

  showExtension(date: string): boolean {
    let endDate = new Date(date);
    let currentDate = new Date();
    return (
      Math.round(
        (currentDate.getTime() - endDate.getTime()) / (1000 * 3600 * 24)
      ) <= 30
    );
  }

  extendReferral(referralId: string) {
    this.close();
    this.dialog
      .open(PmAuthorizationExtensionModalComponent, {
        disableClose: true,
        autoFocus: false,
        width: '1200px',
        data: {
          referralId: referralId
        }
      })
      .afterClosed()
      .subscribe(() => {
        this.store$.dispatch(resetFusionAuthorizationState());
      });
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  close() {
    this.dialogRef.close();
  }
}
