import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  HealtheComponentConfig,
  HealtheGridComponentType
} from '@modules/healthe-grid';

@Component({
  selector: 'healthe-pbm-auth-details-inset-card',
  templateUrl: './pbm-auth-details-inset-card.component.html',
  styleUrls: ['./pbm-auth-details-inset-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PbmAuthDetailsInsetCardComponent implements OnInit {
  componentType = HealtheGridComponentType;

  @Input()
  componentConfig: HealtheComponentConfig;

  constructor() {}

  ngOnInit() {}
}
