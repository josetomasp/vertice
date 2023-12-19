import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { faCheck, faClock } from '@fortawesome/pro-light-svg-icons';
import { ClaimSearchClaim } from '@shared/store/models';

@Component({
  selector: 'healthe-interventions-cell',
  templateUrl: './interventions-cell.component.html',
  styleUrls: ['./interventions-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterventionsCellComponent implements OnInit {
  @Input()
  claim: ClaimSearchClaim;

  faClock = faClock;
  faCheck = faCheck;

  interventionText: string = '';

  constructor() {}

  ngOnInit() {
    this.interventionText = this.claim.interventions
      .filter((i) => i.type !== 'reeval30days')
      .map((i) => i.action)
      .join(', ');
  }
}
