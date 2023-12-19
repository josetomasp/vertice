import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'healthe-error-banner',
  templateUrl: './error-banner.component.html',
  styleUrls: ['./error-banner.component.scss']
})
export class ErrorBannerComponent implements OnInit {
  @Input() errorMessages: string[] = [];
  @Input() bannerTitle = 'Please Set a Banner Title';

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {}
}
