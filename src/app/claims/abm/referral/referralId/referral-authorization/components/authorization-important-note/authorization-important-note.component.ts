import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { Observable } from 'rxjs';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-authorization-important-note',
  templateUrl: './authorization-important-note.component.html',
  styleUrls: ['./authorization-important-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationImportantNoteComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  abmClaimStatus$: Observable<ClaimStatusEnum>;

  alertType = AlertType.WARNING;

  statusActive = ClaimStatusEnum.ACTIVE;

  showImportantNote: boolean = false;

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.abmClaimStatus$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((abmClaimStatus) => {
        if (null != abmClaimStatus) {
          if (abmClaimStatus !== this.statusActive) {
            this.showImportantNote = true;
          } else {
            this.showImportantNote = false;
          }
        }
        this.ref.detectChanges();
      });
  }
}
