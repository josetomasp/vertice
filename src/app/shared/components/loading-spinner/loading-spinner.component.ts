import { Component, Input, OnInit } from '@angular/core';

/**
 * @deprecated look into making a template directive like the error overlay.
 * @see {ServerErrorOverlayAnchorDirective}
 */
@Component({
  selector: 'healthe-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input()
  loadingVerbiage: string;

  constructor() {}

  ngOnInit() {}
}
