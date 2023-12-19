export enum PbmStatus {
  // Authorization level only statuses
  READY_FOR_CALL_APPROVED = 'Ready For Call Approved',
  READY_FOR_CALL_DENIED = 'Ready For Call Denied',
  INITIAL = 'Auth Required',
  // Line level only statuses
  AWAITING_CALL = 'Awaiting Call Approved',
  AWAITING_CALL_DENY = 'Awaiting Call Denied',
  // Shared level statuses
  COMPLETE = 'Completed',
  SUBMITTED = 'Submitted',
  AWAITING_DECISION = 'Auth Required'
}
