import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthorizationDenialReason } from '../../../store/models/pbm-authorization-information.model';
import { ActionOption } from '../../../store/models/action.option';

@Component({
  selector: 'healthe-authorization-action-deny-indefinitely',
  templateUrl: './authorization-action-deny-indefinitely.component.html',
  styleUrls: ['./authorization-action-deny-indefinitely.component.scss']
})
export class AuthorizationActionDenyIndefinitelyComponent implements OnInit {
  actionOption = ActionOption;

  @Input()
  index: number;

  @Input()
  formGroup: FormGroup;

  @Input()
  showDenialReasons: boolean;

  @Input()
  showSecondDenialReason: boolean;

  @Input()
  primaryDenialReasons$: Observable<AuthorizationDenialReason[]>;

  @Input()
  secondaryDenialReasons$: Observable<AuthorizationDenialReason[]>;

  constructor() {}

  ngOnInit(): void {}
}
