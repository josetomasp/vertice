import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClaimAction } from '@shared/store/models';

@Component({
  selector: 'healthe-previous-actions-display',
  templateUrl: './previous-actions-display.component.html',
  styleUrls: ['./previous-actions-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviousActionsDisplayComponent {
  @Input()
  previousActions: Array<ClaimAction>;
  @Input()
  index: number = 0;

  constructor() {}

  getTooltip() {
    const actions = [];
    this.previousActions.forEach((action) => {
      actions.push(
        `${action.type.toUpperCase()} (${action.status} - ${action.date})`
      );
    });
    return actions.join('\n');
  }
}
