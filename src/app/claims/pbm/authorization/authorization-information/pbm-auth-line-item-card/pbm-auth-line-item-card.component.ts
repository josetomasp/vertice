import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AuthorizationDenialReason,
  AuthorizationDetails,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmInfoAndActionsData
} from '../../store/models/pbm-authorization-information.model';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import * as _moment from 'moment';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormGroupName,
  Validators
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { PbmAuthNotesComponent } from '../pbm-auth-notes/pbm-auth-notes.component';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { saveRxAuthLineItemNote } from '../../store/actions/pbm-authorization-information.actions';
import {
  FormGroupNamePassThrough,
  getParentFormGroup,
  getParentPath,
  FormValidationExtractorService
} from '@modules/form-validation-extractor';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { ActionOption } from '../../store/models/action.option';
import { SaveDecisionRequest } from '../../store/models/pbm-authorization.models';
import { CurrencyPipe } from '@angular/common';
import { AuthorizationLineItem } from '../../store/models/pbm-authorization-information/authorization-line-item.models';
import {
  PbmAuthorizationNote
} from '../../store/models/pbm-authorization-information/pbm-authorization-note.models';
import {
  BannerAlertType
} from '../../../../../shared/components/alert-info-banner/alert-info-banner.component';

const moment = _moment;

