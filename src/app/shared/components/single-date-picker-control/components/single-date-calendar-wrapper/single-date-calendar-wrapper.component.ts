import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { HealtheUIComponent } from '@healthe/vertice-library';
import { ConfigStoreService } from '../../config-store.service';

@Component({
  selector: 'healthe-single-date-calendar-wrapper',
  templateUrl: './single-date-calendar-wrapper.component.html',
  styleUrls: ['./single-date-calendar-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleDateCalendarWrapperComponent extends HealtheUIComponent
  implements OnChanges, OnInit {
  @ViewChild(MatCalendar, { static: true })
  matCalendar: MatCalendar<Date>;
  @Output()
  readonly selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  dateFormat: string;
  @Input() selectedDate: Date;
  @Input() prefixLabel: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() fromDate: Date;
  public idPrefix = 'datepicker';

  constructor(private configStore: ConfigStoreService, elementRef: ElementRef) {
    super(elementRef);
    this.dateFormat = configStore.singleDateOptions.format;
    if (configStore.singleDateOptions.excludeWeekends) {
      this.weekendFilter = (d: Date): boolean => {
        const day = d.getDay();
        return day !== 0 && day !== 6;
      };
    }
  }

  weekendFilter = (d: Date) => true;

  ngOnChanges(changes: SimpleChanges) {
    // Necessary to force view refresh
    this.matCalendar.activeDate = changes.selectedDate
      ? changes.selectedDate.currentValue
      : this.matCalendar.activeDate;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onSelectedChange(date) {
    this.selectedDateChange.emit(date);
  }

  onYearSelected(e) {}

  onUserSelection(e) {}
}
