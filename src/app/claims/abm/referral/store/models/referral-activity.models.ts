import { Range } from '@healthe/vertice-library';

import { ReferralInformationRequest } from './index';

export interface ReferralActivityState {
  details: CurrentActivityState;
  referralNotes: ReferralNotesState;
}

export interface PostReferralNoteRequestObject {
  referralId: string;
  note: string;
  username?: string;
  archType: string;
}

export enum NoteOriginator {
  VERTICE = 'VERTICE',
  VENDOR = 'VENDOR'
}

export interface ReferralNote {
  noteOrigination: NoteOriginator;
  note: string;
  userCreated: string;
  dateCreated: string;
  timeCreated: string;
}

export enum ReferralActivityIcon {
  SEDAN = 'SEDAN',
  OTHER = 'OTHER',
  WHEELCHAIR = 'WHEELCHAIR',
  FLIGHT = 'FLIGHT',
  LODGING = 'LODGING'
}

export enum ServiceType {
  SEDAN = 'Sedan',
  OTHER = 'Other',
  WHEELCHAIR = 'Wheelchair',
  FLIGHT = 'Flight',
  LODGING = 'Lodging'
}

export interface ReferralActivityCardIcon {
  icon: ReferralActivityIcon;
  iconText: string;
}

export interface CardState<T> {
  title: string; // (el.1)
  iconInfo?: ReferralActivityCardIcon;
  clickAction?: CardAction; // (el.2)
  date?: string; // (el.3)
  time?: string; // (el.4)
  body?: string[][]; // (el.5)
  footerAction?: CardAction; // (el.6)
  footer?: CardFooter; // (el.7)
  subText?: string[]; // (el.8)
  stage: ReferralStage; // For determining lane and stage column'
  status: string;
  serviceType?: string;
  modalData: T;
  tableRow: ReferralDetailTableRow;
}

export interface ReferralDetailTableRow {
  date: string;
  stage: ReferralStage;
  actionDetail: string;
  notes: string;
  status: string;
  failureStatus: boolean;
  hasAddNoteButton?: boolean;
}

export enum ReferralStage {
  VENDOR_ASSIGNMENT = 'vendorAssignment',
  SCHEDULE_SERVICE = 'scheduleService',
  SERVICE_SCHEDULED = 'serviceScheduled',
  RESULTS = 'results',
  BILLING = 'billing',
  AUTHORIZATION_HISTORY = 'authorizationHistory'
}

export class ReferralStageUtil {
  static stageTranslation = {
    [ReferralStage.VENDOR_ASSIGNMENT]: 'Vendor Assignment',
    [ReferralStage.SCHEDULE_SERVICE]: 'Scheduling Status',
    [ReferralStage.SERVICE_SCHEDULED]: 'Service Scheduled',
    [ReferralStage.RESULTS]: 'Results',
    [ReferralStage.BILLING]: 'Billing',
    [ReferralStage.AUTHORIZATION_HISTORY]: 'Authorization History'
  };

  public static toString(stage: ReferralStage): string {
    return this.stageTranslation[stage];
  }
}

export interface CardAction {
  label: string;
  action: Function;
}

interface CardFooter {
  color: FooterColor;
  text: string;
  subText?: string;
}

export enum FooterColor {
  SUCCESS = 'success',
  FAIL = 'fail',
  NEUTRAL = 'neutral'
}

export interface GridLane {
  header: string;
  lane: ReferralStage;
  clickable?: boolean;
}

export interface ActivityTableFilters {
  date: Range;
  stage: ReferralStage;
  status: string;
}

export interface ReferralActivityContactAttempt {
  vendor: string;
  contactType: string;
  isContactSuccessful: string;
  notes: string;
  dateTime: string;
}

export interface CurrentActivityState {
  currentActivityCards: CardState<any>[];
  statusBar: CurrentActivityStatusBarState;
  activityTableFilters: ActivityTableFilters;
  selectedServiceType: string;
  hasAdditionalContactAttempts: boolean;
  allContactAttempts: ReferralActivityContactAttempt[];
  isLoading: boolean;
  errors: string[];
}

export interface ReferralNotesState {
  notes: ReferralNote[];
  errors: string[];
}

export interface ReferralCurrentActivity {
  currentActivityCards: CardState<any>[];
  statusBar: CurrentActivityStatusBarState;
}

export interface CurrentActivityStatusBarState {
  serviceTypes: string[];
  summations: {
    [key: string]: {
      authorized: string;
      scheduled: string;
      completed: string;
      billed: string;
    };
  };
}

export class ReferralTableDocumentExportRequest {
  exportType: string;
  fromDate: string = null;
  toDate: string = null;
  stages: string[];
  statuses: string[];
  encodedClaimNumber: string;
  encodedReferralId: string;
  encodedCustomerId: string;
  isCore: boolean = false;
}

export interface ReferralInformationServiceRequest
  extends ReferralInformationRequest {
  encodedReferralID: string;
  encoodedCustomerID: string;
}

export enum TransportationModalType {
  GROUND_SERVICE = 'GROUND_SERVICE',
  FLIGHT_SERVICE = 'FLIGHT_SERVICE',
  LODGING_SERVICE = 'LODGING_SERVICE'
}
