import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { faClipboardListCheck } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-reasons-banner',
  templateUrl: './reasons-banner.component.html',
  styleUrls: ['./reasons-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReasonsBannerComponent implements OnInit {
  @Input()
  reasons: string[];
  clipboard = faClipboardListCheck;
  constructor() {}

  ngOnInit() {}
}
