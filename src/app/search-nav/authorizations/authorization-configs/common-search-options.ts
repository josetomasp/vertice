import { Observable } from 'rxjs/internal/Observable';
import { HealtheSelectOption } from '@shared';
import { of } from 'rxjs';

// These are line level statuses - the PBM endpoint is hit with no status filter
// and then the result authorizations[].lineItems[] arrays are iterated over to check each line
export const posAuthorizationStatusOptions$: Observable<
  HealtheSelectOption<string>[]
> = of<HealtheSelectOption<string>[]>([
  { label: 'All', value: '*' },
  { label: 'Authorization Required', value: 'AWAITING_DECISION' },
  { label: 'Ready for call-Approved', value: 'AWAITING_CALL' },
  { label: 'Ready for call-Denied', value: 'AWAITING_CALL_DENY' },
  { label: 'Completed', value: 'COMPLETE' }
]);
