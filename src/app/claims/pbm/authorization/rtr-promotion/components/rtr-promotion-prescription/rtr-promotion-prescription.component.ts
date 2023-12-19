import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormGroupName,
  Validators
} from '@angular/forms';
import { PbmAuthNotesConfig } from '../../../store/models/pbm-authorization-information.model';
import { DrugInfoModalService } from '@shared/components/drug-info-modal/drug-info-modal.service';
import {
  discardReasonsValidator,
  otherReasonsValidator
} from './rtr-promotion-prescription.validators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
import { saveRxAuthLineItemNote } from '../../../store/actions/pbm-authorization-information.actions';
import * as _moment from 'moment';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../../store/models/root.models';
import {
  HealtheComponentConfig,
  HealtheGridConfigService
} from '@modules/healthe-grid';
import {
  FormGroupNamePassThrough,
  getParentFormGroup,
  getParentPath
} from '@modules/form-validation-extractor';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import { CompoundModalComponent } from '@shared/components/compound-modal/compound-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PBM_AUTH_NOTES_DEFAULT_STATE } from '../../../store/models/pbm-auth-notes-default-state';
import { AuthorizationLineItem } from '../../../store/models/pbm-authorization-information/authorization-line-item.models';
import { PbmAuthorizationNote } from '../../../store/models/pbm-authorization-information/pbm-authorization-note.models';
import { PrescriberInformationLookupModel } from '@modules/prescriber-information-lookup';

const moment = _moment;