@Component({
  selector: 'healthe-pbm-auth-line-item-card',
  templateUrl: './pbm-auth-line-item-card.component.html',
  styleUrls: ['./pbm-auth-line-item-card.component.scss'],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PbmAuthLineItemCardComponent
  extends DestroyableComponent
  implements FormGroupNamePassThrough, OnDestroy, AfterViewInit, OnChanges
{
  public get parentFormGroup(): FormGroup {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  public get parentPath(): string[] {
    return getParentPath(this.parent);
  }

  @Input()
  lineItem: AuthorizationLineItem;

  @Input()
  authorizationDetails: AuthorizationDetails;

  @Input()
  denialReasons: AuthorizationDenialReason[];

  @Input()
  showDenialReasons: boolean;

  @Input()
  showSecondDenialReason: boolean;

  @Input()
  actionCardConfig: {
    actionFormConfig: PbmInfoAndActionsData;
    prescriberFormConfig: HealtheComponentConfig;
    authorizationId: number;
    authorizationType: string;
    mode: PbmAuthFormMode;
  };

  @Input()
  notesConfig: PbmAuthNotesConfig;

  @Input()
  actionLabel: string;

  @Input()
  index: number;

  @Input()
  userName: string;

  @Input()
  userIsInternal: boolean = false;

  @Output()
  priorAuthErrorsEmitter: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  saveLineItemDecisionEvent: EventEmitter<SaveDecisionRequest> = new EventEmitter<SaveDecisionRequest>();

  @Output()
  submittedClickedBefore = new EventEmitter();

  @Output()
  formValuesChanged = new EventEmitter();

  PbmAuthFormMode = PbmAuthFormMode;
  get mode(): PbmAuthFormMode {
    if (
      this.actionCardConfig.mode === PbmAuthFormMode.ReadOnly &&
      this.notesConfig
    ) {
      this.notesConfig.mode = this.actionCardConfig.mode;
    }
    return this.actionCardConfig.mode;
  }

  @ViewChild('prescriptionNotes')
  notesSection: PbmAuthNotesComponent;

  drugType: BannerAlertType = BannerAlertType.DrugBanner;

  actionOption = ActionOption;

  reasons: string[];

  constructor(
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective,
    private fb: FormBuilder,
    private fVES: FormValidationExtractorService,
    public store$: Store<RootState>,
    private currencyPipe: CurrencyPipe
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lineItem']) {
      this.reasons = this.lineItem.reasons?.map(reason => reason.description) ?? [];
    }
  }

  ngAfterViewInit(): void {
    if (this.mode === PbmAuthFormMode.ReadWrite) {
      this.parentFormGroup
        .get('action')
        .valueChanges.pipe(takeUntil(this.onDestroy$))
        .subscribe((action) => {
          this.checkIfPendNotesRequired(action);
        });

      this.parentFormGroup.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.formValuesChanged.emit();
        });
    }

    this.fVES.registerErrorMessage({
      maxAmountExceededWhenApprove:
        "Can't be greater than " +
        this.currencyPipe.transform(this.lineItem.originalTotalAmount)
    });
  }

  addNoteToPrescription(note: string, lineItem: AuthorizationLineItem) {
    // The note only needs the comment and the parentId to be saved
    let newNote: PbmAuthorizationNote = {
      comment: note,
      userId: this.userName,
      userModified: this.userName,
      userRole: null,
      noteId: null,
      parentId: lineItem.posLineItemKey,
      dateTimeCreated: moment(new Date()).format('hh:mm A MM/DD/YYYY'),
      dateTimeModified: moment(new Date()).format('hh:mm A MM/DD/YYYY')
    };
    lineItem.notes.push(newNote);
    this.store$.dispatch(
      saveRxAuthLineItemNote({
        note: newNote,
        authorizationId: this.actionCardConfig.authorizationId
      })
    );
    this.checkIfPendNotesRequired();
  }

  checkIfPendNotesRequired(currentAction?: string) {
    if (
      this.notesConfig &&
      this.notesConfig.pendActionCondition &&
      this.notesSection
    ) {
      const action = currentAction
        ? currentAction
        : this.parentFormGroup.get('action').value;
      if (action === this.actionOption.pend) {
        this.notesConfig.requiredErrorMessage =
          'Explanatory comments are required if pending is selected for any item.';
        if (!this.notesSection.expansionPanelComponent.expanded) {
          this.notesSection.expansionPanelComponent.open();
        }
      } else {
        this.notesConfig.requiredErrorMessage = 'Please enter a note.';
        if (
          this.notesSection.expansionPanelComponent.expanded &&
          this.notesSection.notes.length === 0
        ) {
          this.notesSection.expansionPanelComponent.close();
        }
      }
      this.checkUserNotesInput(action === this.actionOption.pend);
    }
  }

  checkUserNotesInput(isPendNoteRequired: boolean) {
    const userNoteIndex = this.notesSection.notes.findIndex(
      (note: PbmAuthorizationNote) =>
        note.userRole !== 'HES' && note.userRole !== 'SYSTEM'
    );
    if (userNoteIndex === -1 && isPendNoteRequired) {
      this.parentFormGroup.get('note').setValidators(Validators.required);
      this.parentFormGroup.get('note').markAsTouched();
      if (
        this.lineItem.previousDecisionNote &&
        (this.actionCardConfig.authorizationType === 'ExpiringAuthorization' ||
          this.actionCardConfig.authorizationType === 'Historical')
      ) {
        this.parentFormGroup
          .get('note')
          .setValue(this.lineItem.previousDecisionNote);
      } else {
        this.notesSection.lastElement.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        });
        setTimeout(() => {
          this.notesSection.notesInputElement.focus();
        }, 1000);
      }
    } else {
      this.parentFormGroup.get('note').clearValidators();
      const currentNote = this.parentFormGroup.get('note').value
        ? this.parentFormGroup.get('note').value
        : '';
      const previousDecisionNote = this.lineItem.previousDecisionNote
        ? this.lineItem.previousDecisionNote
        : '';
      if (currentNote.trim() === previousDecisionNote.trim()) {
        this.parentFormGroup.get('note').setValue(null);
      }
    }
    this.parentFormGroup.get('note').updateValueAndValidity();
  }
  priorAuthErrors(errors: string[]) {
    this.priorAuthErrorsEmitter.next(errors);
  }
  saveLineItemDecision(event: SaveDecisionRequest) {
    this.saveLineItemDecisionEvent.emit(event);
  }
}
