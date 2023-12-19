import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { AlertInfoModalComponent } from './alert-info-modal/alert-info-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FusionClinicalAlert } from '../store/models/fusion-authorizations.models';

export enum BannerAlertType {
  DrugBanner,
  ClinicalBanner
}

@Component({
  selector: 'healthe-alert-info-banner',
  templateUrl: './alert-info-banner.component.html',
  styleUrls: ['./alert-info-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertInfoBannerComponent implements OnInit, AfterViewInit {
  @Input()
  clinicalAlerts: FusionClinicalAlert[];

  @Input()
  typeOfAlert: BannerAlertType = BannerAlertType.ClinicalBanner;

  @Input()
  initialStateOpened = false;

  @ViewChild('banner')
  expansionPanel: MatExpansionPanel;

  warningIcon = faExclamationTriangle;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.expansionPanel && this.initialStateOpened) {
      this.expansionPanel.open();
    }
  }

  getBannerText(): string {
    let text = '';
    let isPlural: boolean = false;
    if (this.clinicalAlerts) {
      isPlural = this.clinicalAlerts.length > 1;
      text = 'There '
        .concat(isPlural ? 'are' : 'is')
        .concat(' ')
        .concat(this.clinicalAlerts.length.toString())
        .concat(' ');

      if (this.typeOfAlert === BannerAlertType.ClinicalBanner) {
        text = text
          .concat('Clinical')
          .concat(isPlural ? ' Strategies' : ' Strategy');
      } else if (this.typeOfAlert === BannerAlertType.DrugBanner) {
        text = text.concat('Drug').concat(isPlural ? ' Alerts' : ' Alert');
      }

      text = text
        .concat(' that')
        .concat(isPlural ? ' require' : ' requires')
        .concat(' review.');
    }
    return text;
  }

  openAlertModal(alertInfo: FusionClinicalAlert) {
    this.dialog.open(AlertInfoModalComponent, {
      autoFocus: false,
      width: '702px',
      height: '400px',
      data: {
        alertInfo: alertInfo
      }
    });
  }
}