@Component({
  selector: 'healthe-rtr-promotion-prescription',
  templateUrl: './rtr-promotion-prescription.component.html',
  styleUrls: ['./rtr-promotion-prescription.component.scss']
})
export class RtrPromotionPrescriptionComponent
  extends DestroyableComponent
  implements OnInit, FormGroupNamePassThrough
{
  @Input()
  discardReasons: string[];

  @Input()
  authorizationLineItem: AuthorizationLineItem;

  @Input()
  decodedAuthId = 0;

  @Input()
  userName = '';

  @Input()
  index = 0;

  @Output()
  createEPAQValueChange: EventEmitter<any> = new EventEmitter<any>();

  public get parentFormGroup(): FormGroup {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  prescriberBuilderConfig: HealtheComponentConfig;
  prescriberInformationLookupInitialValues: PrescriberInformationLookupModel;

  prescriptionNotesConfig: PbmAuthNotesConfig = {
    ...PBM_AUTH_NOTES_DEFAULT_STATE,
    warnAboutSavingNote: false,
    autoExpandWhenNotesPresent: false
  };

  faExclamationCircle = faExclamationCircle;
  allowPromoteChoice = false;
  allowDiscardChoice = false;

  constructor(
    public drugLookupService: DrugInfoModalService,
    public gCS: HealtheGridConfigService,
    public store$: Store<RootState>,
    public dialog: MatDialog,
    @Inject(ControlContainer) public parent: FormGroupName,
    @Inject(FormGroupDirective) public formGroupDirective: FormGroupDirective
  ) {
    super();
  }

  public get parentPath(): string[] {
    return getParentPath(this.parent);
  }

  ngOnInit() {
    this.parent.control.addControl('prescriberInfoFG', new FormGroup({}));
    if (this.authorizationLineItem?.prescriber) {
      this.prescriberInformationLookupInitialValues = {
        prescriberFirstName: this.authorizationLineItem.prescriber.name,
        prescriberId: this.authorizationLineItem.prescriber.prescriberId,
        prescriberLastName: this.authorizationLineItem.prescriber.lastName,
        prescriberPhone: this.authorizationLineItem.prescriber.primaryPhone
      };
    } else {
      this.prescriberInformationLookupInitialValues = {
        prescriberFirstName: '',
        prescriberId: '',
        prescriberLastName: '',
        prescriberPhone: ''
      };
    }

    this.parent.control.addControl(
      'CreateEpaq',
      new FormControl(null, Validators.required)
    );

    this.parent.control
      .get('CreateEpaq')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => this.createEPAQValueChange.emit());

    this.parent.control.addControl(
      'authLineItemID',
      new FormControl(this.authorizationLineItem.posLineItemKey)
    );

    this.parent.control.addControl(
      'discardReasons',
      new FormControl(null, [discardReasonsValidator])
    );

    this.parent.control.addControl(
      'otherReason',
      new FormControl(null, [otherReasonsValidator])
    );
    this.parent.control.addControl('note', new FormControl(null));

    this.parent.control.controls['CreateEpaq'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.parent.control.controls['discardReasons'].updateValueAndValidity();
        this.parent.control.controls['otherReason'].updateValueAndValidity();
      });

    this.parent.control.controls['discardReasons'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.parent.control.controls['otherReason'].updateValueAndValidity();
      });

    this.prescriberBuilderConfig =
      this.createPbmComponentConfigForPrescriberInfo(
        this.authorizationLineItem
      );

    if (null != this.authorizationLineItem.permissibleActionsForCurrentUser) {
      this.authorizationLineItem.permissibleActionsForCurrentUser.forEach(
        (action) => {
          switch (action) {
            default:
              break;

            case 'PROMOTE':
              this.allowPromoteChoice = true;
              break;

            case 'DISCARD':
              this.allowDiscardChoice = true;
              break;
          }
        }
      );
    }
  }

  createPbmComponentConfigForPrescriberInfo(
    lineItem: AuthorizationLineItem
  ): HealtheComponentConfig {
    return this.gCS
      .configureGrid({
        includeLabels: true,
        includeFormGroup: false,
        flex: {
          gap: '24px',
          basis: '8',
          justifyContent: 'start',
          alignItems: 'start',
          direction: 'row'
        }
      })
      .row((rowBuilder) => {
        rowBuilder
          .text(lineItem.dateFilled, 'SERVICE DATE', '0')
          .text(lineItem.quantity, 'QTY', '0')
          .text(lineItem.daysSupply, 'DAYS SUPPLY', '0')
          .money(lineItem.totalAwp, 'TOTAL AWP', '0')
          .text('', '', '0');
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        if (
          lineItem.compound ||
          lineItem.drugGPI?.toLowerCase().includes('unknown') === false
        ) {
          rowBuilder.drugOrCompound(
            {
              ndc: lineItem.ndc,
              quantity: lineItem.quantity,
              createdDate: lineItem.dateFilled,
              displayText: lineItem.compound
                ? 'Compound'
                : lineItem.drugDisplayName,
              compound: lineItem.compound,
              compoundModalData: {
                dispenseFees: lineItem.dispensingFee,
                ingredients: lineItem.ingredients.map((ing) => {
                  return {
                    ndc: ing.ndc,
                    drugName: ing.name,
                    quantity: ing.quantity,
                    rejectCode: ing.rejectCode,
                    createdDate: lineItem.dateFilled,
                    rejectReason:
                      lineItem.reasons && lineItem.reasons.length > 0
                        ? lineItem.reasons[0]
                        : { description: '', ncpdpRejectCode: '' },
                    canItOpenLookupModal:
                      this.canIngredientLabelOpenLookupModal(ing.name, ing.ndc)
                  };
                })
              }
            },
            'MEDICATION DETAIL',
            '0',
            {
              position: 'label',
              tooltipMessage:
                'Some drugs may display a generic name before the generic drug is available.'
            }
          );
        } else {
          rowBuilder.text(lineItem.drugDisplayName, 'MEDICATION DETAIL', '0');
        }

        rowBuilder
          .text(lineItem.brand, 'BRAND/GENERIC', '0', {
            position: 'label',
            tooltipMessage:
              'Authorized generics or single-source generics may show “No generic available” because there are no alternate generics available on the market.'
          })
          .text(lineItem.rxNumber, 'RX NUMBER', '0')
          .text(
            lineItem.inFormulary ? 'Yes - Limits may apply' : 'No',
            'IN FORMULARY',
            '0'
          )

          .text(lineItem.deaClass, 'DEA DRUG CLASS', '0');
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        rowBuilder
          .text(lineItem.previousDecision, 'PREVIOUS DECISION', '0')
          .text(lineItem.previousDecisionDate, 'PREV. DECISION DATE', '0')
          .text(lineItem.mostRecentQuantity, 'PREV. REQUEST QTY.', '0')
          .text(
            lineItem.mostRecentDaysSupply,
            'PREV. REQUESTED DAYS SUPPLY',
            '0'
          )
          .text(
            lineItem.estimatedDaysSupplyOnHand,
            'DAYS SUPPLY ON HAND',
            '0',
            {
              position: 'label',
              tooltipMessage:
                'Days’ Supply on Hand is an estimation of current possession based on dispensed medication (not including this Rx) and may not represent actual on-hand supply in some scenarios (e.g., taking more or less than prescribed, lost prescriptions).'
            }
          );
      })
      .build();
  }

  addNoteToPrescription(note: string) {
    // The note only needs the comment and the parentId to be saved
    let newNote: PbmAuthorizationNote = {
      comment: note,
      userId: this.userName,
      userModified: this.userName,
      userRole: null,
      noteId: null,
      parentId: this.authorizationLineItem.posLineItemKey,
      dateTimeCreated: moment(new Date()).format('hh:mm A MM/DD/YYYY'),
      dateTimeModified: moment(new Date()).format('hh:mm A MM/DD/YYYY')
    };
    this.authorizationLineItem.notes.push(newNote);
    this.store$.dispatch(
      saveRxAuthLineItemNote({
        note: newNote,
        authorizationId: this.decodedAuthId
      })
    );
  }

  openDrugOrCompoundModal() {
    if (this.authorizationLineItem.compound) {
      this.dialog.open(CompoundModalComponent, {
        autoFocus: false,
        width: '700px',
        data: {
          dispenseFees: this.authorizationLineItem.dispensingFee,
          ingredients: this.authorizationLineItem.ingredients.map((ing) => {
            return {
              ndc: ing.ndc,
              drugName: ing.name,
              quantity: ing.quantity,
              rejectCode: ing.rejectCode,
              createdDate: this.authorizationLineItem.dateFilled,
              rejectReason:
                this.authorizationLineItem.reasons &&
                this.authorizationLineItem.reasons.length > 0
                  ? this.authorizationLineItem.reasons[0]
                  : { description: '', ncpdpRejectCode: '' }
            };
          })
        }
      });
    } else {
      this.drugLookupService.showDrugInfoModal(
        this.authorizationLineItem.ndc,
        this.authorizationLineItem.dateFilled,
        this.authorizationLineItem.quantity
      );
    }
  }

  canIngredientLabelOpenLookupModal(
    ingredientName: string,
    ingredientNdc: string
  ): boolean {
    if (
      ingredientNdc !== null &&
      ingredientName.toLowerCase().includes('unknown') === false
    ) {
      return true;
    } else if (
      ingredientNdc === null ||
      ingredientName.toLowerCase().includes('unknown')
    ) {
      return false;
    }
  }
}
