import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable } from 'rxjs';

import { ErrorSharedMakeAReferral } from '../../../store/models/shared-make-a-referral.models';

@Component({
  selector: 'healthe-mar-submit-error-banner',
  templateUrl: './mar-submit-error-banner.component.html',
  styleUrls: ['./mar-submit-error-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MarSubmitErrorBannerComponent implements OnInit {
  @Input() errors$: Observable<ErrorSharedMakeAReferral[]>;
  @Input() partialFail = false;
  @ViewChild(MatExpansionPanel, { static: true })
  matExpansionPanelElement: MatExpansionPanel;
  expanded = true;

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
