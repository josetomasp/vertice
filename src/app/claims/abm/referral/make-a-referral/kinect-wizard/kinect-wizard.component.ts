import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectableService } from '../../store/models/make-a-referral.models';
import { MakeAReferralService } from '../make-a-referral.service';
import { ActivatedRoute } from '@angular/router';
import { KinectWizardService } from './kinect-wizard.service';
import { combineLatest, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import { RootState } from '../../../../../store/models/root.models';
import { first } from 'rxjs/operators';
import { tapResponse } from '@ngrx/component-store';
import { KinectCreateReferralResponse } from './kinect-wizard.models';
import {
  GenericWizardComponent
} from '@modules/generic-wizard/generic-wizard/generic-wizard.component';
import { HealtheSelectOption } from '@shared';

@Component({
  selector: 'healthe-kinect-wizard',
  templateUrl: './kinect-wizard.component.html',
  styleUrls: ['./kinect-wizard.component.scss']
})
export class KinectWizardComponent implements OnInit, OnDestroy {
  @Input()
  service: SelectableService;

  @ViewChild('genericWizard')
  genericWizard: GenericWizardComponent;

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );

  kinectCreateReferralResponse: KinectCreateReferralResponse;
  didSuccessfullyCompleteReferral = false;

  constructor(
    private makeAReferralService: MakeAReferralService,
    private kinectWizardService: KinectWizardService,
    private store$: Store<RootState>,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    combineLatest([this.encodedClaimNumber$, this.encodedCustomerId$])
      .pipe(first())
      .subscribe(([claimNumber, customerId]) => {
        this.kinectWizardService
          .createKinectReferral({
            claimNumber,
            customerId,
            type: this.service.serviceCode
          })
          .pipe(
            first(),
            tapResponse(
              (retVal) => {
                this.kinectCreateReferralResponse = retVal;
                const options = this.kinectCreateReferralResponse.vendors.map<
                  HealtheSelectOption<string>
                >((rawVendor) => {
                  return {
                    label: rawVendor.displayName,
                    value: rawVendor.partnerId
                  };
                });
                this.genericWizard.store.setOptionsByFormControlName({
                  formControlName: 'vendors',
                  options
                });
              },
              (error) => {
                console.error('Failed to create a referral');
              }
            )
          )
          .subscribe();
      });
  }

  submit(formState: { [key: string]: any }) {
    const formData = new FormData();
    formData.set('referralId', this.kinectCreateReferralResponse.referralId);
    for (let key in formState) {
      if (key === 'documents') {
        for (let document of formState['documents']) {
          formData.append('documents', document.file, document.fileName);
        }
      } else {
        if (key === this.service.serviceType) {
          formData.set('notes', formState[key]['notes']);
        } else {
          formData.set(key, formState[key]);
        }
      }
    }

    this.kinectWizardService
      .submitKinectReferral(
        this.kinectCreateReferralResponse.referralId,
        formData
      )
      .pipe(
        first(),
        tapResponse(
          (response) => {
            this.didSuccessfullyCompleteReferral = true;
            this.genericWizard.submit(
              `You have successfully submitted this referral with Referral ID "${this.kinectCreateReferralResponse.referralId}"`,
              'Please note that further communication regarding this referral must be directed towards the referral\'s assigned vendor.'
            );
          },
          (error) => {
            console.error('Unable to complete referral:', error);
          }
        )
      )
      .subscribe();
  }

  deleteService() {
    this.makeAReferralService.removeService(
      this.service.serviceType,
      this.activatedRoute
    );
  }

  ngOnDestroy() {
    if (!this.didSuccessfullyCompleteReferral) {
      this.kinectWizardService.deleteKinectReferral(
        this.kinectCreateReferralResponse.referralId
      );
    }
  }
}
