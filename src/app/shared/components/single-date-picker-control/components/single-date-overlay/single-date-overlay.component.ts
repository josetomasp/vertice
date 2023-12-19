import { OverlayRef } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import * as moment_ from 'moment';
import {
  HealtheUIComponent,
  RangeStoreService
} from '@healthe/vertice-library';
import {
  animate,
  AnimationTriggerMetadata,
  group,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ConfigStoreService } from '../../config-store.service';
import { PresetItem } from '@healthe/vertice-library/src/app/lib/daterange/public_api';

const moment = moment_;

export const pickerOverlayAnimations: {
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  /** Transforms the height of the picker overlay content. */
  transformPanel: trigger('transformPickerOverlay', [
    state('void', style({ opacity: 0, transform: 'scale(1, 0)' })),
    state('enter', style({ opacity: 1, transform: 'scale(1, 1)' })),
    transition(
      'void => enter',
      group([animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')])
    ),
    transition('* => void', animate('100ms linear', style({ opacity: 0 })))
  ])
};

@Component({
  selector: 'healthe-single-date-overlay',
  templateUrl: './single-date-overlay.component.html',
  styleUrls: ['./single-date-overlay.component.scss'],
  animations: [pickerOverlayAnimations.transformPanel],
  encapsulation: ViewEncapsulation.None
})
export class SingleDateOverlayComponent extends HealtheUIComponent
  implements OnInit {
  public idPrefix = 'calendarOverlay';
  fromDate: Date;
  toDate: Date;
  fromMinDate: Date;
  fromMaxDate: Date;
  toMinDate: Date;
  toMaxDate: Date;
  presets: Array<PresetItem> = [];
  startDatePrefix: string;
  endDatePrefix: string;
  applyLabel: string;
  cancelLabel: string;
  shouldAnimate: string;

  constructor(
    private rangeStoreService: RangeStoreService,
    private configStoreService: ConfigStoreService,
    private overlayRef: OverlayRef,
    public elementRef: ElementRef
  ) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fromDate = moment(
      this.configStoreService.singleDateOptions.toMinMax.fromDate,
      'MM/DD/YYYY'
    ).isValid()
      ? this.configStoreService.singleDateOptions.toMinMax.fromDate
      : moment().toDate();
    this.toDate = moment(this.rangeStoreService.toDate, 'MM/DD/YYYY').isValid()
      ? this.rangeStoreService.toDate
      : moment()
          .add(30, 'days')
          .toDate();
    this.startDatePrefix =
      this.configStoreService.singleDateOptions.startDatePrefix || 'FROM:';
    this.endDatePrefix =
      this.configStoreService.singleDateOptions.endDatePrefix || 'TO:';
    this.applyLabel =
      this.configStoreService.singleDateOptions.applyLabel || 'Apply';
    this.cancelLabel =
      this.configStoreService.singleDateOptions.cancelLabel || 'Cancel';
    this.presets = this.configStoreService.singleDateOptions.presets;
    this.shouldAnimate = this.configStoreService.singleDateOptions.animation
      ? 'enter'
      : 'noop';
    ({
      fromDate: this.fromMinDate,
      toDate: this.fromMaxDate
    } = this.configStoreService.singleDateOptions.fromMinMax);
    ({
      fromDate: this.toMinDate,
      toDate: this.toMaxDate
    } = this.configStoreService.singleDateOptions.toMinMax);
  }

  updateFromDate(date) {
    this.fromDate = date;
    this.toMinDate = date;
    if (this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }
  }

  updateToDate(date) {
    this.toDate = date;
    if (this.toDate < this.fromDate) {
      this.fromDate = this.toDate;
    }
  }

  updateRangeByPreset(presetItem: PresetItem) {
    this.updateFromDate(presetItem.range.fromDate);
    this.updateToDate(presetItem.range.toDate);
  }

  applyNewDates(e) {
    this.rangeStoreService.updateRange(this.fromDate, this.toDate, true);
    this.disposeOverLay();
  }

  discardNewDates(e) {
    this.disposeOverLay();
  }

  private disposeOverLay() {
    this.overlayRef.dispose();
  }

  shouldSubmitBeDisabled(): boolean {
    // Using [disabled]="fromDate && toDate" wasn't working and even though JS knows what to do with it, the single statement return this.fromDate && this.toDate "isn't assignable to boolean"
    if (this.fromDate && this.toDate) {
      return false;
    }
    return true;
  }
}
