import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  AssignFirstFillsToClaimState,
  FirstFillClaimSearchFormValues
} from './store/assign-first-fill-to-claim.reducer';
import { PageTitleService } from '@shared/service/page-title.service';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, takeUntil } from 'rxjs/operators';
import {
  selectClaimAssignmentInformation,
  selectCustomerIdFromLineItemDetails,
  selectFirstFillAssignToClaimServerErrors,
  selectFirstFillClaimSearchResults,
  selectFirstFillClaimSearchServerErrors,
  selectFirstFillInitialClaimSearchFormValues,
  selectFirstFillLineItemDetails,
  selectFirstFillSaveNoteOrMoveQueueServerErrors,
  selectFirstFillWebUserNotes,
  selectHaveServerErrors,
  selectIsLoadingFirstFillClaimSearchResults,
  selectIsLoadingFirstFillLinesToAssign,
  selectLoadingFirstFillLinesServerErrors,
  selectSaveNotesOrMoveInformation,
  selectTemporaryMemberIdFromRoute
} from './store/assign-first-fill-to-claim.selectors';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import {
  confirmAssignFirstFillToNewClaim,
  loadClaimSearchResults,
  loadFirstFillsToAssign,
  moveToNextQueue,
  saveSelectedClaim,
  saveWebUserNotes,
  saveWebUserNotesAndMoveToNextQueue
} from './store/assign-first-fill-to-claim.actions';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-assign-first-fill-to-claim',
  templateUrl: './assign-first-fill-to-claim.component.html',
  styleUrls: ['./assign-first-fill-to-claim.component.scss']
})
export class AssignFirstFillToClaimComponent extends DestroyableComponent
  implements OnInit {
  temporaryMemberId$: Observable<string> = this.store$.pipe(
    select(selectTemporaryMemberIdFromRoute)
  );

  haveServerErrors$ = this.store$.pipe(select(selectHaveServerErrors));
  customerId$: Observable<string> = this.store$.pipe(
    select(selectCustomerIdFromLineItemDetails)
  );

  // loading line items to assign
  isLoadingFirstFillLinesToAssign$ = this.store$.pipe(
    select(selectIsLoadingFirstFillLinesToAssign)
  );
  loadingFirstFillLinesToAssignServerErrors$ = this.store$.pipe(
    select(selectLoadingFirstFillLinesServerErrors)
  );
  lineItemDetailsList$ = this.store$.pipe(
    select(selectFirstFillLineItemDetails)
  );

  // save notes and move queue
  webUserNotes$: Observable<string> = this.store$.pipe(
    select(selectFirstFillWebUserNotes)
  );
  saveNotesOrMoveInformation$ = this.store$.pipe(
    select(selectSaveNotesOrMoveInformation)
  );
  firstFillSaveNoteOrMoveQueueServerErrors$ = this.store$.pipe(
    select(selectFirstFillSaveNoteOrMoveQueueServerErrors)
  );

  // claim search
  isLoadingFirstFillClaimSearchResults$ = this.store$.pipe(
    select(selectIsLoadingFirstFillClaimSearchResults)
  );
  firstFillInitialClaimSearchFormValues$ = this.store$.pipe(
    select(selectFirstFillInitialClaimSearchFormValues)
  );
  firstFillClaimSearchResults$ = this.store$.pipe(
    select(selectFirstFillClaimSearchResults)
  );
  firstFillClaimSearchServerErrors$ = this.store$.pipe(
    select(selectFirstFillClaimSearchServerErrors)
  );

  // save claim assignment
  claimAssignmentInformation$ = this.store$.pipe(
    select(selectClaimAssignmentInformation)
  );
  firstFillAssignToClaimServerErrors$ = this.store$.pipe(
    select(selectFirstFillAssignToClaimServerErrors)
  );

  faExclamationTriangle = faExclamationTriangle;

  @ViewChild('errorBannerSpacer')
  private errorBannerSpacer: ElementRef;

  constructor(
    private store$: Store<AssignFirstFillsToClaimState>,
    private pageTitleService: PageTitleService
  ) {
    super();

    this.temporaryMemberId$
      .pipe(
        takeUntil(this.onDestroy$),
        filter((temporaryMemberId) => !!temporaryMemberId)
      )
      .subscribe((temporaryMemberId) => {
        this.pageTitleService.setTitle(
          'Assign First Fill for ' + temporaryMemberId
        );
        this.store$.dispatch(loadFirstFillsToAssign({ temporaryMemberId }));
      });
  }

  ngOnInit() {
    this.haveServerErrors$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((errors) => {
        if (errors) {
          this.errorBannerSpacer.nativeElement.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          });
        }
      });
  }

  saveNotesClick(notes: string) {
    this.saveNotesOrMoveInformation$
      .pipe(
        takeUntil(this.onDestroy$),
        first()
      )
      .subscribe(({ temporaryMemberId, customerId }) => {
        this.store$.dispatch(
          saveWebUserNotes({ temporaryMemberId, customerId, notes })
        );
      });
  }

  moveToNextQueueClick() {
    this.saveNotesOrMoveInformation$
      .pipe(
        takeUntil(this.onDestroy$),
        first()
      )
      .subscribe(({ temporaryMemberId, customerId }) => {
        this.store$.dispatch(
          moveToNextQueue({ temporaryMemberId, customerId })
        );
      });
  }

  saveNotesAndMoveToNextQueueClick(notes: string) {
    this.saveNotesOrMoveInformation$
      .pipe(
        takeUntil(this.onDestroy$),
        first()
      )
      .subscribe(({ temporaryMemberId, customerId }) => {
        this.store$.dispatch(
          saveWebUserNotesAndMoveToNextQueue({
            temporaryMemberId,
            customerId,
            notes
          })
        );
      });
  }

  executeSearch(claimSearchFormValues: FirstFillClaimSearchFormValues) {
    this.store$.dispatch(loadClaimSearchResults({ claimSearchFormValues }));
  }

  saveSelectedClaim(selectedClaimNumber: string, selectedCustomerId: string) {
    this.store$.dispatch(
      saveSelectedClaim({ selectedClaimNumber, selectedCustomerId })
    );
  }

  assignToClaimClick() {
    this.claimAssignmentInformation$
      .pipe(
        takeUntil(this.onDestroy$),
        first(),
        distinctUntilChanged()
      )
      .subscribe(
        ({
          customerId,
          temporaryMemberId,
          selectedCustomerAndClaim: { selectedClaimNumber, selectedCustomerId }
        }) => {
          this.store$.dispatch(
            confirmAssignFirstFillToNewClaim({
              temporaryMemberId,
              selectedClaimNumber,
              selectedCustomerId,
              currentCustomerId: customerId
            })
          );
        }
      );
  }
}
