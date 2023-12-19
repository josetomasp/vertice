import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RootState } from '../../../../../../../../store/models/root.models';
import { OpenReferralDetailModal } from '../../../../../store/actions/referral-activity.actions';
import {
  CardState,
  FooterColor,
  ReferralActivityIcon,
  ReferralStage,
  ServiceType
} from '../../../../../store/models';

interface CardIcon {
  iconClass: string;
  iconText: string;
  image: string;
}

@Component({
  selector: 'healthe-grid-card',
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.scss']
})
export class GridCardComponent implements OnInit, OnChanges {
  @Input()
  cardState: CardState<any>;
  @Input()
  laneIndex: number;
  @Input()
  cardIndex: number;
  @Input()
  clickable: boolean;
  ReferralStage = ReferralStage;
  FooterColor = FooterColor;
  ServiceType = ServiceType;

  idPrefix;
  isCore = false;

  cardIcon: CardIcon;

  constructor(public store$: Store<RootState>, private router: Router) {
    // I do not know if this approach is right, to try and make a bunch of tweaks to this component to
    // make it work for core while not messing stuff up for fusion.
    // Perhaps a better solution is to duplicate this component and then change it to be 'isCore' only
    // Keeping our core and fusion separate.
    // Bethany said they do not care about highlighting / bolding differences, only as long as the
    // Information is there.  For that reason I decided to just update this one component.
    if (this.router.url.indexOf('transportation') > -1) {
      this.isCore = true;
    }
  }

  ngOnInit(): void {
    this.idPrefix = `gridCard${this.cardState.stage}${this.laneIndex}-${
      this.cardIndex
    }`;

    this.cardIcon = this.setCardIcon();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cardState && changes.cardState.currentValue.iconInfo) {
      this.cardIcon = this.setCardIcon();
    }
  }
  getIcon(color: FooterColor) {
    switch (color) {
      case FooterColor.SUCCESS:
        return 'fa-check';
      case FooterColor.FAIL:
        return 'fa-exclamation-triangle';
      default:
        return '';
    }
  }

  onClick(): void {
    if (this.clickable && this.cardState.modalData !== null) {
      const { stage, modalData } = this.cardState;
      this.store$.dispatch(
        new OpenReferralDetailModal({
          stage,
          modalData
        })
      );
    }
  }

  openSendANote(): void {
    this.store$.dispatch(
      new OpenReferralDetailModal({
        stage: ReferralStage.VENDOR_ASSIGNMENT,
        modalData: { dateOfService: this.cardState.date }
      })
    );
  }

  private setCardIcon(): CardIcon {
    let retval: CardIcon = null;

    if (this.cardState.iconInfo) {
      retval = { iconClass: null, iconText: null, image: null };
      switch (this.cardState.iconInfo.icon) {
        case ReferralActivityIcon.SEDAN:
          retval.iconClass = 'text-primary fa-2x far fa-car';
          retval.iconText = this.cardState.iconInfo.iconText;
          this.applyBrandedImages(retval);
          break;
        case ReferralActivityIcon.OTHER:
          retval.iconClass = 'text-primary fa-2x far fa-ambulance';
          retval.iconText = this.cardState.iconInfo.iconText;
          break;
        case ReferralActivityIcon.WHEELCHAIR:
          retval.iconClass = 'text-primary fa-2x far fa-wheelchair';
          retval.iconText = this.cardState.iconInfo.iconText;
          break;
        case ReferralActivityIcon.LODGING:
          retval.iconClass = 'text-primary fa-2x far fa-hotel';
          retval.iconText = this.cardState.iconInfo.iconText;
          break;
        case ReferralActivityIcon.FLIGHT:
          retval.iconClass = 'text-primary fa-2x far fa-plane-departure';
          retval.iconText = this.cardState.iconInfo.iconText;
          break;
      }
    }

    return retval;
  }

  private applyBrandedImages(value: CardIcon) {
    let nameType = value.iconText.toLowerCase();
    if (nameType.indexOf('lyft') !== -1) {
      value.iconText = null;
      value.iconClass = null;
      value.image = 'assets/img/referralActivity/lyft.png';
    } else if (nameType.indexOf('uber') !== -1) {
      value.iconText = null;
      value.iconClass = null;
      value.image = 'assets/img/referralActivity/uber.svg';
    }
  }
}
