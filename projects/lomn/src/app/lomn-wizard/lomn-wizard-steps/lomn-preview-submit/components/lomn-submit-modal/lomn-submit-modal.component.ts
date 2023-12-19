import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import {
  CreateLOMNSubmitMessage,
  LOMNSubmitContactInfo
} from '../../../../../store/models/create-lomn.models';
import { submitCreateLOMN } from '../../../../../store/actions/create-lomn.actions';
import { AuthorizationLineItem } from '../../../../../store/models/pbm-authorization-information.model';

@Component({
  selector: 'healthe-lomn-submit-modal',
  templateUrl: './lomn-submit-modal.component.html',
  styleUrls: ['./lomn-submit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnSubmitModalComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  private onDestroy$ = new Subject();
  constructor(
    public store$: Store<any>,
    public matDialogRef: MatDialogRef<LomnSubmitModalComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public submitData: {
      submitMessage;
      ndcToLineItemMap: { [ndc: string]: AuthorizationLineItem };
      submittingLOMN$: Observable<boolean>;
      submittingResponse$: Observable<boolean>;
      claimantContactInfo: LOMNSubmitContactInfo;
      attorneyContactInfo: LOMNSubmitContactInfo;
    }
  ) {}

  ngOnInit() {}

  submit() {
    const { submitMessage } = this.submitData;
    this.isSubmitting = true;
    this.changeDetectorRef.detectChanges();
    this.store$.dispatch(submitCreateLOMN({ submitMessage }));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
