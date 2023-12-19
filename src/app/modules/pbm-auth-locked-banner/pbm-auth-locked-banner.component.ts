import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faLock } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'healthe-pbm-auth-locked-banner',
  templateUrl: './pbm-auth-locked-banner.component.html',
  styleUrls: ['./pbm-auth-locked-banner.component.scss']
})
export class PbmAuthLockedBannerComponent implements OnInit {
  faLock = faLock;
  @Input()
  lockedMessage: string;

  @Input()
  isUserInternal: boolean = false;

  @Input()
  isUnlocking: boolean = false;

  @Output()
  unlock: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}
}
