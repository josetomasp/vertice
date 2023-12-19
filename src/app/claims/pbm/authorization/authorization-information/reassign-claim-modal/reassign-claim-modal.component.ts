import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PbmAuthSearchClaimResponse } from '../../store/models/pbm-authorization-reassignment.model';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { resetRxAuthorizationClaimSearchResult, searchRxAuthClaimForReassignment } from '../../store/actions/pbm-authorization-information.actions';
import { Observable } from 'rxjs';
import {
  getRxAuthorizationClaimSearchResult,
  isRxAuthorizationClaimSearching
} from '../../store/selectors/pbm-authorization-information.selectors';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReassignClaimModalValidators } from './reassign-claim-modal.validators';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';
import { isUserInternal } from '../../../../../user/store/selectors/user.selectors';

@Component({
  selector: 'healthe-reassign-claim-modal',
  templateUrl: './reassign-claim-modal.component.html',
  styleUrls: ['./reassign-claim-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReassignClaimModalComponent extends DestroyableComponent
  implements OnInit, AfterViewInit {
  isSearchingClaims$: Observable<boolean> = this.store$.pipe(
    select(isRxAuthorizationClaimSearching)
  );

  searchClaimsResult$: Observable<
    PbmAuthSearchClaimResponse[]
  > = this.store$.pipe(select(getRxAuthorizationClaimSearchResult));

  //#region   Public Properties
  @ViewChild('paginator', { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ERROR_MESSAGES = ERROR_MESSAGES;
  searchClickedOnce = false;
  userIsInternal$ = this.store$.pipe(select(isUserInternal));
  dataSource: MatTableDataSource<PbmAuthSearchClaimResponse>;
  reassignSearchFormGroup: FormGroup = new FormGroup(
    {
      claimNumber: new FormControl(
        null,
        ReassignClaimModalValidators.emptyOrMinLength(3)
      ),
      claimantLastName: new FormControl(
        null,
        ReassignClaimModalValidators.lastNameRequiredIfFirstName()
      ),
      claimantFirstName: new FormControl(),
      claimantSsn: new FormControl(
        null,
        ReassignClaimModalValidators.emptyOrMinLength(5)
      )
    },
    ReassignClaimModalValidators.formGroupHasSomeValues()
  );
  displayColumns: { label: string; name: string }[] = [
    { label: 'CLAIM NO.', name: 'claimNumber' },
    { label: 'CLAIMANT NAME ', name: 'claimantFullName' },
    { label: 'SSN', name: 'claimantSsn' },
    { label: 'DOB', name: 'claimantBirthDate' },
    { label: 'STATUS', name: 'pbmClaimStatus' }
  ];
  headerTable: string[] = [
    'claimNumber',
    'claimantFullName',
    'claimantSsn',
    'claimantBirthDate',
    'pbmClaimStatus',
    'select'
  ];
  selectedID: number;
  selectedPhiMemberId: string;
  showAdvancedSearch = false;
  initialNoSearchState = true;
  noDataForQueryVerbiage: string;
  //#region

  //#region   Constructor
  constructor(
    private dialogRef: MatDialogRef<any>,
    public store$: Store<RootState>,
    public changeDetectorRef: ChangeDetectorRef,
    protected verbiageService: VerbiageService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      claimantFirstName: string;
      claimantLastName: string;
      originalClaimNumber: string;
    }
  ) {
    super();
    this.dataSource = new MatTableDataSource();
    this.noDataForQueryVerbiage = verbiageService.getTableVerbiage(
      TableCondition.NoSearchPerformed
    );
  }

  //#endregion

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.store$.dispatch(resetRxAuthorizationClaimSearchResult());
    this.reassignSearchFormGroup
      .get('claimantFirstName')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((valeu) => {
        this.reassignSearchFormGroup
          .get('claimantLastName')
          .updateValueAndValidity();
      });

    this.searchClaimsResult$
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
        map((result) => result || [])
      )
      .subscribe((result) => {
        this.dataSource.data = result;

        if (!this.initialNoSearchState && result.length === 0) {
          this.noDataForQueryVerbiage =
            'No data found. Please try another search.';
        }
        this.changeDetectorRef.detectChanges();
      });

    // Set initial values
    this.reassignSearchFormGroup
      .get('claimantFirstName')
      .setValue(this.data.claimantFirstName);
    this.reassignSearchFormGroup
      .get('claimantLastName')
      .setValue(this.data.claimantLastName);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //#region

  //#region   Public Methods
  setSelected(claimID: number, phiMemberId: string): void {
    this.selectedID = claimID;
    this.selectedPhiMemberId = phiMemberId;
  }

  reset() {
    this.reassignSearchFormGroup.reset();
    this.dataSource.data = [];
    this.changeDetectorRef.detectChanges();
  }

  submit(): void {
    this.dialogRef.close({
      claimNumber: this.selectedID,
      phiMemberKey: this.selectedPhiMemberId
    });
  }

  searchForClaims() {
    this.searchClickedOnce = true;
    if (this.reassignSearchFormGroup.valid) {
      this.initialNoSearchState = false;
      this.store$.dispatch(
        searchRxAuthClaimForReassignment({
          searchRequest: this.reassignSearchFormGroup.getRawValue()
        })
      );
    }
  }

  //#region
}
