import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { HealtheUIComponent } from '@healthe/vertice-library';
import { PresetItem } from '@healthe/vertice-library/src/app/lib/daterange/public_api';

@Component({
  selector: 'healthe-single-date-presets',
  templateUrl: './single-date-presets.component.html',
  styleUrls: ['./single-date-presets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleDatePresetsComponent extends HealtheUIComponent
  implements OnInit {
  @Input()
  presets: Array<PresetItem>;
  @Output()
  readonly presetChanged: EventEmitter<any> = new EventEmitter<any>();
  public idPrefix = 'singlePreset';

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setPresetPeriod(event) {
    this.presetChanged.emit(event);
  }
}
