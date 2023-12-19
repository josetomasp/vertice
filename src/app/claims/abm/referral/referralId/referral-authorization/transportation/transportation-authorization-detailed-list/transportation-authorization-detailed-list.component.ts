import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faCarAlt } from '@fortawesome/pro-light-svg-icons';
import { select, Store } from '@ngrx/store';
import {
  generateABMReferralTimeOptions,
  HealtheSelectOption,
  TimeOption
} from '@shared';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  ClaimLocation,
  ReferralManagementTransportationType
} from '../../../../store/models/make-a-referral.models';
import {
  getTransportationAppointmentTypes,
  getTransportationTypes
} from '../../../../store/selectors/makeReferral.selectors';
import {
  ReferralAuthorizationItem,
  ReferralAuthorizationType,
  ReferralAuthorizationTypeCode
} from '../../referral-authorization.models';
import {
  CreateNewAuthorizationModalService
} from '../transportation-authorization/components/createNewAuthorization/create-new-authorization-modal/create-new-authorization-modal.service';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-transportation-authorization-detailed-list',
  templateUrl: './transportation-authorization-detailed-list.component.html',
  styleUrls: ['./transportation-authorization-detailed-list.component.scss']
})
export class TransportationAuthorizationDetailedListComponent
  extends DestroyableComponent
  implements OnInit {
  @Input() authData: ReferralAuthorizationItem[];
  @Input() formGroup: FormGroup;
  @Input() subHeaderNote: string = '';
  ReferralAuthorizationTypeCode = ReferralAuthorizationTypeCode;
  DetailedReferralAuthorizationType = ReferralAuthorizationType.DETAILED;
  timeDropdownValues: TimeOption[] = generateABMReferralTimeOptions(30);

  //#region   Observables
  transportationLocations$: Observable<
    HealtheSelectOption<ClaimLocation>[]
  > = of([]);
  transportationTypes$: Observable<ReferralManagementTransportationType[]> = of(
    []
  );
  //#endregion

  //#region   Icons
  faCarAlt = faCarAlt;

  //#endregion

  constructor(
    private readonly store$: Store<RootState>,
    private readonly createNewAuthorizationModalService: CreateNewAuthorizationModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.transportationTypes$ = this.store$.pipe(
      select(getTransportationTypes),
      takeUntil(this.onDestroy$),
      map((other) => other.types)
    );
  }

  //#region   Public Methods
  addTransportation(): void {
    combineLatest([
      this.transportationLocations$,
      this.store$.pipe(select(getTransportationAppointmentTypes))
    ])
      .pipe(first())
      .subscribe(([locations, appointmentTypes]) => {
        this.createNewAuthorizationModalService.showModal({
          locations,
          appointmentTypes,
          timeDropdownValues: this.timeDropdownValues
        });
      });
  }

  //#endregion
}
