import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { hexEncode } from '@shared/lib/formatters/hexEncode';
import { isEqual } from 'lodash';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { loadFusionBodyParts } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-make-a-referral.actions';
import {
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  FusionPMExtensionDetail
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { DocumentTableItem } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import {
  getFusionAuthorizationDefaultHesReferralDetailId,
  getFusionAuthorizationDocuments,
  getFusionAuthorizations,
  isFusionAuthorizationLoaded
} from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-authorization.selectors';
import { getFusionBodyPartsForClaim } from '@shared/store/selectors/makeAReferral.selectors';
import {
  loadFusionPhysicalMedicineAuthorizations,
  loadFusionReferralDocuments,
  submitFusionPMExtension
} from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import { combineLatest, Observable } from 'rxjs';
import {
  getDecodedCustomerId,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { getUsername } from 'src/app/user/store/selectors/user.selectors';

function sanitizeBodyPartDescription(description: string, sideOfBody?: string) {
  if (sideOfBody && description.indexOf(sideOfBody) > -1) {
    return description.replace(/\s?-\s?[A-z]*/, '');
  } else {
    return description;
  }
}
@Component({
  selector: 'healthe-authorization-extension-modal',
  templateUrl: './pm-authorization-extension-modal.component.html',
  styleUrls: ['./pm-authorization-extension-modal.component.scss']
})
export class PmAuthorizationExtensionModalComponent extends DestroyableComponent
  implements OnInit {
  authorization: FusionAuthorization;

  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));

  fusionReferralAuthorizations$: Observable<
    FusionAuthorization[]
  > = this.store$.pipe(
    select(getFusionAuthorizations),
    distinctUntilChanged(isEqual)
  );
  hesReferralDetailIdForUploadDocuments$: Observable<string> = this.store$.pipe(
    select(getFusionAuthorizationDefaultHesReferralDetailId),
    takeUntil(this.onDestroy$)
  );

  bodyParts$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getFusionBodyPartsForClaim),
    map((bodyParts) =>
      bodyParts.map(
        (bodyPart) =>
          <FusionAuthorizationBodyPart>{
            id: bodyPart.ncciCode,
            description: bodyPart.desc,
            descOriginal: bodyPart.descOriginal,
            sideOfBody: bodyPart.sideOfBody,
            disabled: false
          }
      )
    )
  );

  isReferralAuthLoaded$ = this.store$.pipe(select(isFusionAuthorizationLoaded));

  fusionReferralDocuments$: Observable<DocumentTableItem[]> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getFusionAuthorizationDocuments),
    distinctUntilChanged(isEqual),
    map((documents) => {
      documents.forEach((document) => (document.readOnly = true));
      return documents;
    })
  );

  documentsArray: DocumentTableItem[] = [];

  isAuthLoaded = false;
  isAuthLoading = false;
  isAuthSubmitting = false;

  // Parent Form Group for the modal
  // the authorizations will contain a list of pmAuthFormGroup
  pmFormGroup: FormGroup = new FormGroup({
    documents: new FormArray([]),
    notes: new FormControl(),
    authorizations: new FormArray([])
  });

  hesReferralDetailIdForUploadDocuments: string;

  constructor(
    public store$: Store<any>,
    public matDialogRef: MatDialogRef<PmAuthorizationExtensionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.hesReferralDetailIdForUploadDocuments$.subscribe(
      (hesReferralDetailId) =>
        (this.hesReferralDetailIdForUploadDocuments = hesReferralDetailId)
    );
    // Load: Authorization & Load Body Parts & Documents
    combineLatest([this.encodedCustomerId$, this.encodedClaimNumber$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        if (!this.isAuthLoaded) {
          let referralEncoded = hexEncode(this.data.referralId.toString());
          // Get Authorizations then populate the authorizations FormArray
          this.store$.dispatch(
            loadFusionPhysicalMedicineAuthorizations({
              encodedReferralId: referralEncoded,
              encodedCustomerId,
              encodedClaimNumber
            })
          );

          // Body Parts
          this.store$.dispatch(
            loadFusionBodyParts({ encodedClaimNumber, encodedCustomerId })
          );

          // Documents
          this.store$.dispatch(
            loadFusionReferralDocuments({
              customerCode: encodedCustomerId,
              referralId: referralEncoded
            })
          );
        }
      });

    /**
     * Switched isLoading depending on archetype
     */
    this.isReferralAuthLoaded$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isLoaded) => {
        this.isAuthLoaded = isLoaded;
        this.changeDetectorRef.detectChanges();
      });
  }

  getSelectedDocuments(selectedDocs: DocumentTableItem[]) {
    this.documentsArray = selectedDocs;
  }

  submitExtension() {
    combineLatest([
      this.store$.pipe(select(getDecodedCustomerId)),
      this.store$.pipe(select(getUsername))
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([decodedCustomerId, userName]) => {
        let decodedReferralId = this.data.referralId;

        // Set extensions
        const extensionsFormArray = this.pmFormGroup.get(
          'authorizations'
        ) as FormArray;
        const extensions = extensionsFormArray.controls.map(
          (ext) => ext.value as FusionPMExtensionDetail
        );

        // Save Notes & Make sure we only send new body parts
        const notes = this.pmFormGroup.get('notes').value;

        extensions.forEach((ext) => {
          if (notes) {
            ext.noteList = [
              {
                description: notes,
                createdBy: userName,
                createdDate: null
              }
            ];
          }
          // Only send back not disabled body parts (new ones), and with BE supported data
          if (ext.bodyParts) {
            ext.bodyParts = ext.bodyParts
              .filter((filter) => !filter.disabled)
              .map(
                ({ id, description, descOriginal, sideOfBody, lastActionDate, status }) => ({
                  id,
                  sideOfBody,
                  description: descOriginal ? descOriginal : description,
                  lastActionDate,
                  status
                })
              );
            ext.bodyParts = this.fixBodyPartSelection(
              ext.bodyParts,
              ext.originalBodyParts
            );
          }
        });
        // Submit Extension
        this.store$.dispatch(
          submitFusionPMExtension({
            submitMessage: {
              referralId: decodedReferralId,
              customerId: decodedCustomerId,
              extensions: extensions
            }
          })
        );
        this.isAuthSubmitting = true;
      });
  }

  closeModal() {
    this.matDialogRef.close();
  }

  compareBodyParts(
    bodyPart1: FusionAuthorizationBodyPart,
    bodyPart2: FusionAuthorizationBodyPart
  ): boolean {
    return (
      bodyPart1 &&
      bodyPart2 &&
      bodyPart1.id?.toString() === bodyPart2.id?.toString() &&
      bodyPart1.sideOfBody?.trim() === bodyPart2.sideOfBody?.trim() &&
      bodyPart1.description?.trim() === bodyPart2.description?.trim()
    );
  }

  private fixBodyPartSelection(
    bodyParts: FusionAuthorizationBodyPart[],
    originalBodyParts: FusionAuthorizationBodyPart[]
  ) {
    const adjustedBodyPartList: FusionAuthorizationBodyPart[] = [];

    // First: is to find original body parts that were removed
    originalBodyParts.forEach((originalPart) => {
      let foundMatch = false;
      bodyParts.forEach((newPart) => {
        if (this.compareBodyParts(originalPart, newPart)) {
          foundMatch = true;
        }
      });

      if (false === foundMatch) {
        originalPart.status = 'Denied';
        adjustedBodyPartList.push(originalPart);
      }
    });

    // Second: add new parts that were not in the original list
    bodyParts.forEach((newPart) => {
      let foundMatch = false;
      originalBodyParts.forEach((originalPart) => {
        if (this.compareBodyParts(originalPart, newPart)) {
          foundMatch = true;
        }
      });

      if (false === foundMatch) {
        newPart.status = 'Approved';
        adjustedBodyPartList.push(newPart);
      }
    });

    return adjustedBodyPartList;
  }
}
