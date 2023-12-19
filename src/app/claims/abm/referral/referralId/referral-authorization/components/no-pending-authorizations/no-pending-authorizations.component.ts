import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'healthe-no-pending-authorizations',
  templateUrl: './no-pending-authorizations.component.html',
  styleUrls: ['./no-pending-authorizations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoPendingAuthorizationsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
