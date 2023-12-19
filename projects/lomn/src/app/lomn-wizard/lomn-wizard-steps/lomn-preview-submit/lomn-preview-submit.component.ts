import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  OnInit
} from '@angular/core';
import { FormArray } from '@angular/forms';
import {
  LOMNSubmitContactInfo,
  LOMNSubmitMessage
} from '../../../store/models/create-lomn.models';
import { AuthorizationLineItem } from '../../../store/models/pbm-authorization-information.model';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isNil } from 'lodash';
import { select, Store } from '@ngrx/store';
import { getAuthorizationId } from '../../../store/selectors/pbm-authorization-information.selectors';

@Component({
  selector: 'healthe-lomn-preview-submit',
  templateUrl: './lomn-preview-submit.component.html',
  styleUrls: ['./lomn-preview-submit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnPreviewSubmitComponent implements OnDestroy, OnInit {
  private onDestroy$ = new Subject();
  private formArraySubscription;
  private _medicationListFormArray: FormArray;
  private _letterTypes: { [key: string]: string } = {};
  @Input()
  ndcToLineItemMap: { [ndc: string]: AuthorizationLineItem };
  @Input()
  claimantAndAttorneyFormInvalid: boolean;

  @Input()
  set letterTypes(letterTypes: { [key: string]: string }) {
    this._letterTypes = letterTypes;
    this.changeDetectorRef.detectChanges();
  }

  get letterTypes() {
    return this._letterTypes;
  }
  @Input()
  set medicationListFormArray(formArray: FormArray) {
    this._medicationListFormArray = formArray;
    if (this.formArraySubscription) {
      this.formArraySubscription.unsubscribe();
    }
    this.formArraySubscription = this._medicationListFormArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  get medicationListFormArray(): FormArray {
    return this._medicationListFormArray;
  }

  @Input()
  claimantContactInfo: LOMNSubmitContactInfo;
  @Input()
  attorneyInfo: LOMNSubmitContactInfo;
  @Input()
  claimNumber: string;
  @Input()
  customerId: string;

  @Output()
  previewLomn: EventEmitter<LOMNSubmitMessage> = new EventEmitter();

  authorizationId$: Observable<number> = this.store$.pipe(
    select(getAuthorizationId),
    takeUntil(this.onDestroy$),
    filter((authorizationId) => !isNil(authorizationId))
  );

  isPosAuth: boolean = true;
  authorizationId: number;

  constructor(
    public store$: Store<any>,
    public changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (-1 === this.router.url.indexOf('/pos/')) {
      this.isPosAuth = false;
    }

    this.authorizationId$.subscribe((authorizationId) => {
      this.authorizationId = authorizationId;
    });
  }

  previewLOMN(lineItemForm) {
    this.previewLomn.emit({
      ...this.ndcToLineItemMap[lineItemForm.ndc],
      ...lineItemForm,
      comment: lineItemForm.displayNotes,
      attorney: this.attorneyInfo,
      claimant: this.claimantContactInfo,
      claimNo: this.claimNumber,
      customerID: this.customerId,
      paperBillKey: this.isPosAuth ? null : this.authorizationId,
      authorizationKey: this.isPosAuth ? this.authorizationId : null
    });
  }

  getLetterTypeByNDC(ndc: string) {
    return this.letterTypes[ndc] || '';
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
