import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList, ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { HealtheTableColumnDef } from '@shared';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { Observable, zip } from 'rxjs';
import { first, map, takeUntil, filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { RootState } from '../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../store/selectors/router.selectors';
import {
  loadDiagnosticsAuthorizationHistory,
  loadDmeAuthorizationHistory,
  loadHomeHealthAuthorizationHistory,
  loadLanguageAuthorizationHistory,
  loadLegacyTransportationAuthorizationHistory,
  loadPhysicalMedicineAuthorizationHistory
} from '../../store/actions/authorization-history.actions';
import {
  AuthorizationHistoryGroup
} from '../../store/models/authorization-history.models';
import {
  getAuthorizationHistoryErrors,
  getAuthorizationHistoryGroups,
  isAuthorizationHistoryLoaded,
  isAuthorizationHistoryLoading
} from '../../store/selectors/authorization-history.selectors';
import {
  ReferralAuthorizationArchetype
} from '../referral-authorization/referral-authorization.models';
import {
  AuthHistoryGroupTableComponent
} from './auth-history-group-table/auth-history-group-table.component';
import { ReasonsModalComponent } from './reasons-modal/reasons-modal.component';
import {
  ServerErrorOverlayAnchorDirective
} from '@modules/server-error-overlay/server-error-overlay-anchor.directive';

@Component({
  selector: 'healthe-authorization-history',
  templateUrl: './authorization-history.component.html',
  styleUrls: ['./authorization-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AuthorizationHistoryComponent extends DestroyableComponent
  implements OnInit, AfterViewInit {
  @ViewChildren(AuthHistoryGroupTableComponent)
  authHistoryTables: QueryList<AuthHistoryGroupTableComponent>;
  @ViewChild(ServerErrorOverlayAnchorDirective)
  serverErrorOverlay: ServerErrorOverlayAnchorDirective;

  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;
  archetype$: Observable<ReferralAuthorizationArchetype> = this.store$.pipe(
    select(getAuthorizationArchetype)
  );
  isLoading$: Observable<boolean> = this.store$.pipe(
    select(isAuthorizationHistoryLoading)
  );
  isLoaded$ = this.store$.pipe(select(isAuthorizationHistoryLoaded));
  historyErrors$ = this.store$.pipe(
    select(getAuthorizationHistoryErrors),
    takeUntil(this.onDestroy$)
  );
  authorizationHistoryGroups$: Observable<
    AuthorizationHistoryGroup<any>[]
  > = this.store$.pipe(select(getAuthorizationHistoryGroups));
  referralHistoryQuery$ = zip(
    this.store$.pipe(select(getEncodedCustomerId)),
    this.store$.pipe(select(getEncodedReferralId))
  );
  private readonly authorizedDatesColumn = {
    name: 'authorizedDates',
    label: 'AUTHORIZED DATE(S)',
    headerClasses: ['auth-table--authorizedDates_header', 'auth-table_header'],
    cellClasses: ['auth-table--authorizedDates_cell', 'auth-table_cell']
  };
  private readonly actionColumn = {
    name: 'action',
    label: 'ACTION',
    cellClasses: ['auth-table_cell']
  };
  private readonly reasonsForReviewColumn = {
    name: 'reasonsForReview',
    label: 'REASON REVIEW IS NEEDED',
    headerClasses: [
      'auth-table--reasonReviewIsNeeded_header',
      'auth-table_header'
    ],
    cellClasses: ['auth-table_cell']
  };
  private readonly requestorRoleColumn = {
    name: 'requestorRole',
    label: 'REQUESTOR/ROLE',
    cellClasses: ['auth-table_cell']
  };
  private readonly amountAuthorizedColumn = {
    name: 'amountAuthorized',
    label: 'AMOUNT AUTHORIZED',
    cellClasses: ['auth-table_cell']
  };
  private readonly maxAmountAuthorizedColumn = {
    name: 'maxAmount',
    label: 'AMOUNT AUTHORIZED',
    cellClasses: ['auth-table_cell']
  };
  private readonly cumulativeNumberOfVisitsColumn = {
    name: 'cumulativeNumberOfVisits',
    label: 'CUMULATIVE # OF VISITS',
    headerClasses: [
      'auth-table--cumulativeNumberOfVisits_column',
      'auth-table_header'
    ],
    cellClasses: ['auth-table_cell']
  };
  private readonly cumulativeNumberOfTripsColumn = {
    name: 'cumulativeQuantity',
    label: 'CUMULATIVE # OF TRIPS',
    headerClasses: [
      'auth-table--cumulativeNumberOfTrips_column',
      'auth-table_header'
    ],
    cellClasses: ['auth-table_cell']
  };
  private readonly numberOfVisitsColumn = {
    name: 'numberOfVisits',
    label: '# OF VISITS',
    headerClasses: ['auth-table--numberOfVisits_header', 'auth-table_header'],
    cellClasses: ['auth-table_cell']
  };
  private readonly numberOfTripsColumn = {
    name: 'quantity',
    label: '# OF TRIPS',
    headerClasses: ['auth-table--numberOfVisits_header', 'auth-table_header'],
    cellClasses: ['auth-table_cell']
  };
  private readonly numberOfUnits = {
    name: 'numberOfUnits',
    label: '# OF UNITS',
    headerClasses: ['auth-table--numberOfUnits_header', 'auth-table_header'],
    cellClasses: ['auth-table_cell']
  };
  columnDefinitions$: Observable<
    HealtheTableColumnDef[]
  > = this.archetype$.pipe(
    map((archetype) => {
      switch (archetype) {
        case ReferralAuthorizationArchetype.Language:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            {
              name: 'numberOfAppointments',
              label: '# OF APPTS',
              cellClasses: [
                'auth-table--numberOfAppointments_cell',
                'auth-table_cell'
              ],
              headerClasses: [
                'auth-table--numberOfAppointments_header',
                'auth-table_header'
              ]
            },
            {
              name: 'cumulativeNumberOfAppointments',
              label: 'CUMULATIVE # OF APPTS',
              headerClasses: [
                'auth-table--cumulativeNumberOfAppointments_header',
                'auth-table_header'
              ],
              cellClasses: ['auth-table_cell']
            },
            this.amountAuthorizedColumn
          ];
        case ReferralAuthorizationArchetype.Diagnostics:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            {
              name: 'numberOfServices',
              label: '# OF SERVICES',
              headerClasses: [
                'auth-table--numberOfServices_header',
                'auth-table_header'
              ],
              cellClasses: ['auth-table_cell']
            }
          ];
        case ReferralAuthorizationArchetype.PhysicalMedicine:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            this.numberOfVisitsColumn,
            this.cumulativeNumberOfVisitsColumn
          ];
        case ReferralAuthorizationArchetype.HomeHealth:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            this.numberOfVisitsColumn,
            this.cumulativeNumberOfVisitsColumn,
            this.amountAuthorizedColumn
          ];
        case ReferralAuthorizationArchetype.Dme:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            this.numberOfUnits,
            this.amountAuthorizedColumn
          ];
        case ReferralAuthorizationArchetype.LegacyTransportation:
          return [
            this.actionColumn,
            this.reasonsForReviewColumn,
            this.requestorRoleColumn,
            this.authorizedDatesColumn,
            this.numberOfTripsColumn,
            this.cumulativeNumberOfTripsColumn,
            this.maxAmountAuthorizedColumn
          ];
        default:
          return [];
      }
    })
  );

  constructor(public store$: Store<RootState>, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.loadAuthorizationHistory();
  }

  ngAfterViewInit() {
    this.historyErrors$.pipe(
      filter(errors => !isEmpty(errors))
    ).subscribe(errors => this.doServerErrorOverlay(errors));
  }

  loadAuthorizationHistory() {
    zip(
      this.referralHistoryQuery$.pipe(
        first(),
        map(([encodedCustomerId, encodedReferralId]) => ({
          encodedReferralId,
          encodedCustomerCode: encodedCustomerId
        }))
      ),
      this.archetype$.pipe(first())
    ).subscribe(([query, archetype]) => {
      let action;
      switch (archetype) {
        case ReferralAuthorizationArchetype.Language:
          action = loadLanguageAuthorizationHistory(query);
          break;
        case ReferralAuthorizationArchetype.Diagnostics:
          action = loadDiagnosticsAuthorizationHistory(query);
          break;
        case ReferralAuthorizationArchetype.PhysicalMedicine:
          action = loadPhysicalMedicineAuthorizationHistory(query);
          break;
        case ReferralAuthorizationArchetype.HomeHealth:
          action = loadHomeHealthAuthorizationHistory(query);
          break;
        case ReferralAuthorizationArchetype.Dme:
          action = loadDmeAuthorizationHistory(query);
          break;
        case ReferralAuthorizationArchetype.LegacyTransportation:
          action = loadLegacyTransportationAuthorizationHistory(query);
          break;
      }
      if (action) {
        this.store$.dispatch(action);
      }
    });
  }

  toggleAll() {
    if (this.allTablesExpanded()) {
      this.authHistoryTables.forEach((table) => table.expansionPanel.close());
    } else {
      this.authHistoryTables.forEach((table) => table.expansionPanel.open());
    }
  }

  getToggleActionName() {
    return this.allTablesExpanded() ? 'COLLAPSE' : 'EXPAND';
  }

  allTablesExpanded(): boolean {
    return (
      this.authHistoryTables &&
      this.authHistoryTables
        .map(
          (table: AuthHistoryGroupTableComponent) =>
            table.expansionPanel.expanded
        )
        .every((expanded) => expanded)
    );
  }

  openReasonsModal($event: string[]) {
    this.dialog.open(ReasonsModalComponent, {
      data: $event,
      width: '750px'
    });
  }

  doServerErrorOverlay(errors: string[]): void {
    this.serverErrorOverlay.open(() => {
      this.serverErrorOverlay.detach();
      this.loadAuthorizationHistory();
    }, errors);
  }
}
