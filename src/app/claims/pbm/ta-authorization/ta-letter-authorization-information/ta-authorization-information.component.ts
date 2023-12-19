import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faFlag,
  faTriangleExclamation
} from '@fortawesome/pro-light-svg-icons';
import { TaAuthorizationStore } from '../ta-authorization.store';
import { Observable } from 'rxjs';
import {
  TaAuthorizationInformationViewModel,
  TaLetterFormModel
} from '../ta-authorization.ui-models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  ErrorMessage,
  FormValidationExtractorService
} from '@modules/form-validation-extractor';
import { ServerErrorOverlayAnchorDirective } from '@modules/server-error-overlay/server-error-overlay-anchor.directive';
import {
    ServerErrorGlobalOverlay
} from "@modules/server-error-overlay/server-error-overlay.service";

@Component({
  selector: 'healthe-ta-authorization-information',
  templateUrl: './ta-authorization-information.component.html',
  styleUrls: ['./ta-authorization-information.component.scss'],
  providers: []
})
export class TaAuthorizationInformationComponent implements OnInit {
  @ViewChild(ServerErrorOverlayAnchorDirective)
  serverErrorOverlay: ServerErrorOverlayAnchorDirective;
  // TODO: remove partial once every thing is connected
  viewModel$: Observable<Partial<TaAuthorizationInformationViewModel>> =
    this.taAuthStore.select(
      ({
        exParteMessage,
        taLetterFormState,
        showContactForms,
        pharmacies,
        prescribingPhysicians,
        stateOptions,
        denialReasons,
        showMiscellaneousReason,
        miscellaneousReasonCharactersLeft,
        showDenialReasons,
        showAttorneyInformationForm,
        isTaAuthorizationLoading,
        serverErrors
      }) => ({
        exParteMessage,
        taLetterFormState,
        showContactForms,
        pharmacies,
        prescribingPhysicians,
        stateOptions,
        denialReasons,
        showMiscellaneousReason,
        miscellaneousReasonCharactersLeft: miscellaneousReasonCharactersLeft,
        showDenialReasons,
        showAttorneyInformationForm,
        isTaAuthorizationLoading,
        serverErrors
      })
    );
  faFlag = faFlag;
  //TODO: There will be a flag for determining whether we show the claimant info
  // and or the attorney info forms
  taAuthFormGroup = new FormGroup({
    actionForm: new FormGroup({
      action: new FormControl(null, Validators.required),
      denialReason: new FormControl(null, Validators.required),
      miscellaneousReason: new FormControl('', Validators.required)
    }),
    attorneyInvolvement: new FormControl(),
    claimantContactInformationForm: new FormGroup({
      phone: new FormControl(),
      ...buildAddressForm()
    }),
    attorneyInformationForm: new FormGroup({
      attorneyName: new FormControl(),
      phone: new FormControl(),
      fax: new FormControl(),
      email: new FormControl(),
      ...buildAddressForm()
    })
  });
  faExclamationTriangle = faTriangleExclamation;
  constructor(
    public taAuthStore: TaAuthorizationStore,
    public fve: FormValidationExtractorService,
    public globalOverlay: ServerErrorGlobalOverlay
  ) {}

  ngOnInit(): void {
    this.viewModel$
      .pipe(
        map(({ taLetterFormState }) => taLetterFormState),
        distinctUntilChanged((a, b) => {
          return JSON.stringify(a) === JSON.stringify(b);
        })
      )
      .subscribe((taLetterFormState) => {
        this.taAuthFormGroup.patchValue(taLetterFormState);
        this.formOrchestrator(taLetterFormState);
      });
    this.taAuthFormGroup.valueChanges
      .pipe(
        distinctUntilChanged((a, b) => {
          return JSON.stringify(a) === JSON.stringify(b);
        })
      )
      .subscribe(this.formOrchestrator.bind(this));
  }

  formOrchestrator(formModel: TaLetterFormModel) {
    const showDenialReasons = formModel.actionForm.action === 'Deny';
    const showMiscellaneousReason =
      showDenialReasons &&
      formModel.actionForm.denialReason === 'Miscellaneous';
    this.taAuthStore.setShowDenialReasons(showDenialReasons);
    this.taAuthStore.setShowMiscellaneousReason(showMiscellaneousReason);
    this.taAuthStore.setShowAttorneyInformationForm(
      formModel.attorneyInvolvement
    );
    if (formModel.attorneyInvolvement) {
      this.taAuthFormGroup.get('attorneyInformationForm').enable();
    } else {
      this.taAuthFormGroup.get('attorneyInformationForm').disable();
    }
    if (showMiscellaneousReason) {
      this.taAuthFormGroup.get('actionForm.miscellaneousReason').enable();
      this.taAuthStore.setMiscellaneousReasonCharactersLeft(
        1000 - (formModel.actionForm.miscellaneousReason?.length ?? 0)
      );
    } else {
      this.taAuthFormGroup.get('actionForm.miscellaneousReason').disable();
    }
  }

  clickErrorLine(error: ErrorMessage) {
    error.for.scrollIntoView({ block: 'center', inline: 'center' });
    error.for.focus();
  }
}
function buildAddressForm(): { [key: string]: AbstractControl } {
  return {
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl(),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required)
  };
}
