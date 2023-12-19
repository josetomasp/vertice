import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import {
  faCheck,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/pro-solid-svg-icons';
import { faFlag } from '@fortawesome/pro-light-svg-icons';

export enum AlertType {
  SUCCESS,
  WARNING,
  DANGER,
  INFO
}

class AlertStyle {
  background_color: string;
  text_color: string;
  icon: any;
  icon_size: string;
}

@Component({
  selector: 'healthe-confirmation-banner',
  templateUrl: './confirmation-banner.component.html',
  styleUrls: ['./confirmation-banner.component.scss']
})
export class ConfirmationBannerComponent implements OnInit {
  faTimes = faTimes;
  public idPrefix = 'confirmationBanner';
  @Input() alertType: AlertType = AlertType.INFO;
  @Input() showCloseButton = false;
  @Input() title: string = 'Title Text';
  @Input() bodyList: string[] = null;
  @Input() isVisible: boolean = false;
  @Input() idSufix: string = '0';

  alertStyle: AlertStyle = new AlertStyle();

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    this.setupAlertType();
  }

  setupAlertType() {
    switch (this.alertType) {
      case AlertType.SUCCESS:
        this.alertStyle.background_color = '#2c965a';
        this.alertStyle.text_color = '#fff';
        this.alertStyle.icon = faCheck;
        this.alertStyle.icon_size = '16px';
        break;

      case AlertType.WARNING:
        this.alertStyle.background_color = '#ffc658';
        this.alertStyle.text_color = '#000000';
        this.alertStyle.icon = faFlag;
        this.alertStyle.icon_size = '16px';
        break;

      case AlertType.DANGER:
        this.alertStyle.background_color = '#ea6852';
        this.alertStyle.text_color = '#fff';
        this.alertStyle.icon = faExclamationTriangle;
        this.alertStyle.icon_size = '18px';
        break;

      case AlertType.INFO:
        this.alertStyle.background_color = '$info';
        this.alertStyle.text_color = '#fff';
        this.alertStyle.icon = faInfoCircle;
        this.alertStyle.icon_size = '17px';
        break;
    }
  }

  hide() {
    this.isVisible = false;
  }

  show(titleText?: string, bodyList?: string[], alertType?: AlertType) {
    if (null != titleText) {
      this.title = titleText;
    }

    if (null != bodyList) {
      this.bodyList = bodyList;
    }

    if (null != alertType) {
      this.alertType = alertType;
    }

    this.isVisible = true;
  }

  getID(elementName: string): string {
    return `${this.idPrefix}-${elementName}-${this.idSufix}`;
  }
}
