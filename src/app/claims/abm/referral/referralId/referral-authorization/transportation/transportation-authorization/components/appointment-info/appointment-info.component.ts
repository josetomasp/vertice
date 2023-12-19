import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ReferralAuthData } from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentInfoComponent implements OnInit {
  @Input()
  appointmentData: ReferralAuthData;

  @Input()
  sectionName: string = 'ERROR';

  constructor() {}

  ngOnInit() {}
}
